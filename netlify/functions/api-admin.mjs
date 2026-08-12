/**
 * Paradise Salon CMS — Netlify Function (Fase 1)
 * Menggantikan cms.mjs di produksi. Datastore = GitHub repo (branch main).
 *
 * Env yang wajib di Netlify:
 *   CMS_USERNAME  — username admin
 *   CMS_PASSWORD  — password admin
 *   CMS_SECRET    — kunci signing token HMAC (acak, panjang)
 *   GH_TOKEN      — fine-grained PAT, permissions: Contents Read and write
 *   GH_OWNER      — pemilik repo (mis. syams-savero)
 *   GH_REPO       — nama repo (mis. Paradise-Salon)
 *   GH_BRANCH     — opsional, default "main"
 *
 * Endpoint (sama seperti cms.mjs, dipanggil admin UI tanpa perubahan):
 *   POST /api/admin/login   -> { authed }
 *   GET  /api/admin/me      -> { authed }
 *   POST /api/admin/logout  -> { ok }
 *   GET  /api/admin/content -> konten JSON
 *   PUT  /api/admin/content -> save + commit ke GitHub
 *   GET  /api/admin/build-status
 *   POST /api/admin/upload  -> commit gambar ke public/uploads/
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const CONTENT_PATH = "src/data/content.json";
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8 jam
const LOGIN_MAX = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;
const UPLOAD_MAX = 4 * 1024 * 1024; // Netlify buffered payload 6MB (base64 ~+30%) → aman di 4MB

const env = (k, d = "") => process.env[k] || d;
const GH = {
  token: env("GH_TOKEN"),
  owner: env("GH_OWNER"),
  repo: env("GH_REPO"),
  branch: env("GH_BRANCH", "main"),
};
const CMS = {
  username: env("CMS_USERNAME"),
  password: env("CMS_PASSWORD"),
  secret: env("CMS_SECRET", env("CMS_PASSWORD")),
};

let rateStore = null;
let rateStoreChecked = false;
let rateFallback = new Map();

async function getRateStore() {
  if (rateStoreChecked) return rateStore;
  rateStoreChecked = true;
  try {
    const { getStore } = await import("@netlify/blobs");
    rateStore = getStore("cms-login");
  } catch {
    rateStore = null;
  }
  return rateStore;
}

function sendJson(statusCode, obj, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
    body: JSON.stringify(obj),
  };
}

function cookie(name, value, maxAge) {
  return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

function signToken(username) {
  const payload = `${username}.${Date.now() + SESSION_TTL}`;
  const sig = createHmac("sha256", CMS.secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, expStr, sig] = parts;
  if (!safeEqual(username, CMS.username)) return false;
  const expected = createHmac("sha256", CMS.secret).update(`${username}.${expStr}`).digest("hex");
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(expStr) > Date.now();
}

function getToken(event) {
  const c = event.cookies || [];
  const found = c.find((x) => x.startsWith("cms_session="));
  if (found) return found.slice("cms_session=".length);
  return null;
}

function getClientIp(event) {
  const h = event.headers || {};
  return h["x-nf-client-connection-ip"] || h["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
}

async function getRateRec(ip) {
  const store = await getRateStore();
  if (store) {
    try {
      const rec = await store.get(ip, { type: "json" });
      return rec || null;
    } catch {
      return rateFallback.get(ip) || null;
    }
  }
  return rateFallback.get(ip) || null;
}

async function setRateRec(ip, rec) {
  const store = await getRateStore();
  if (store) {
    try {
      await store.set(ip, rec);
      return;
    } catch {
      rateFallback.set(ip, rec);
      return;
    }
  }
  rateFallback.set(ip, rec);
}

async function checkRateLimit(event) {
  const ip = getClientIp(event);
  const now = Date.now();
  const rec = await getRateRec(ip);
  if (!rec || now > rec.resetAt) {
    await setRateRec(ip, { count: 0, resetAt: now + LOGIN_WINDOW });
    return true;
  }
  return rec.count < LOGIN_MAX;
}

async function recordFailure(event) {
  const ip = getClientIp(event);
  const now = Date.now();
  const rec = (await getRateRec(ip)) || { count: 0, resetAt: now + LOGIN_WINDOW };
  rec.count += 1;
  await setRateRec(ip, rec);
}

const sleepMs = (ms) => new Promise((r) => setTimeout(r, ms));

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
  const map = { ".png": isPng, ".jpg": isJpeg, ".jpeg": isJpeg, ".gif": isGif, ".webp": isWebp };
  return map[ext] === true;
}

/* ------------------------------ GitHub API ------------------------------ */

async function ghRequest(method, url, { json, raw = false } = {}) {
  const res = await fetch(`https://api.github.com${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${GH.token}`,
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      ...(json ? { "Content-Type": "application/json" } : {}),
    },
    body: json ? JSON.stringify(json) : undefined,
  });
  if (raw) return { status: res.status, text: await res.text() };
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function getFileSha(filePath) {
  const { status, data } = await ghRequest("GET", `/repos/${GH.owner}/${GH.repo}/contents/${filePath}`);
  if (status !== 200 || !data) return null;
  return data.sha;
}

