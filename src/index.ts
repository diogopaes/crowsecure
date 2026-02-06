import * as path from "path";
import * as fs from "fs";
import { scanCommands } from "./scanner/commandScanner";
import { scanFiles } from "./scanner/fileScanner";
import { buildReport } from "./report/riskReport";

function main(): void {
  const targetPath = process.argv[2];

  if (!targetPath) {
    console.error("Usage: crawsecure <path-to-skill>");
    console.error("Example: node dist/index.js ./skill-to-analyze");
    process.exit(1);
  }

  const resolvedPath = path.resolve(targetPath);

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    console.error(`Error: "${resolvedPath}" is not a valid directory.`);
    process.exit(1);
  }

  const skillName = path.basename(resolvedPath);

  // Run scanners
  const commandFindings = scanCommands(resolvedPath);
  const fileFindings = scanFiles(resolvedPath);

  // Build and print report
  const report = buildReport(skillName, commandFindings, fileFindings);

  console.log(JSON.stringify(report, null, 2));

  // Exit with non-zero code if risk is HIGH
  if (report.risk === "HIGH") {
    process.exit(2);
  }
}

main();
