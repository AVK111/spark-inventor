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
      console.log('No OpenAI API key found, using fallback solutions');
      return generateFallbackSolutions(problemDescription);
    }

    const prompt = `You are an expert innovation consultant with access to extensive research databases, academic literature, and industry reports. 

Problem: ${problemDescription}

Based on your analysis of relevant research literature, academic papers, industry reports, and emerging technology trends, generate exactly 3 innovative solutions.

For each solution, provide:
1. A clear, compelling title (max 50 characters)
2. A detailed description (2-3 sentences explaining the approach and implementation)
3. A feasibility score (1-100, considering current technology and resources)
4. A cost estimate (realistic budget needed, e.g., "2.5M initial investment")
5. A sustainability score (1-100, environmental and long-term viability)
6. An innovation score (1-100, how novel and creative the approach is)
7. An agent type (choose from: "technology", "biotechnology", "social_innovation", "policy", "business_model")
8. Key research sources (3-5 relevant academic papers, reports, or studies that informed this solution)

Focus on solutions that are:
- Innovative yet practical
- Scalable and impactful
- Based on current or emerging technologies
- Addressing root causes, not just symptoms
- Grounded in recent research and evidence

Return your response as a valid JSON object with this structure:
{
  "solutions": [array of 3 solution objects],
  "literatureReview": {
    "searchTerms": [relevant search terms used],
    "keyFindings": "summary of key research insights",
    "researchSources": [list of 8-12 relevant academic/industry sources]
  }
}`;

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
        max_tokens: 2000,
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // If quota exceeded or rate limited, use fallback
      if (response.status === 429) {
        console.log('OpenAI quota exceeded, using fallback solutions');
        return generateFallbackSolutions(problemDescription);
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    let solutions: Solution[];
    let literatureReview: any;
    
    try {
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      // Handle if the response is wrapped in an object with a "solutions" key
      solutions = Array.isArray(parsed) ? parsed : (parsed.solutions || []);
      literatureReview = parsed.literatureReview || null;
      
      if (!Array.isArray(solutions) || solutions.length === 0) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      console.log(`Generated ${solutions.length} solutions`);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response');
    }

    return new Response(JSON.stringify({ solutions, literatureReview }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-solutions function:', error);
    
    // If OpenAI fails for any reason, try fallback
    if (error.message.includes('OpenAI') || error.message.includes('API')) {
      try {
        const { problemDescription } = await req.json();
        return generateFallbackSolutions(problemDescription);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate solutions. Please check your OpenAI API credits or try again later.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Fallback function to generate mock solutions when OpenAI is unavailable
function generateFallbackSolutions(problemDescription: string) {
  console.log('Generating fallback solutions for:', problemDescription);
  
  const fallbackSolutions = [
    {
      title: "AI-Powered Analysis Solution",
      description: "Leverage artificial intelligence and machine learning algorithms to analyze the problem systematically. This approach uses data-driven insights to identify patterns and propose evidence-based solutions.",
      feasibilityScore: 85,
      costEstimate: "$500K - $1M initial investment",
      sustainabilityScore: 90,
      innovationScore: 88,
      agentType: "technology",
      researchSources: ["IEEE AI Research Papers", "MIT Technology Review", "Nature Machine Intelligence"]
    },
    {
      title: "Collaborative Platform Approach",
      description: "Create a multi-stakeholder platform that brings together experts, communities, and resources. This solution focuses on building sustainable partnerships and knowledge sharing networks.",
      feasibilityScore: 78,
      costEstimate: "$200K - $500K initial investment",
      sustainabilityScore: 95,
      innovationScore: 75,
      agentType: "social_innovation",
      researchSources: ["Harvard Business Review", "Stanford Social Innovation Review", "McKinsey Quarterly"]
    },
    {
      title: "Biotechnology Integration Solution",
      description: "Apply cutting-edge biotechnology and bioengineering principles to address the core challenges. This solution combines biological systems with technological innovation for sustainable outcomes.",
      feasibilityScore: 72,
      costEstimate: "$1M - $3M initial investment",
      sustainabilityScore: 92,
      innovationScore: 94,
      agentType: "biotechnology",
      researchSources: ["Nature Biotechnology", "Cell", "Science Translational Medicine"]
    }
  ];

  const literatureReview = {
    searchTerms: ["innovation", "technology solutions", "sustainable development", "AI applications", problemDescription.split(' ').slice(0, 3).join(' ')],
    keyFindings: "Research indicates that multi-modal approaches combining technology, social innovation, and biological systems yield the highest success rates for complex problem solving. Current trends show increasing emphasis on sustainability and stakeholder collaboration.",
    researchSources: [
      "MIT Technology Review - Innovation Trends 2024",
      "Nature - Sustainable Technology Solutions",
      "Harvard Business Review - Collaborative Innovation",
      "IEEE Spectrum - AI Applications",
      "Science - Biotechnology Advances",
      "McKinsey Global Institute - Technology Impact",
      "Stanford Research - Social Innovation",
      "Cell Press - Bioengineering Solutions"
    ]
  };

  return new Response(JSON.stringify({ 
    solutions: fallbackSolutions, 
    literatureReview,
    note: "Demo solutions generated - OpenAI API unavailable. Please add credits to your OpenAI account for AI-powered solutions."
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
});