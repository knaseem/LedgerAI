import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/claude';

interface ReconcileResult {
  bankId: string;
  ledgerId: string | null;
  status: 'matched' | 'unmatched' | 'partial';
  reasoning: string;
}

const mockResponse: ReconcileResult[] = [
  { bankId: 'BNK-001', ledgerId: 'GL-001', status: 'matched', reasoning: 'Amount, date, and description match within tolerance.' },
  { bankId: 'BNK-028', ledgerId: null, status: 'unmatched', reasoning: 'No corresponding ledger entry found. Unknown wire transfer requires manual review.' },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bankTransactions, ledgerEntries } = body;

    if (!bankTransactions || !ledgerEntries) {
      return NextResponse.json({ error: 'Bank transactions and ledger entries required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(mockResponse);
    }

    const systemPrompt = `You are a bank reconciliation agent. Match bank transactions to ledger entries.

For each bank transaction, find the best matching ledger entry based on:
1. Amount (exact or within 1% tolerance)
2. Date (within 3 business days)
3. Description similarity

Return a JSON array:
[{"bankId": "string", "ledgerId": "string or null", "status": "matched|unmatched|partial", "reasoning": "string"}]
Return ONLY valid JSON.`;

    const userMessage = `Bank Transactions: ${JSON.stringify(bankTransactions)}
Ledger Entries: ${JSON.stringify(ledgerEntries)}

Reconcile and return matches as JSON array.`;

    const result = await callGeminiJSON<ReconcileResult[]>(systemPrompt, userMessage, 4096);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json(mockResponse);
  }
}
