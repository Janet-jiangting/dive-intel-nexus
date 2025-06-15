import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Fish, Wand2 } from 'lucide-react';
import FeaturedSites from '@/components/FeaturedSites';
import MarineLifeGallery from '@/components/MarineLifeGallery';
import DiveConditionsCard from '@/components/DiveConditionsCard';
// import { Card, CardContent } from '@/components/ui/card'; // Not used directly

const Index = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-auto min-h-[580px] bg-ocean-900 overflow-hidden py-10 md:py-0 flex items-center">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/90 to-ocean-900/50 pointer-events-none" />

        <div className="relative container mx-auto flex flex-col md:flex-row justify-between items-center h-full px-4 z-10 gap-12 md:gap-8">
          {/* Left: Title, Subtitle, CTA */}
          <div className="flex-1 max-w-3xl md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in leading-tight">
              Explore the Depths of Our{" "}
              <span className="text-ocean-300">Underwater World</span>
            </h1>
            <p className="text-xl text-ocean-100 mb-8 max-w-2xl">
              Discover incredible dive sites, learn about marine species, and connect with the global diving community through our comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 relative z-20">
              <Button 
                asChild 
                size="lg" 
                className="bg-seagreen-600 hover:bg-seagreen-700 text-white relative z-30 cursor-pointer"
                onClick={() => handleButtonClick('Find Dive Sites')}
              >
                <Link to="/dive-sites" className="flex items-center justify-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Dive Sites
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="bg-ocean-800/60 text-white border-ocean-600 hover:bg-ocean-700 relative z-30 cursor-pointer"
                onClick={() => handleButtonClick('Explore Marine Life')}
              >
                <Link to="/marine-life" className="flex items-center justify-center">
                  <Fish className="mr-2 h-5 w-5" />
                  Explore Marine Life
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Suggestion Box */}
          <div className="w-full md:w-[390px] flex-shrink-0">
            <div className="bg-blue-800 bg-opacity-90 rounded-xl shadow-lg p-8 border border-cyan-600 ring-1 ring-cyan-600/25 relative"
                 style={{ boxShadow: '0px 0px 25px 0px #22d3ee33' }}>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">
                Let AI help you create a perfect dive trip!
              </h2>
              <p className="text-base text-blue-100 mb-6 text-center">
                Use our AI-powered trip planner to customize your next underwater adventure. Tell us your preferences, and we'll craft the perfect itinerary for you.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold shadow-md"
              >
                <Link to="/customize-trip" className="flex items-center justify-center">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Customize Your Dive Trip
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#0c4a6e" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,229.3C384,235,480,277,576,277.3C672,277,768,235,864,224C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Dive Sites Section */}
      <section className="py-16 bg-ocean-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Featured Dive Sites</h2>
              <p className="text-ocean-200 mt-2">Discover top diving destinations around the world</p>
            </div>
            <Button asChild variant="link" className="text-ocean-300 hover:text-white">
              <Link to="/dive-sites">View All Sites</Link>
            </Button>
          </div>
          
          <FeaturedSites />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-ocean-800 to-ocean-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Explore Marine Life</h2>
              <p className="text-ocean-200 mt-2">Discover the fascinating creatures beneath the waves</p>
            </div>
            <Button asChild variant="link" className="text-ocean-300 hover:text-white">
              <Link to="/marine-life">View Full Gallery</Link>
            </Button>
          </div>
          
          <MarineLifeGallery />
        </div>
      </section>

      <section className="py-16 bg-ocean-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-2">Current Dive Conditions</h2>
          <p className="text-ocean-200 mb-8">Real-time updates from popular dive locations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DiveConditionsCard 
              location="Great Barrier Reef, Australia"
              temperature={27}
              visibility={20}
              currentStrength="Mild"
              waveHeight={0.5}
              lastUpdated="1 hour ago"
              status="excellent"
            />
            
            <DiveConditionsCard 
              location="Blue Hole, Belize"
              temperature={25}
              visibility={30}
              currentStrength="Moderate"
              waveHeight={1.0}
              lastUpdated="3 hours ago"
              status="good"
            />
            
            <DiveConditionsCard 
              location="Raja Ampat, Indonesia"
              temperature={29}
              visibility={15}
              currentStrength="Strong"
              waveHeight={1.5}
              lastUpdated="2 hours ago"
              status="caution"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-seagreen-900 to-ocean-900">
        <div className="container mx-auto px-4">
          <div className="bg-ocean-800/50 border border-ocean-700 rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold text-white mb-4">Join Our Diving Community</h2>
                <p className="text-ocean-100 max-w-lg">
                  Connect with fellow divers, share your experiences, and contribute to our growing database of dive sites and marine life observations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-seagreen-600 hover:bg-seagreen-700 text-white">
                  Sign Up Now
                </Button>
                <Button size="lg" variant="outline" className="border-ocean-300 text-ocean-300 hover:bg-ocean-700">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ocean-900">
        <div className="container mx-auto px-4 text-center">
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-emerald-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-ocean-800 border border-ocean-700 rounded-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Let AI help you create a perfect dive trip!
              </h2>
              <p className="text-ocean-100 max-w-2xl mx-auto mb-8">
                Use our AI-powered trip planner to customize your next underwater adventure. Tell us your preferences, and we'll craft the perfect itinerary for you.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-105 transition-transform">
                <Link to="/customize-trip">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Customize Your Dive Trip
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
