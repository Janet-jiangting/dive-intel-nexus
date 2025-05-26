
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Waves } from 'lucide-react';

const SUPABASE_PROJECT_ID = 'ioyfxcceheflwshhaqhk';
const SUPABASE_BUCKET_NAME = 'divesiteimages'; // Corrected bucket name

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

// The first declaration of featuredSites was here and has been removed.
// The comments explaining the image URL construction were also part of that removed block.

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
