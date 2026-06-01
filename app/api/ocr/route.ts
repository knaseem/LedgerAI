import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { fileData, mimeType } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY' }), { status: 400 });
    }

    const base64Content = fileData.split(',')[1] || fileData;
    const uint8Array = Buffer.from(base64Content, 'base64');

    const result = await generateObject({
      model: google('gemini-3.5-flash'),
      maxRetries: 0,
      schema: z.object({
        vendor: z.string().describe('The name of the vendor or company that issued the invoice.'),
        amount: z.number().describe('The total amount of the invoice. Remove any currency symbols.'),
        currency: z.string().describe('The 3-letter currency code, e.g. USD, EUR.'),
        date: z.string().describe('The date of the invoice in YYYY-MM-DD format.'),
        dueDate: z.string().describe('The due date of the invoice in YYYY-MM-DD format. If missing, guess +30 days from date.'),
        poNumber: z.string().describe('The Purchase Order (PO) number if present, otherwise an empty string.'),
        lineItems: z.array(
          z.object({
            description: z.string().describe('Description of the line item.'),
            qty: z.number().describe('Quantity of the item.'),
            unitPrice: z.number().describe('Unit price of the item.'),
            total: z.number().describe('Total price of the line item.')
          })
        ).describe('List of individual items on the invoice.')
      }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the invoice details from this document and return them as structured JSON data matching the schema. If it is a mock invoice, try to extract the logical data.' },
            {
              type: 'file',
              mediaType: mimeType,
              data: uint8Array,
            },
          ],
        },
      ],
    });

    return new Response(JSON.stringify(result.object), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('OCR API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to extract invoice data' }), { status: 500 });
  }
}
