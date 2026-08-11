#!/usr/bin/env node
/**
 * Paradise Salon CMS Server
 * Serve static build (out/) + API admin (login, content CRUD) + auto-rebuild.
 * No database: content stored in src/data/content.json (filesystem).
 *
 * Credentials:
 *   - Env: CMS_USERNAME, CMS_PASSWORD
 *   - atau file .cms-config.json (dibuat otomatis dgn password acak di run pertama)
 *
 * Usage:
 *   node cms.mjs            # serve port 3999
 *   PORT=8080 node cms.mjs
 */

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat, access, readdir, rm, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash, randomBytes, timingSafeEqual, createHmac, scryptSync } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const STAGE_DIR = path.join(ROOT, "out");
const OUT_DIR = path.join(ROOT, "site");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const CONTENT_FILE = path.join(ROOT, "src", "data", "content.json");
const CONFIG_FILE = path.join(ROOT, ".cms-config.json");
const PORT = Number(process.env.PORT) || 3999;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

/* ------------------------------- Auth config ------------------------------ */

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

async function loadConfig() {
  if (process.env.CMS_USERNAME && process.env.CMS_PASSWORD) {
    const salt = createHash("sha256").update(String(process.env.CMS_USERNAME) + ":" + process.env.CMS_PASSWORD.length).digest("hex") + randomBytes(4).toString("hex");
    return {
      username: process.env.CMS_USERNAME,
      salt,
      passwordHash: hashPassword(String(process.env.CMS_PASSWORD), salt),
    };
  }
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(await readFile(CONFIG_FILE, "utf8"));
  }
  const password = randomBytes(16).toString("hex");
  const salt = randomBytes(32).toString("hex");
  const cfg = {
    username: "admin",
    salt,
    passwordHash: hashPassword(password, salt),
  };
  await writeFile(CONFIG_FILE, JSON.stringify(cfg, null, 2) + "\n", "utf8");
  console.log("==============================================");
  console.log("  CMS PERTAMA KALI — simpan kredensial ini:");
  console.log(`    Username: admin`);
  console.log(`    Password: ${password}`);
  console.log("  (tersimpan di .cms-config.json)");
  console.log("==============================================");
  return cfg;
}

/* -------------------------------- Sessions -------------------------------- */

const sessions = new Map(); // token -> expiry ms
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8 jam

function createSession() {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

function sessionValid(token) {
  const exp = sessions.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    sessions.delete(token);
    return false;
  }
  return true;
}

/* -------------------------------- Rebuild -------------------------------- */

let building = false;
let lastBuild = null;

function triggerRebuild() {
  if (building) return { started: false, reason: "sudah berjalan" };
  building = true;
  lastBuild = "starting";
  const child = spawn("npm", ["run", "build"], {
    cwd: ROOT,
    shell: false,
    stdio: ["ignore", "ignore", "pipe"],
  });
  let log = "";
  child.stderr.on("data", (d) => (log += d));
  child.on("close", async (code) => {
    if (code === 0) {
      try {
        const tmp = OUT_DIR + ".tmp";
        await rm(tmp, { recursive: true, force: true });
        await rename(STAGE_DIR, tmp);
        await rm(OUT_DIR, { recursive: true, force: true });
        await rename(tmp, OUT_DIR);
      } catch (e) {
        code = 1;
        log += "\nSwap gagal: " + e.message;
      }
    }
    building = false;
    lastBuild = code === 0 ? "done" : "error";
    if (code !== 0) console.error("Rebuild gagal:\n", log);
  });
  return { started: true };
}

/* ------------------------------ Static files ------------------------------ */

async function safeReadDir(dir) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

