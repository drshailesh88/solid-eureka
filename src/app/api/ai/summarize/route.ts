import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

const SUMMARY_SYSTEM_PROMPT = `You are a medical document summarizer for an Indian EMR system.
Your task is to extract key information from medical documents (lab reports, prescriptions, discharge summaries).

IMPORTANT RULES:
1. Extract facts only - never invent or assume information
2. Use standard medical terminology
3. Flag any abnormal values in lab reports
4. Identify dates, doctor names, hospital names when present
5. Structure output clearly with sections

OUTPUT FORMAT:
- Document Type: [Lab Report / Prescription / Discharge Summary / Other]
- Date: [if found]
- Key Findings: [bullet points]
- Abnormal Values: [if any, with reference ranges]
- Diagnoses: [if mentioned]
- Medications: [if mentioned]
- Follow-up: [if mentioned]
- Timeline Events: [list of date + event pairs for patient timeline]`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { documentText, documentType } = await req.json();

  if (!documentText) {
    return new Response('Document text is required', { status: 400 });
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: SUMMARY_SYSTEM_PROMPT,
    prompt: `Please summarize the following ${documentType || 'medical document'}:\n\n${documentText}`,
    maxOutputTokens: 1000
  });

  return result.toTextStreamResponse();
}
