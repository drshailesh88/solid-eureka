import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Azure Computer Vision OCR endpoint
const AZURE_ENDPOINT = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
const AZURE_KEY = process.env.AZURE_COMPUTER_VISION_KEY;

interface OcrResult {
  text: string;
  confidence: number;
  pages: number;
}

async function performAzureOcr(imageUrl: string): Promise<OcrResult> {
  if (!AZURE_ENDPOINT || !AZURE_KEY) {
    throw new Error('Azure Computer Vision credentials not configured');
  }

  // Step 1: Submit the image for analysis
  const analyzeUrl = `${AZURE_ENDPOINT}/vision/v3.2/read/analyze`;

  const submitResponse = await fetch(analyzeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': AZURE_KEY
    },
    body: JSON.stringify({ url: imageUrl })
  });

  if (!submitResponse.ok) {
    const error = await submitResponse.text();
    throw new Error(`Azure OCR submission failed: ${error}`);
  }

  // Get the operation location from headers
  const operationLocation = submitResponse.headers.get('Operation-Location');
  if (!operationLocation) {
    throw new Error('No operation location returned from Azure');
  }

  // Step 2: Poll for results
  let result;
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const resultResponse = await fetch(operationLocation, {
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY
      }
    });

    result = await resultResponse.json();

    if (result.status === 'succeeded') {
      break;
    } else if (result.status === 'failed') {
      throw new Error('Azure OCR processing failed');
    }

    attempts++;
  }

  if (!result || result.status !== 'succeeded') {
    throw new Error('Azure OCR timed out');
  }

  // Extract text from results
  const lines: string[] = [];
  let totalConfidence = 0;
  let lineCount = 0;

  for (const readResult of result.analyzeResult?.readResults || []) {
    for (const line of readResult.lines || []) {
      lines.push(line.text);
      if (line.confidence) {
        totalConfidence += line.confidence;
        lineCount++;
      }
    }
  }

  return {
    text: lines.join('\n'),
    confidence: lineCount > 0 ? totalConfidence / lineCount : 0,
    pages: result.analyzeResult?.readResults?.length || 1
  };
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentId, fileUrl } = await req.json();

  if (!documentId || !fileUrl) {
    return Response.json(
      { error: 'documentId and fileUrl are required' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  try {
    // Update document status to processing
    await supabase
      .from('documents')
      .update({ ocr_status: 'processing' })
      .eq('id', documentId)
      .eq('owner_id', userId);

    // Perform OCR
    const ocrResult = await performAzureOcr(fileUrl);

    // Update document with OCR results
    const { error } = await supabase
      .from('documents')
      .update({
        extracted_text: ocrResult.text,
        ocr_status: 'completed',
        ocr_confidence: ocrResult.confidence,
        ocr_pages: ocrResult.pages,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('owner_id', userId);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      pages: ocrResult.pages
    });
  } catch (error) {
    // Update document with error status
    await supabase
      .from('documents')
      .update({
        ocr_status: 'error',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('owner_id', userId);

    const message = error instanceof Error ? error.message : 'OCR failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
