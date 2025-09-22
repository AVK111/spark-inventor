import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Solution {
  title: string;
  description: string;
  feasibilityScore: number;
  costEstimate: string;
  sustainabilityScore: number;
  innovationScore: number;
  agentType: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemDescription } = await req.json();
    console.log('Processing problem:', problemDescription);

    if (!problemDescription) {
      throw new Error('Problem description is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `You are an expert innovation consultant tasked with generating creative, practical solutions to complex problems. 

Problem: ${problemDescription}

Generate exactly 3 innovative solutions. For each solution, provide:
1. A clear, compelling title (max 50 characters)
2. A detailed description (2-3 sentences explaining the approach and implementation)
3. A feasibility score (1-100, considering current technology and resources)
4. A cost estimate (realistic budget needed, e.g., "$2.5M initial investment")
5. A sustainability score (1-100, environmental and long-term viability)
6. An innovation score (1-100, how novel and creative the approach is)
7. An agent type (choose from: "technology", "biotechnology", "social_innovation", "policy", "business_model")

Focus on solutions that are:
- Innovative yet practical
- Scalable and impactful
- Based on current or emerging technologies
- Addressing root causes, not just symptoms

Return your response as a valid JSON array with 3 solution objects.`;

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are an expert innovation consultant. Always respond with valid JSON containing exactly 3 solution objects with the specified structure.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    let solutions: Solution[];
    try {
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      // Handle if the response is wrapped in an object with a "solutions" key
      solutions = Array.isArray(parsed) ? parsed : (parsed.solutions || []);
      
      if (!Array.isArray(solutions) || solutions.length === 0) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      console.log(`Generated ${solutions.length} solutions`);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response');
    }

    return new Response(JSON.stringify({ solutions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-solutions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate solutions. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});