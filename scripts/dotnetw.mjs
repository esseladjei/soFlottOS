#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const fallbackDotnet =
  platform() === "win32"
    ? join(homedir(), ".dotnet", "dotnet.exe")
    : join(homedir(), ".dotnet", "dotnet");

const commands = ["dotnet", fallbackDotnet];

for (const command of commands) {
  if (command !== "dotnet") {
    try {
      accessSync(command, constants.X_OK);
    } catch {
      continue;
    }
  }

  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    if (command === "dotnet" && result.error.code === "ENOENT") {
      continue;
    }

    console.error(result.error.message);
    process.exit(result.status ?? 1);
  }

  process.exit(result.status ?? 0);
}

console.error("dotnet SDK is not installed or not available on PATH.");
process.exit(127);
