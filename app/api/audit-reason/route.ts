import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/claude';

const mockResponse = {
  reasoning: 'The agent processed invoice INV-2026-001 from Accenture for $84,000. The invoice was successfully matched against Purchase Order PO-4410 and Goods Receipt Note GRN-7701. All amounts align with zero variance. The invoice was auto-approved per the company\'s approval policy for matched invoices under $100,000 with single-approver authority.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, context } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action description required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(mockResponse);
    }

    const systemPrompt = `You are a finance audit reasoning agent. Given an agent action and its context, provide a clear, plain-English explanation of why this action was taken, what data was analyzed, and what the outcome was. Be specific about amounts, dates, and document references. Keep the response concise but thorough (2-4 sentences).`;

    const userMessage = `Agent Action: ${action}
Context: ${JSON.stringify(context)}

Provide a plain-English reasoning explanation for this action.`;

    const reasoning = await callGemini(systemPrompt, userMessage, 512);
    return NextResponse.json({ reasoning });
  } catch (error) {
    console.error('Audit reasoning error:', error);
    return NextResponse.json(mockResponse);
  }
}
