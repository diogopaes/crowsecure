import * as fs from "fs";
import * as path from "path";
import sensitiveFiles from "../rules/sensitiveFiles.json";

export interface FileFinding {
  type: "SENSITIVE_FILE_ACCESS";
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
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      results.push(...collectFiles(fullPath));
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

/** Scan a directory for references to sensitive files */
export function scanFiles(targetDir: string): FileFinding[] {
  const findings: FileFinding[] = [];
  const files = collectFiles(targetDir);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      for (const pattern of sensitiveFiles) {
        if (lines[i].includes(pattern)) {
          findings.push({
            type: "SENSITIVE_FILE_ACCESS",
            value: pattern,
            file: path.relative(targetDir, filePath),
            line: i + 1,
          });
        }
      }
    }
  }

  return findings;
}
