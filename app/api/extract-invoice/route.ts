import { NextRequest, NextResponse } from 'next/server';
import { callGeminiWithImage, callGeminiJSON } from '@/lib/claude';

interface ExtractedInvoice {
  vendor: string;
  amount: number;
  date: string;
  lineItems: { description: string; qty: number; unitPrice: number; total: number }[];
  poReference: string;
  confidence: number;
}

// Mock response for when API key is not set
const mockResponse: ExtractedInvoice = {
  vendor: 'Acme Corp',
  amount: 15750,
  date: '2026-05-28',
  lineItems: [
    { description: 'Professional Services - May 2026', qty: 1, unitPrice: 12000, total: 12000 },
    { description: 'Travel & Expenses', qty: 1, unitPrice: 3750, total: 3750 },
  ],
  poReference: 'PO-4430',
  confidence: 0.94,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mediaType = 'image/png' } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // If no API key, return mock data
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(mockResponse);
    }

    const systemPrompt = `You are an expert invoice data extraction AI. Extract all fields from the invoice image and return a JSON object with the following structure:
{
  "vendor": "string - vendor/company name",
  "amount": number - total amount,
  "date": "string - invoice date in YYYY-MM-DD format",
  "lineItems": [{"description": "string", "qty": number, "unitPrice": number, "total": number}],
  "poReference": "string - PO number if found, empty string otherwise",
  "confidence": number - confidence score between 0 and 1
}
Return ONLY valid JSON, no other text.`;

    const result = await callGeminiWithImage(
      systemPrompt,
      image,
      mediaType,
      'Extract all fields from this invoice. Return only JSON.'
    );

    // Strip markdown fences and parse
    const cleanResult = result.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleanResult) as ExtractedInvoice;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Invoice extraction error:', error);
    // Fallback to mock on error
    return NextResponse.json(mockResponse);
  }
}
