
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Waves } from 'lucide-react';

const SUPABASE_PROJECT_ID = 'ioyfxcceheflwshhaqhk';
const SUPABASE_BUCKET_NAME = 'divesiteimages'; // Corrected bucket name
const SUPABASE_STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;

// Mock data for featured dive sites
const featuredSitesData = [
  {
    id: 1,
    name: 'Great Blue Hole',
    location: 'Belize',
    type: 'Cave',
    rating: 4.8,
    difficulty: 'Advanced',
  },
  {
    id: 2,
    name: 'SS Thistlegorm',
    location: 'Red Sea, Egypt',
    type: 'Wreck',
    rating: 4.9,
    difficulty: 'Intermediate',
  },
  {
    id: 3,
    name: 'Barracuda Point',
    location: 'Sipadan, Malaysia',
    type: 'Wall',
    rating: 4.7,
    difficulty: 'Intermediate',
  },
  {
    id: 4,
    name: 'Molokini Crater',
    location: 'Maui, Hawaii',
    type: 'Reef',
    rating: 4.5,
    difficulty: 'Beginner',
  }
];

const featuredSites = featuredSitesData.map(site => ({
  ...site,
  // Construct imageUrl according to the specified format
  imageUrl: `${SUPABASE_STORAGE_BASE_URL}/${encodeURIComponent(site.name)}.jpg`, 
  // The user's example has // after the bucket name.
  // My previous interpretation was BASE_URL already includes the bucket name.
  // Let's adjust based on the example: SUPABASE_STORAGE_BASE_URL (ending in /public/) + BUCKET_NAME + // + FILENAME
  // No, the user's example `https://.../public/divesiteimages//Great%20Blue%20Hole.jpg` implies
  // SUPABASE_STORAGE_BASE_URL should be `https://.../public/`
  // then add `divesiteimages` (bucket) then `//` then encoded name.
  // The constant `SUPABASE_STORAGE_BASE_URL` in the original code ALREADY INCLUDED the bucket name.
  // Let's redefine it for clarity or adjust the construction.
  // Given the current definition of SUPABASE_STORAGE_BASE_URL includes the bucket name, it should be:
  // `${SUPABASE_STORAGE_BASE_URL}/${encodeURIComponent(site.name)}.jpg` if SUPABASE_STORAGE_BASE_URL = `.../public/divesiteimages/`
  // If the user example means `.../public/divesiteimages//Filename.jpg`, then the current SUPABASE_STORAGE_BASE_URL is fine
  // and we just need to add `/` (one slash) before the encoded name, because SUPABASE_STORAGE_BASE_URL already ends with a slash.
  // The example URL is: `https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/divesiteimages//Great%20Blue%20Hole.jpg`
  // `SUPABASE_STORAGE_BASE_URL` is `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`
  // So it becomes `SUPABASE_STORAGE_BASE_URL` + `/` + `encodeURIComponent(site.name)}.jpg`
  // This results in `.../divesiteimages//Great%20Blue%20Hole.jpg` if there are no trailing slashes issues.
  // Let's ensure SUPABASE_STORAGE_BASE_URL ends with a `/` which it does.
  // So, imageUrl: `${SUPABASE_STORAGE_BASE_URL}/${encodeURIComponent(site.name)}.jpg` will create one extra slash.
  // imageUrl: `${SUPABASE_STORAGE_BASE_URL}${encodeURIComponent(site.name)}.jpg` if SUPABASE_STORAGE_BASE_URL already ends with `/`.
  // Let's use the user's exact structure: base + bucket + // + filename.
  // So, SUPABASE_STORAGE_BASE_URL should be just up to /public/
  // And then manually construct the rest.
}));

// Re-evaluating the base URL constant to match the user's explicit structure
const CORRECT_SUPABASE_STORAGE_PUBLIC_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/`;

const featuredSites = featuredSitesData.map(site => ({
  ...site,
  imageUrl: `${CORRECT_SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(site.name)}.jpg`,
}));


const FeaturedSites = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredSites.map((site) => (
        <Link to={`/dive-sites/${site.id}`} key={site.id}>
          <Card className="overflow-hidden bg-ocean-700/50 border-ocean-600 hover:shadow-lg hover:shadow-ocean-500/20 transition-all hover:-translate-y-1">
            <div className="relative h-48">
              <img
                src={site.imageUrl}
                alt={site.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-ocean-900/80" variant="secondary">
                {site.type}
              </Badge>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ocean-900 to-transparent h-20" />
            </div>
            
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-white">{site.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                  <span className="text-white">{site.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-ocean-100 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{site.location}</span>
              </div>
              
              <div className="flex items-center mt-2">
                <Waves className="h-4 w-4 mr-1 text-ocean-300" />
                <span className="text-sm text-ocean-300">{site.difficulty}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedSites;
