# CrawSecure

CrawSecure is an open-source security scanner for ClawHub skills.
It helps you decide whether a skill is safe before installing it.

- **Read-only** — CrawSecure never modifies the scanned skill or your system
- **Offline** — runs entirely on your machine, no network requests
- **No data exfiltration** — nothing is sent anywhere, ever

## Why CrawSecure?

ClawHub skills run with access to your system. A malicious or poorly written skill can execute dangerous commands, access sensitive files, or exfiltrate data. CrawSecure scans skill source code **before installation** and gives you a clear risk assessment.

## Installation

```bash
git clone https://github.com/crawsecure/crawsecure.git
cd crawsecure
npm install
npm run build
```

## Usage

```bash
node dist/index.js <path-to-skill>
```

Example:

```bash
node dist/index.js ./my-skill
```

## What It Detects

### Dangerous Commands
- `rm -rf` — destructive file deletion
- `eval(` — dynamic code execution
- `exec(` — process execution
- `spawn(` — child process creation
- `curl` — network requests
- `wget` — file downloads

### Sensitive File Access
- `.env` — environment variables / secrets
- `.ssh` — SSH keys and config
- `id_rsa` — private SSH keys
- `wallet` — cryptocurrency wallets
- `key` — generic key files

## Risk Scoring

| Type | Points |
|------|--------|
| Dangerous command | +25 |
| Sensitive file access | +15 |

### Classification

| Score | Level |
|-------|-------|
| 0-20 | SAFE |
| 21-40 | MEDIUM |
| 41+ | HIGH |

## Example Output

```json
{
  "skill": "example-skill",
  "risk": "MEDIUM",
  "score": 30,
  "findings": [
    {
      "type": "DANGEROUS_COMMAND",
      "value": "exec(",
      "file": "index.ts",
      "line": 12
    }
  ]
}
```

The process exits with code `2` when the risk level is **HIGH**, making it easy to integrate into CI pipelines.

## Security Notice

CrawSecure performs **static analysis only** (regex-based pattern matching). It does not execute any code from the scanned skill. While it catches common patterns, it is not a substitute for a full security audit. Always review skill source code manually before granting elevated permissions.

## Disclaimer

CrawSecure provides heuristic-based analysis and does not guarantee that a skill is safe. Use it as one layer of defense, not as your only one. The authors assume no liability for damages resulting from the use of skills analyzed by CrawSecure.

## Roadmap

- **Phase 2** — AST-based analysis, dependency auditing, network call detection, ClawHub API integration
- **Phase 3** — Sandbox execution, behavioral analysis, community reputation scoring, real-time monitoring

## License

MIT
