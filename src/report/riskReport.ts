import { CommandFinding } from "../scanner/commandScanner";
import { FileFinding } from "../scanner/fileScanner";

type Finding = CommandFinding | FileFinding;
type RiskLevel = "SAFE" | "MEDIUM" | "HIGH";

export interface RiskReport {
  skill: string;
  risk: RiskLevel;
  score: number;
  findings: Finding[];
}

const POINTS = {
  DANGEROUS_COMMAND: 25,
  SENSITIVE_FILE_ACCESS: 15,
} as const;

function classifyRisk(score: number): RiskLevel {
  if (score <= 20) return "SAFE";
  if (score <= 40) return "MEDIUM";
  return "HIGH";
}

/** Build the final risk report from all scanner findings */
export function buildReport(
  skillName: string,
  commandFindings: CommandFinding[],
  fileFindings: FileFinding[]
): RiskReport {
  const findings: Finding[] = [...commandFindings, ...fileFindings];

  const score = findings.reduce((total, f) => total + POINTS[f.type], 0);

  return {
    skill: skillName,
    risk: classifyRisk(score),
    score,
    findings,
  };
}
