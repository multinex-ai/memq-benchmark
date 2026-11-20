import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([".git", "node_modules", ".venv-mem0", "dist"]);
const FORBIDDEN_PATTERNS = [
  { label: "internal Dockerfile.munx path", regex: /Dockerfile\.munx/i },
  { label: "internal munx-cli command", regex: /\bmunx-cli\b/i },
  { label: "internal munx up command", regex: /\bmunx up\b/i },
  { label: "local macOS home path", regex: /\/Users\/[A-Za-z0-9._-]+\// },
  { label: "private key header", regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (fullPath.endsWith("check-public-hygiene.mjs")) continue;
    if (!/\.(json|jsonl|md|ts|mjs|js|yml|yaml|txt)$/i.test(entry)) continue;
    const content = readFileSync(fullPath, "utf8");
    const rel = path.relative(ROOT, fullPath);
    for (const { label, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(content)) {
        violations.push(`${rel}: matched ${label}`);
      }
    }
  }
}

walk(ROOT);

if (violations.length > 0) {
  console.error("Public hygiene check failed:\n" + violations.map((v) => `  - ${v}`).join("\n"));
  process.exit(1);
}

console.log("Public hygiene check passed: 0 internal path or secret violations.");
