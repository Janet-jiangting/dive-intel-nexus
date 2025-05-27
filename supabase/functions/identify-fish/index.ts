import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'; // Use a specific version
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for OpenAI library

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Use service role key for db access in edge function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IdentifiedFish {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  conservationStatus: string;
  description: string;
  confidence: number;
  imageUrl: string;
  regions: string[];
  depth: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      throw new Error("Missing imageBase64 in request body");
    }

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables: OPENAI_API_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY");
      throw new Error("Server configuration error.");
    }
    
    console.log("Received image for analysis.");

    // 1. Call OpenAI to identify fish
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using vision capable model
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: "Identify the fish in this image. Provide its common name. If multiple fish are present, identify the most prominent one. If it's not a fish, say 'Not a fish'. Only provide the common name." },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openAIResult = await openAIResponse.json();
    const fishNameFromAI = openAIResult.choices[0]?.message?.content?.trim();

    console.log("Raw fish name from AI:", fishNameFromAI);

    if (!fishNameFromAI || fishNameFromAI.toLowerCase() === 'not a fish' || fishNameFromAI.toLowerCase().includes("i cannot identify")) {
      return new Response(JSON.stringify({ error: "Could not identify a fish in the image or it's not a fish." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Escape single quotes for SQL compatibility in similarity() function
    const escapedFishNameFromAI = fishNameFromAI.replace(/'/g, "''");
    console.log("Escaped fish name for similarity:", escapedFishNameFromAI);

    // 2. Query Supabase database using pg_trgm for the best match
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Construct the .or() filter string
    // The pattern for ilike uses '%' to join words if fishNameFromAI has multiple words.
    const ilikePattern = fishNameFromAI.split(" ").join("%");
    const orFilter = `species_name.ilike.%${ilikePattern}%,scientific_name.ilike.%${ilikePattern}%`;
    console.log("Using OR filter for Supabase query:", orFilter);

    // Use `similarity` function from pg_trgm. Ensure it's enabled in your DB.
    // We search by species_name and scientific_name
    const { data: matchedFishData, error: dbError } = await supabase
      .from('Marine Life')
      .select(`
        id, 
        species_name, 
        scientific_name, 
        family, 
        "Conservation Status", 
        description,
        distribution,
        depth_range,
        similarity(species_name, '${escapedFishNameFromAI}') AS s_name_similarity,
        similarity(scientific_name, '${escapedFishNameFromAI}') AS sc_name_similarity
      `)
      .or(orFilter) // Use lowercase 'ilike' and corrected orFilter string
      .order('s_name_similarity', { ascending: false, nullsFirst: false }) // Order by similarity
      .limit(5); // Get top 5 matches to evaluate

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!matchedFishData || matchedFishData.length === 0) {
      console.log("No matching fish found in the database for:", fishNameFromAI);
      return new Response(JSON.stringify({ error: `No match found in our database for '${fishNameFromAI}'.` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Determine best match from the results based on similarity scores
    // We consider both name and scientific name similarity, prioritizing species_name
    let bestMatch = matchedFishData[0];
    let highestSimilarity = Math.max(bestMatch.s_name_similarity || 0, bestMatch.sc_name_similarity || 0);

    for (let i = 1; i < matchedFishData.length; i++) {
        const currentSimilarity = Math.max(matchedFishData[i].s_name_similarity || 0, matchedFishData[i].sc_name_similarity || 0);
        if (currentSimilarity > highestSimilarity) {
            bestMatch = matchedFishData[i];
            highestSimilarity = currentSimilarity;
        }
    }
    
    // If similarity is too low, consider it not a confident match.
    // pg_trgm similarity is between 0 and 1. Threshold can be adjusted.
    const SIMILARITY_THRESHOLD = 0.2; 
    if (highestSimilarity < SIMILARITY_THRESHOLD) {
       console.log(`Best match similarity (${highestSimilarity}) for '${fishNameFromAI}' is below threshold.`);
       return new Response(JSON.stringify({ error: `Identified as '${fishNameFromAI}', but no confident match found in our database.` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct image URL (consistent with MarineLifeDataContext)
    const SUPABASE_PROJECT_REF = supabaseUrl.split('.')[0].split('//')[1];
    const IMAGE_BUCKET_NAME = "fishimages"; // As defined in MarineLifeDataContext
    const imageNameForUrl = `${bestMatch.id}.png`;
    const imageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${imageNameForUrl}`;

    let regionsArray: string[] = [];
    if (typeof bestMatch.distribution === 'string') {
        regionsArray = bestMatch.distribution.split(',').map(r => r.trim()).filter(r => r);
    } else if (Array.isArray(bestMatch.distribution)) {
        regionsArray = bestMatch.distribution;
    }


    const result: IdentifiedFish = {
      id: bestMatch.id,
      name: bestMatch.species_name,
      scientificName: bestMatch.scientific_name,
      category: bestMatch.family,
      conservationStatus: bestMatch['Conservation Status'],
      description: bestMatch.description,
      confidence: Math.round(highestSimilarity * 100), // Convert similarity to percentage
      imageUrl: imageUrl,
      regions: regionsArray,
      depth: bestMatch.depth_range,
    };
    
    console.log("Match found:", result.name, "with confidence:", result.confidence);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in identify-fish function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
