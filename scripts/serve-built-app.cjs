const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function proxyApi(req, res) {
  const upstream = http.request(
    {
      hostname: "localhost",
      port: 8080,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: "localhost:8080" },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    }
  );

  upstream.on("error", (error) => {
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Backend unavailable", detail: error.message }));
  });

  req.pipe(upstream);
}

function serveStatic(req, res) {
  const cleanPath = decodeURIComponent((req.url || "/").split("?")[0])
    .replace(/^[/\\]+/, "");
  let filePath = path.normalize(path.join(dist, cleanPath || "index.html"));

  if (!filePath.startsWith(dist)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(dist, "index.html");
  }

  res.writeHead(200, {
    "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
}

http
  .createServer((req, res) => {
    if ((req.url || "").startsWith("/api/")) {
      proxyApi(req, res);
      return;
    }

    serveStatic(req, res);
  })
  .listen(port, "0.0.0.0", () => {
    console.log(`Humara Pandit frontend running on http://localhost:${port}`);
  });