async function serveStatic(reqUrl, res) {
  let pathname = decodeURIComponent(new URL(reqUrl, "http://x").pathname);

  if (pathname.startsWith("/uploads/")) {
    let p = path.normalize(path.join(UPLOAD_DIR, pathname.slice("/uploads/".length)));
    const base = UPLOAD_DIR + path.sep;
    if (!p.startsWith(base)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (await existsSafe(p)) {
      const ext = path.extname(p).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=604800",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      });
      return res.end(await readFile(p));
    }
    res.writeHead(404);
    return res.end("Not Found");
  }

  let file = path.normalize(path.join(OUT_DIR, pathname));
  const baseDir = OUT_DIR + path.sep;
  if (!file.startsWith(baseDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (pathname.endsWith("/") || !path.extname(pathname)) {
    const idx = path.join(file, "index.html");
    if (await existsSafe(idx)) {
      file = idx;
    } else if (!(await existsSafe(file))) {
      file = path.join(file, "index.html");
    }
  }

  if (await existsSafe(file)) {
    const statInfo = await stat(file);
    if (statInfo.isDirectory()) {
      const idx = path.join(file, "index.html");
      if (await existsSafe(idx)) file = idx;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    return res.end(await readFile(file));
  }

  res.writeHead(404);
  return res.end("Not Found");
}

async function existsSafe(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------- API ----------------------------------- */

async function readBody(req, limit = 1_000_000) {
  const chunks = [];
  let total = 0;
  for await (const c of req) {
    total += c.length;
    if (total > limit) {
      req.on("error", () => {});
      throw new Error("body_too_large");
    }
    chunks.push(c);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readBodyBuffer(req, limit = 10_000_000) {
  const chunks = [];
  let total = 0;
  for await (const c of req) {
    total += c.length;
    if (total > limit) {
      req.on("error", () => {});
      throw new Error("body_too_large");
    }
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function getToken(req) {
  const cookie = req.headers.cookie || "";
  const m = cookie.match(/cms_session=([^;]+)/);
  return m ? m[1] : null;
}

/* --------------------------- Rate limiting login --------------------------- */

const loginAttempts = new Map(); // ip -> { count, resetAt }
const LOGIN_MAX = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 0, resetAt: now + LOGIN_WINDOW });
    return true;
  }
  if (rec.count >= LOGIN_MAX) return false;
  return true;
}

function recordFailure(ip) {
  const rec = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + LOGIN_WINDOW };
  rec.count += 1;
  loginAttempts.set(ip, rec);
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return String(fwd).split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function sleepMs(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ---------------------------- Content validation ---------------------------- */

function isStr(v) {
  return typeof v === "string";
}

function isInt(v) {
  return Number.isInteger(v);
}

function isArrOf(arr, check) {
  return Array.isArray(arr) && arr.every(check);
}

function validateContent(c) {
  if (!c || typeof c !== "object") return "objek root";
  if (!c.site || !isStr(c.site.name)) return "site.name harus string";
  if (!isArrOf(c.services, (s) => s && isStr(s.name) && isStr(s.image))) return "services tidak valid";
  if (!isArrOf(c.packages, (p) => p && isStr(p.name))) return "packages tidak valid";
  if (!isArrOf(c.gallery, (g) => g && isStr(g.src) && isInt(g.width) && isInt(g.height))) return "gallery tidak valid";
  if (!isArrOf(c.testimonials, (t) => t && isStr(t.name) && isStr(t.quote))) return "testimonials tidak valid";
  if (!isArrOf(c.faqs, (f) => f && isStr(f.question) && isStr(f.answer))) return "faqs tidak valid";
  if (!c.stats || !Array.isArray(c.stats)) return "stats tidak valid";
  return null;
}

function validImageMagic(buf, ext) {
  if (!buf || buf.length < 16) return false;
  const b = buf;
  const isPng = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const isJpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isGif = b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38;
  const isWebp =
    b.slice(0, 4).toString("latin1") === "RIFF" && b.slice(8, 12).toString("latin1") === "WEBP";
  const map = {
    ".png": isPng,
    ".jpg": isJpeg,
    ".jpeg": isJpeg,
    ".gif": isGif,
    ".webp": isWebp,
  };
  return map[ext] === true;
}

async function handleApi(req, res, url, config) {
  const pathname = url.pathname;

  if (pathname === "/api/admin/login" && req.method === "POST") {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return sendJson(res, 429, { authed: false, error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." });
    }
    await sleepMs(300 + Math.floor(Math.random() * 500));
    let body = {};
    try {
      body = JSON.parse((await readBody(req, 10_000)) || "{}");
    } catch {
      return sendJson(res, 400, { authed: false, error: "Body tidak valid" });
    }
    const pw = String(body.password || "");
    const hash = hashPassword(pw, config.salt);
    const ok =
      body.username === config.username &&
      timingSafeEqual(Buffer.from(hash), Buffer.from(config.passwordHash));
    if (!ok) {
      recordFailure(ip);
      return sendJson(res, 401, { authed: false, error: "Username atau password salah" });
    }
    const token = createSession();
    const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": `cms_session=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax${secure}`,
    });
    return res.end(JSON.stringify({ authed: true }));
  }

  if (pathname === "/api/admin/logout" && req.method === "POST") {
    const token = getToken(req);
    if (token) sessions.delete(token);
    const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": `cms_session=; HttpOnly; Path=/; Max-Age=0${secure}`,
    });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (pathname === "/api/admin/me") {
    const token = getToken(req);
    return sendJson(res, 200, { authed: sessionValid(token) });
  }

  if (!sessionValid(getToken(req))) {
    return sendJson(res, 401, { authed: false, error: "Sesi berakhir, login ulang" });
  }

  if (pathname === "/api/admin/content" && req.method === "GET") {
    try {
      const raw = await readFile(CONTENT_FILE, "utf8");
      return sendJson(res, 200, JSON.parse(raw));
    } catch {
      return sendJson(res, 500, { error: "Gagal membaca konten" });
    }
  }

  if (pathname === "/api/admin/content" && req.method === "PUT") {
    let body;
    try {
      body = JSON.parse(await readBody(req, 1_000_000));
    } catch (e) {
      if (e.message === "body_too_large") {
        return sendJson(res, 413, { error: "Data terlalu besar" });
      }
      return sendJson(res, 400, { error: "Body tidak valid" });
    }
    const err = validateContent(body);
    if (err) return sendJson(res, 400, { error: "Konten tidak valid: " + err });
    try {
      if (await existsSafe(CONTENT_FILE)) {
        await writeFile(CONTENT_FILE + ".bak", await readFile(CONTENT_FILE), "utf8");
      }
      await writeFile(CONTENT_FILE, JSON.stringify(body, null, 2) + "\n", "utf8");
      const rb = triggerRebuild();
      return sendJson(res, 200, { ok: true, rebuilding: rb.started });
    } catch {
      return sendJson(res, 500, { error: "Gagal menyimpan konten" });
    }
  }

  if (pathname === "/api/admin/build-status") {
    return sendJson(res, 200, { building, lastBuild });
  }

  if (pathname === "/api/admin/upload" && req.method === "POST") {
    try {
      const buf = await readBodyBuffer(req);
      if (buf.length > 10 * 1024 * 1024) {
        return sendJson(res, 400, { error: "Maksimal 10MB" });
      }
      const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
      const ct = req.headers["content-type"] || "";
      const mime = ct.split(";")[0].trim().toLowerCase();
      const fname = (url.searchParams.get("name") || "").toString();
      const fext = (path.extname(fname) || "").toLowerCase();
      if (!allow.has(fext) || !mime.startsWith("image/")) {
        return sendJson(res, 400, { error: "Hanya file gambar (jpg/png/webp/gif)" });
      }
      if (!validImageMagic(buf, fext)) {
        return sendJson(res, 400, { error: "Isi file tidak cocok sebagai gambar" });
      }
      await mkdir(UPLOAD_DIR, { recursive: true });
      const name = Date.now() + "-" + randomBytes(8).toString("hex") + fext;
      await writeFile(path.join(UPLOAD_DIR, name), buf);
      return sendJson(res, 200, { url: "/uploads/" + name });
    } catch (e) {
      if (e.message === "body_too_large") {
        return sendJson(res, 413, { error: "Maksimal 10MB" });
      }
      console.error(e);
      return sendJson(res, 500, { error: "Upload gagal" });
    }
  }

  return sendJson(res, 404, { error: "Not Found" });
}

/* --------------------------------- Server --------------------------------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true }).catch(() => {});
  await mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});
  const config = await loadConfig();

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    try {
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url, config);
        return;
      }
      await serveStatic(req.url, res);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Paradise CMS server  →  http://0.0.0.0:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
  });
}

main();
