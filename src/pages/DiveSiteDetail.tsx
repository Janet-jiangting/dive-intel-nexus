import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Star,
  Waves,
  Thermometer,
  Mountain,
  Eye,
  Ruler,
  Clock,
  Fish,
  CalendarDays,
  ThumbsUp,
  User,
  ArrowLeft,
  Share2,
  Bookmark
} from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import ReviewsList from '@/components/ReviewsList';

const SUPABASE_PROJECT_ID = 'ioyfxcceheflwshhaqhk';
const SUPABASE_BUCKET_NAME = 'divesiteimages'; // Corrected bucket name
const SUPABASE_STORAGE_PUBLIC_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/`;

// Helper function to generate slug
const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// This would typically come from an API call using the ID parameter
const getDiveSiteDetails = (id: string) => {
  // For now, we only update the Great Blue Hole image as it's hardcoded.
  // A more robust solution would fetch this data or have a mapping.
  // Or better, fetch from the diveSites array in DiveSites.tsx if id matches
  const siteName = 'Great Blue Hole'; 
  const siteImage = `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(siteName)}.jpg`;

  return {
    id: parseInt(id ?? '1'),
    name: siteName,
    location: 'Lighthouse Reef, Belize',
    coordinates: { lat: 17.3157, lng: -87.5343 },
    imageUrl: siteImage,
    gallery: [ 
      `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(siteName + '-gallery1')}.jpg`, 
      `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(siteName + '-gallery2')}.jpg`, 
      `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(siteName + '-gallery3')}.jpg`, 
      `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(siteName + '-gallery4')}.jpg`
    ], 
    type: 'Cave',
    rating: 4.8,
    difficulty: 'Advanced',
    depth: 124,
    maxDepth: 124,
    minDepth: 15,
    visibility: 30,
    visibilityLow: 15,
    visibilityHigh: 40,
    temperature: 26,
    temperatureLow: 24,
    temperatureHigh: 28,
    diveDuration: 45,
    seasonFrom: 'April',
    seasonTo: 'November',
    description: 'The Great Blue Hole is a giant marine sinkhole off the coast of Belize. It lies near the center of Lighthouse Reef, a small atoll 70 km from the mainland and Belize City. The hole is circular in shape, over 300 meters across and 124 meters deep.',
    longDescription: `
      The Great Blue Hole is a world-class destination for recreational scuba divers attracted by the opportunity to dive in crystal-clear waters and see several species of fish, including midnight parrotfish, Caribbean reef shark, and other juvenile fish species.

      The dive site was made famous by Jacques Cousteau, who declared it one of the top 10 diving sites in the world. In 1971, he brought his ship, the Calypso, to the hole to chart its depths.

      Stalactites and stalagmites were retrieved from submerged caves, confirming their previous formation above sea level thousands of years ago during glacial periods when sea levels were much lower.
    `,
    features: [
      'Crystal clear blue waters',
      'Underwater stalactites and stalagmites',
      'Variety of marine life',
      'Caribbean reef sharks',
      'Cave formations'
    ],
    marineLife: [
      'Caribbean Reef Shark',
      'Midnight Parrotfish',
      'Angelfish',
      'Butterflyfish',
      'Groupers'
    ],
    reviews: 382,
    averageRating: 4.8,
    ratings: {
      5: 280,
      4: 70,
      3: 22,
      2: 7,
      1: 3
    }
  };
};

const DiveSiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  // For now, we'll use the hardcoded getDiveSiteDetails. 
  // Ideally, this would fetch dynamic data based on 'id'
  // For the sake of image URL correction, we assume `id` might map to a name used in image construction.
  // However, getDiveSiteDetails always returns "Great Blue Hole" details.
  const site = getDiveSiteDetails(id ?? '1');

  return (
    <div className="bg-ocean-900 min-h-screen pb-12">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img 
          src={site.imageUrl} 
          alt={site.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 to-transparent" />
        <div className="absolute bottom-0 left-0 container p-6">
          <Link 
            to="/dive-sites" 
            className="inline-flex items-center text-white mb-4 hover:text-ocean-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Dive Sites</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{site.name}</h1>
          <div className="flex items-center text-white mb-1">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{site.location}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-white">{site.rating}</span>
              <span className="text-ocean-300 ml-1">({site.reviews} reviews)</span>
            </div>
            <Badge className="bg-ocean-700">{site.type}</Badge>
            <Badge variant="outline" className="border-ocean-500 text-ocean-300">{site.difficulty}</Badge>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="ghost" size="icon" className="bg-ocean-900/50 text-white hover:bg-ocean-800">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-ocean-900/50 text-white hover:bg-ocean-800">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="bg-ocean-800 border-b border-ocean-700 rounded-none w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">About {site.name}</h2>
                  </CardHeader>
                  <CardContent className="text-ocean-100">
                    <p className="mb-6">
                      {site.longDescription}
                    </p>
                    
                    <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                    <ul className="list-disc pl-5 mb-6 text-ocean-200">
                      {site.features.map((feature, index) => (
                        <li key={index} className="mb-2">{feature}</li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-white mb-4">Marine Life</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {site.marineLife.map((species, index) => (
                        <Badge key={index} variant="secondary" className="bg-ocean-700">
                          <Fish className="h-3 w-3 mr-1" />
                          {species}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="bg-ocean-700/50 rounded-lg p-4 border border-ocean-600">
                      <h3 className="text-lg font-semibold text-white mb-3">Best Time to Dive</h3>
                      <div className="flex items-center text-ocean-200 mb-2">
                        <CalendarDays className="h-4 w-4 mr-2 text-ocean-300" />
                        <span>Dive season: {site.seasonFrom} to {site.seasonTo}</span>
                      </div>
                      <p className="text-ocean-200 text-sm">
                        The best time to dive at {site.name} is during the dry season when visibility is highest and water conditions are optimal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="photos">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
                  </CardHeader>
                  <CardContent>
                    <PhotoGallery images={site.gallery} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Diver Reviews</h2>
                  </CardHeader>
                  <CardContent>
                    <ReviewsList />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="map">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Location</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] bg-ocean-700 flex items-center justify-center rounded-md">
                      <MapPin className="h-12 w-12 text-ocean-300 mb-4" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-white mb-2">Interactive Map</p>
                        <p className="text-ocean-200">
                          This would display an interactive map of the dive site location.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-white">Dive Conditions</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-ocean-700/50 p-3 rounded-md">
                    <div className="flex items-center text-ocean-300 mb-1">
                      <Mountain className="h-4 w-4 mr-2" />
                      <span className="text-sm">Depth</span>
                    </div>
                    <p className="text-white text-lg font-medium">{site.minDepth}m - {site.maxDepth}m</p>
                  </div>
                  
                  <div className="bg-ocean-700/50 p-3 rounded-md">
                    <div className="flex items-center text-ocean-300 mb-1">
                      <Thermometer className="h-4 w-4 mr-2" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <p className="text-white text-lg font-medium">{site.temperatureLow}°C - {site.temperatureHigh}°C</p>
                  </div>
                  
                  <div className="bg-ocean-700/50 p-3 rounded-md">
                    <div className="flex items-center text-ocean-300 mb-1">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="text-sm">Visibility</span>
                    </div>
                    <p className="text-white text-lg font-medium">{site.visibilityLow}m - {site.visibilityHigh}m</p>
                  </div>
                  
                  <div className="bg-ocean-700/50 p-3 rounded-md">
                    <div className="flex items-center text-ocean-300 mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Average Dive Time</span>
                    </div>
                    <p className="text-white text-lg font-medium">{site.diveDuration} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-white">Rating Overview</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="text-3xl font-bold text-white mr-3">{site.averageRating}</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(site.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-ocean-300 mt-1">Based on {site.reviews} reviews</p>
                  </div>
                </div>
                
                {Object.entries(site.ratings).reverse().map(([rating, count]) => (
                  <div key={rating} className="flex items-center mb-2">
                    <div className="w-8 text-right mr-2 text-ocean-200">{rating}</div>
                    <div className="w-full bg-ocean-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-ocean-400 h-full" 
                        style={{ width: `${(count / site.reviews) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right ml-2 text-ocean-200">{count}</div>
                  </div>
                ))}
                
                <Button className="w-full mt-4 bg-seagreen-600 hover:bg-seagreen-700">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-white">Nearby Dive Shops</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 hover:bg-ocean-700/50 rounded-md transition-colors">
                    <div className="w-10 h-10 bg-ocean-700 rounded-md flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-ocean-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Belize Diving Adventures</p>
                      <p className="text-xs text-ocean-300">2.3 miles away</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-2 hover:bg-ocean-700/50 rounded-md transition-colors">
                    <div className="w-10 h-10 bg-ocean-700 rounded-md flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-ocean-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Blue Hole Dive Center</p>
                      <p className="text-xs text-ocean-300">3.5 miles away</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-2 hover:bg-ocean-700/50 rounded-md transition-colors">
                    <div className="w-10 h-10 bg-ocean-700 rounded-md flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-ocean-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Lighthouse Reef Divers</p>
                      <p className="text-xs text-ocean-300">4.1 miles away</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 border-ocean-600 text-ocean-300 hover:bg-ocean-700">
                  View All Nearby Shops
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiveSiteDetail;
