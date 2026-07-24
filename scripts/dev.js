// Avast's SSL filter driver (aswMonFltProxy) intercepts outbound HTTPS and
// re-signs certs with a locally-trusted root CA that Node's bundled Mozilla
// CA list doesn't know about, so long-running Node processes (`next dev`)
// fail DB queries to Neon with UNABLE_TO_VERIFY_LEAF_SIGNATURE. Trust the
// Windows system CA store instead so Avast's cert verifies.
delete process.env.SSLKEYLOGFILE;
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, "--use-system-ca"]
  .filter(Boolean)
  .join(" ");

// eslint-disable-next-line @typescript-eslint/no-require-imports -- plain CJS script, run directly by `node`
const { spawn } = require("node:child_process");

const child = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