async function commitFile(filePath, buffer, message) {
  const sha = await getFileSha(filePath);
  const json = {
    message,
    branch: GH.branch,
    content: buffer.toString("base64"),
  };
  if (sha) json.sha = sha;
  return ghRequest("PUT", `/repos/${GH.owner}/${GH.repo}/contents/${filePath}`, { json });
}

/* -------------------------------- Routes -------------------------------- */

async function handleLogin(event) {
  if (!(await checkRateLimit(event))) {
    return sendJson(429, { authed: false, error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." });
  }
  await sleepMs(300 + Math.floor(Math.random() * 500));
  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return sendJson(400, { authed: false, error: "Body tidak valid" });
  }
  if (!safeEqual(body.username, CMS.username) || !safeEqual(body.password, CMS.password)) {
    await recordFailure(event);
    return sendJson(401, { authed: false, error: "Username atau password salah" });
  }
  const token = signToken(CMS.username);
  return sendJson(200, { authed: true }, { "Set-Cookie": cookie("cms_session", token, SESSION_TTL / 1000) });
}

async function handleContentGet() {
  const { status, text } = await ghRequest("GET", `/repos/${GH.owner}/${GH.repo}/contents/${CONTENT_PATH}`, { raw: true });
  if (status !== 200) return sendJson(500, { error: "Gagal membaca konten dari GitHub" });
  try {
    return sendJson(200, JSON.parse(text));
  } catch {
    return sendJson(500, { error: "Konten di GitHub tidak valid" });
  }
}

async function handleContentPut(event) {
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return sendJson(400, { error: "Body tidak valid" });
  }
  const err = validateContent(body);
  if (err) return sendJson(400, { error: "Konten tidak valid: " + err });
  const res = await commitFile(
    CONTENT_PATH,
    Buffer.from(JSON.stringify(body, null, 2) + "\n"),
    `content: update via CMS — ${new Date().toISOString()}`
  );
  if (res.status !== 200 && res.status !== 201) {
    return sendJson(500, { error: "Gagal menyimpan ke GitHub. Cek token GH_TOKEN." });
  }
  return sendJson(200, { ok: true, rebuilding: true });
}

async function handleUpload(event) {
  const nameParam = String(
    (event.queryStringParameters && event.queryStringParameters.name) || ""
  );
  const ext = (nameParam.match(/\.[a-zA-Z0-9]+$/) || [""])[0].toLowerCase();
  const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const ct = (event.headers && event.headers["content-type"]) || "";
  if (!allow.has(ext) || !ct.startsWith("image/")) {
    return sendJson(400, { error: "Hanya file gambar (jpg/png/webp/gif)" });
  }
  let buf;
  try {
    buf = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "binary");
  } catch {
    return sendJson(400, { error: "Isi file tidak terbaca" });
  }
  if (buf.length > UPLOAD_MAX) return sendJson(400, { error: "Maksimal 4MB" });
  if (!validImageMagic(buf, ext)) {
    return sendJson(400, { error: "Isi file tidak cocok sebagai gambar" });
  }
  const name = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const filePath = `public/uploads/${name}`;
  const res = await commitFile(
    filePath,
    buf,
    `upload: ${name} — ${new Date().toISOString()}`
  );
  if (res.status !== 200 && res.status !== 201) {
    return sendJson(500, { error: "Upload gagal — cek token GH_TOKEN" });
  }
  return sendJson(200, { url: `/uploads/${name}` });
}

export async function handler(event) {
  const headers = event.headers || {};
  const originalPath =
    event.path || headers["x-netlify-original-pathname"] || headers["x-netlify-original-path"] || "/";
  let pathname;
  try {
    pathname = new URL(originalPath, "https://netlify.functions").pathname;
  } catch {
    pathname = originalPath;
  }
  const method = event.httpMethod || "GET";

  try {
    if (pathname === "/api/admin/login" && method === "POST") return await handleLogin(event);

    if (pathname === "/api/admin/logout" && method === "POST") {
      return sendJson(200, { ok: true }, { "Set-Cookie": cookie("cms_session", "", 0) });
    }

    if (pathname === "/api/admin/me") {
      return sendJson(200, { authed: verifyToken(getToken(event)) });
    }

    if (!verifyToken(getToken(event))) {
      return sendJson(401, { authed: false, error: "Sesi berakhir, login ulang" });
    }

    if (pathname === "/api/admin/content" && method === "GET") return await handleContentGet();
    if (pathname === "/api/admin/content" && method === "PUT") return await handleContentPut(event);
    if (pathname === "/api/admin/build-status") {
      return sendJson(200, { building: false, lastBuild: null });
    }
    if (pathname === "/api/admin/upload" && method === "POST") return await handleUpload(event);

    return sendJson(404, { error: "Not Found" });
  } catch (e) {
    return sendJson(500, { error: "Server error: " + (e.message || "unknown") });
  }
}