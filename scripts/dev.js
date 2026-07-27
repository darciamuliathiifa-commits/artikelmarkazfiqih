const path = require("node:path");
const { spawn } = require("node:child_process");

delete process.env.SSLKEYLOGFILE;
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, "--use-system-ca"]
  .filter(Boolean)
  .join(" ");

const bin = process.platform === "win32"
  ? path.resolve(__dirname, "../node_modules/.bin/next.cmd")
  : path.resolve(__dirname, "../node_modules/.bin/next");

const child = spawn(bin, ["dev"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
