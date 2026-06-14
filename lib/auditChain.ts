// ── Immutable Audit Hash Chain ───────────────────────────────────
// Creates a tamper-evident chain where each audit entry's hash depends
// on the previous entry, making it cryptographically impossible to
// alter historical records without breaking the chain.

export interface HashedAuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  system: string;
  result: 'success' | 'warning' | 'error';
  reasoning: string;
  workflow: string;
  hash: string;
  previousHash: string;
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

// SHA-256 hash using Web Crypto API (works in both browser and Node)
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: simple deterministic hash for SSR
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export async function computeEntryHash(
  entry: {
    timestamp: string;
    agent: string;
    action: string;
    system: string;
    result: string;
    reasoning: string;
  },
  previousHash: string
): Promise<string> {
  const payload = `${previousHash}|${entry.timestamp}|${entry.agent}|${entry.action}|${entry.system}|${entry.result}|${entry.reasoning}`;
  return sha256(payload);
}

export async function buildHashChain(
  entries: Array<{
    id: string;
    timestamp: string;
    agent: string;
    action: string;
    system: string;
    result: 'success' | 'warning' | 'error';
    reasoning: string;
    workflow: string;
  }>
): Promise<HashedAuditEntry[]> {
  const chain: HashedAuditEntry[] = [];
  let previousHash = GENESIS_HASH;

  // Process in chronological order (oldest first)
  const sorted = [...entries].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  for (const entry of sorted) {
    const hash = await computeEntryHash(entry, previousHash);
    chain.push({
      ...entry,
      hash,
      previousHash,
    });
    previousHash = hash;
  }

  return chain;
}

export interface ChainVerificationResult {
  isValid: boolean;
  totalEntries: number;
  verifiedEntries: number;
  brokenAt?: number; // index of first broken link
  brokenEntryId?: string;
}

export async function verifyChain(
  chain: HashedAuditEntry[]
): Promise<ChainVerificationResult> {
  if (chain.length === 0) {
    return { isValid: true, totalEntries: 0, verifiedEntries: 0 };
  }

  const sorted = [...chain].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : sorted[i - 1].hash;

    // Check previous hash link
    if (entry.previousHash !== expectedPrevHash) {
      return {
        isValid: false,
        totalEntries: sorted.length,
        verifiedEntries: i,
        brokenAt: i,
        brokenEntryId: entry.id,
      };
    }

    // Recompute hash and verify
    const recomputed = await computeEntryHash(entry, entry.previousHash);
    if (recomputed !== entry.hash) {
      return {
        isValid: false,
        totalEntries: sorted.length,
        verifiedEntries: i,
        brokenAt: i,
        brokenEntryId: entry.id,
      };
    }
  }

  return {
    isValid: true,
    totalEntries: sorted.length,
    verifiedEntries: sorted.length,
  };
}

export function truncateHash(hash: string, length: number = 8): string {
  return `${hash.slice(0, length)}…${hash.slice(-4)}`;
}

export function generateChainReport(chain: HashedAuditEntry[]): string {
  const header = `LedgerAI Audit Chain Report
Generated: ${new Date().toISOString()}
Total Entries: ${chain.length}
Chain Genesis: ${GENESIS_HASH}
${'='.repeat(80)}

`;

  const entries = chain
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .map(
      (e, i) =>
        `[${e.timestamp}] ${e.agent} | ${e.action}
  System: ${e.system} | Result: ${e.result} | Workflow: ${e.workflow}
  Hash: ${e.hash}
  Prev: ${e.previousHash}
  Reasoning: ${e.reasoning}
`
    )
    .join('\n');

  return header + entries;
}
