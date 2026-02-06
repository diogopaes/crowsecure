import * as fs from "fs";
import * as path from "path";
import dangerousCommands from "../rules/dangerousCommands.json";

export interface CommandFinding {
  type: "DANGEROUS_COMMAND";
  value: string;
  file: string;
  line: number;
}

const SCAN_EXTENSIONS = [".js", ".ts", ".json"];

/** Recursively collect files with target extensions */
function collectFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      results.push(...collectFiles(fullPath));
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

/** Scan a directory for dangerous commands in source files */
export function scanCommands(targetDir: string): CommandFinding[] {
  const findings: CommandFinding[] = [];
  const files = collectFiles(targetDir);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      for (const command of dangerousCommands) {
        if (lines[i].includes(command)) {
          findings.push({
            type: "DANGEROUS_COMMAND",
            value: command,
            file: path.relative(targetDir, filePath),
            line: i + 1,
          });
        }
      }
    }
  }

  return findings;
}
