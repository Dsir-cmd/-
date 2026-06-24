/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const section = process.argv[2] || "profile";
const output =
  process.argv[3] || path.resolve("docs", "codex", `${section}-screenshot.png`);
const port = 9400 + Math.floor(Math.random() * 1000);
const userData = path.join(os.tmpdir(), `codex-capture-${Date.now()}-${port}`);
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userData}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);

async function connect() {
  for (let i = 0; i < 50; i += 1) {
    try {
      return await fetch(`http://127.0.0.1:${port}/json/version`).then((response) =>
        response.json(),
      );
    } catch {
      await sleep(100);
    }
  }

  throw new Error("Browser did not expose the debugging endpoint.");
}

async function main() {
  const version = await connect();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const callId = (id += 1);
      pending.set(callId, (message) => {
        if (message.error) {
          reject(new Error(`${method}: ${message.error.message}`));
          return;
        }

        resolve(message);
      });
      ws.send(JSON.stringify({ id: callId, method, params, sessionId }));
    });

  const target = await send("Target.createTarget", { url: "about:blank" });
  const attached = await send("Target.attachToTarget", {
    targetId: target.result.targetId,
    flatten: true,
  });
  const sessionId = attached.result.sessionId;

  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send(
    "Emulation.setDeviceMetricsOverride",
    { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false },
    sessionId,
  );

  await send(
    "Page.navigate",
    { url: `http://localhost:5173/?capture=${encodeURIComponent(section)}` },
    sessionId,
  );
  await sleep(2500);

  const state = await send(
    "Runtime.evaluate",
    {
      expression:
        "JSON.stringify({ className: document.querySelector('main')?.className || '', title: document.title, ready: document.readyState })",
      returnByValue: true,
    },
    sessionId,
  );

  const shot = await send(
    "Page.captureScreenshot",
    { format: "png", captureBeyondViewport: false },
    sessionId,
  );

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, Buffer.from(shot.result.data, "base64"));
  console.log(state.result.result.value);
  console.log(output);

  ws.close();
  chrome.kill();
  try {
    fs.rmSync(userData, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
  } catch {
    // Chrome can release its temporary profile slightly after the screenshot is written.
  }
}

main().catch((error) => {
  console.error(error);
  chrome.kill();
  try {
    fs.rmSync(userData, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
  } catch {
    // Preserve the original capture error.
  }
  process.exit(1);
});
