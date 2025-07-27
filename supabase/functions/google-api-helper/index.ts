import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const googleApiKey = 'AIzaSyCIuxmuZPvmmGlcMUgGdVODhjsXoH1yDnc';

    console.log('Google API Helper called with action:', action);

    let result;

    switch (action) {
      case 'process-document':
        result = await processDocument(data, googleApiKey);
        break;
      case 'extract-data':
        result = await extractTaxData(data, googleApiKey);
        break;
      case 'generate-report':
        result = await generateReportWithAI(data, googleApiKey);
        break;
      case 'analyze-compliance':
        result = await analyzeCompliance(data, googleApiKey);
        break;
      case 'smart-categorization':
        result = await smartCategorization(data, googleApiKey);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Google API Helper:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processDocument(data: any, apiKey: string) {
  const { documentText, documentType } = data;
  
  const prompt = `Analyze this ${documentType} document and extract relevant tax information:

${documentText}

Please extract and structure the following information in JSON format:
- Personal details (name, PAN, address)
- Income details (salary, business income, other sources)
- Deductions claimed
- Tax paid (TDS, advance tax, self-assessment)
- Important dates
- Any compliance issues or recommendations

Provide the response in valid JSON format.`;

  return await callGeminiAPI(prompt, apiKey);
}

async function extractTaxData(data: any, apiKey: string) {
  const { form26AS, aisData } = data;
  
  const prompt = `Extract and reconcile tax data from Form 26AS and AIS:

Form 26AS Data: ${JSON.stringify(form26AS)}
AIS Data: ${JSON.stringify(aisData)}

Please provide:
1. Reconciled income figures
2. TDS details with challan information
3. Any discrepancies found
4. Recommended actions for ITR filing
5. Missing information that needs to be verified

Format the response as structured JSON.`;

  return await callGeminiAPI(prompt, apiKey);
}

async function generateReportWithAI(data: any, apiKey: string) {
  const { reportType, clientData, period } = data;
  
  const prompt = `Generate a comprehensive ${reportType} report for the period ${period}:

Client Data: ${JSON.stringify(clientData)}

Please create:
1. Executive summary
2. Key findings and insights
3. Compliance status
4. Recommendations
5. Action items
6. Charts and graphs data (provide data for visualization)

Make it professional and suitable for CA practice management.`;

  return await callGeminiAPI(prompt, apiKey);
}

async function analyzeCompliance(data: any, apiKey: string) {
  const { filingData, deadlines } = data;
  
  const prompt = `Analyze compliance status and provide recommendations:

Filing Data: ${JSON.stringify(filingData)}
Upcoming Deadlines: ${JSON.stringify(deadlines)}

Please provide:
1. Compliance score (0-100)
2. Critical items requiring immediate attention
3. Upcoming deadline alerts
4. Risk assessment
5. Improvement recommendations
6. Automated action suggestions

Format as structured JSON with priorities.`;

  return await callGeminiAPI(prompt, apiKey);
}

async function smartCategorization(data: any, apiKey: string) {
  const { transactions, description } = data;
  
  const prompt = `Categorize these financial transactions for tax purposes:

Transactions: ${JSON.stringify(transactions)}
Context: ${description}

Please categorize each transaction into:
1. Income type (salary, business, capital gains, other)
2. Deduction category (80C, 80D, business expense, etc.)
3. Tax treatment
4. ITR schedule where it should be reported
5. Required supporting documents
6. Confidence level (0-100)

Provide structured JSON with explanations.`;

  return await callGeminiAPI(prompt, apiKey);
}

async function callGeminiAPI(prompt: string, apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.candidates && result.candidates[0] && result.candidates[0].content) {
    return result.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Unexpected response format from Gemini API');
  }
}