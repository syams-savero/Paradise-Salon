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
import { createHash, randomBytes, timingSafeEqual, createHmac } from "node:crypto";
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
  return createHmac("sha256", salt).update(password).digest("hex");
}

async function loadConfig() {
  if (process.env.CMS_USERNAME && process.env.CMS_PASSWORD) {
    const salt = createHash("sha256").update("env").digest("hex");
    return {
      username: process.env.CMS_USERNAME,
      salt,
      passwordHash: hashPassword(process.env.CMS_PASSWORD, salt),
    };
  }
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(await readFile(CONFIG_FILE, "utf8"));
  }
  const password = randomBytes(4).toString("hex");
  const salt = randomBytes(16).toString("hex");
  const cfg = {
    username: "admin",
    salt,
    passwordHash: hashPassword(password, salt),
  };
  await writeFile(CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf8");
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
    if (!p.startsWith(UPLOAD_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (await existsSafe(p)) {
      const ext = path.extname(p).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=604800",
      });
      return res.end(await readFile(p));
    }
    res.writeHead(404);
    return res.end("Not Found");
  }

  let file = path.normalize(path.join(OUT_DIR, pathname));
  if (!file.startsWith(OUT_DIR)) {
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

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

async function readBodyBuffer(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
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

async function handleApi(req, res, url, config) {
  const pathname = url.pathname;

  if (pathname === "/api/admin/login" && req.method === "POST") {
    const body = JSON.parse((await readBody(req)) || "{}");
    const hash = hashPassword(String(body.password || ""), config.salt);
    const ok =
      body.username === config.username &&
      timingSafeEqual(Buffer.from(hash), Buffer.from(config.passwordHash));
    if (!ok) return sendJson(res, 401, { authed: false, error: "Username atau password salah" });
    const token = createSession();
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": `cms_session=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`,
    });
    return res.end(JSON.stringify({ authed: true }));
  }

  if (pathname === "/api/admin/logout" && req.method === "POST") {
    const token = getToken(req);
    if (token) sessions.delete(token);
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": "cms_session=; HttpOnly; Path=/; Max-Age=0",
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
    try {
      const body = JSON.parse((await readBody(req)) || "{}");
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
      const buf = Buffer.from(await readBodyBuffer(req));
      const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
      const ct = req.headers["content-type"] || "";
      const mime = ct.split(";")[0].trim().toLowerCase();
      const fname = (url.searchParams.get("name") || "").toString();
      const fext = (path.extname(fname) || "").toLowerCase();
      if (!allow.has(fext) || !mime.startsWith("image/")) {
        return sendJson(res, 400, { error: "Hanya file gambar (jpg/png/webp/gif)" });
      }
      if (buf.length > 10 * 1024 * 1024) {
        return sendJson(res, 400, { error: "Maksimal 10MB" });
      }
      await mkdir(UPLOAD_DIR, { recursive: true });
      const name = Date.now() + "-" + randomBytes(4).toString("hex") + fext;
      await writeFile(path.join(UPLOAD_DIR, name), buf);
      return sendJson(res, 200, { url: "/uploads/" + name });
    } catch (e) {
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
