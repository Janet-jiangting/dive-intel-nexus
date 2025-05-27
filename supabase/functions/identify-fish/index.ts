import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// createClient and xhr are not needed for this simplified version
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
// import "https://deno.land/x/xhr@0.1.0/mod.ts"; 

// API keys and Supabase URL/Key are not strictly needed for this hardcoded version's core logic
// const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
// const supabaseUrl = Deno.env.get('SUPABASE_URL');
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

const sampleFish: IdentifiedFish = {
  id: 101,
  name: "Clownfish (Prototype)",
  scientificName: "Amphiprioninae prototypus",
  category: "Damselfish",
  conservationStatus: "Least Concern",
  description: "It's bright orange with white stripes, often found living in symbiosis with sea anemones.", // Updated description
  confidence: 95,
  imageUrl: "https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/fishimages/7.png", 
  regions: ["Indo-Pacific", "Red Sea", "Great Barrier Reef"],
  depth: "1-15 meters",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // We are not processing the image in this simplified version
    // const { imageBase64 } = await req.json();
    // if (!imageBase64) {
    //   throw new Error("Missing imageBase64 in request body");
    // }
    
    console.log("Request received. Returning hardcoded sample fish data for prototype.");

    // Directly return the sample fish data
    return new Response(JSON.stringify(sampleFish), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in simplified identify-fish function:', error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
