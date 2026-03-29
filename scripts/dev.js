const { spawn } = require("child_process");

const processes = [];

const run = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: "pipe"
  });

  const prefix = `[${name}]`;

  child.stdout.on("data", (data) => {
    process.stdout.write(`${prefix} ${data}`);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(`${prefix} ${data}`);
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      process.exitCode = code || 1;
    }
  });

  processes.push(child);
};

run("server", "npm.cmd", ["run", "dev"], "server");
run("client", "npm.cmd", ["run", "dev"], "client");

const shutdown = () => {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
