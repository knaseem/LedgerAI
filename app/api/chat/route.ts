import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { arInvoices, dunningQueue, saasData, cashFlowData, intelligenceAlerts, invoices, closeTasks } from '@/lib/mockData';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable. Please add it to .env.local' }), { status: 400 });
    }

    const systemPrompt = `You are LedgerAI, an advanced financial intelligence assistant. 
You answer questions about the company's financials based ONLY on the provided data context.
Be concise, professional, and highlight specific numbers, dates, or alerts.
If the user asks something not in the data, politely say you don't have that information.

Here is the current state of the company's financial data:
---
Invoices (AP): ${invoices.length} invoices, ${invoices.filter(i => i.status === 'exception').length} exceptions.
AR Invoices (Receivables): ${JSON.stringify(arInvoices)}
Dunning Queue: ${JSON.stringify(dunningQueue)}
SaaS Subscriptions: ${JSON.stringify(saasData)}
Cash Flow Forecast: ${JSON.stringify(cashFlowData)}
Active Intelligence Alerts: ${JSON.stringify(intelligenceAlerts)}
Financial Close Tasks: ${JSON.stringify(closeTasks)}
---
`;

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      messages,
      maxRetries: 0,
    });

    return (result as any).toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Sorry, I encountered an error while processing your request.' }), { status: 500 });
  }
}
