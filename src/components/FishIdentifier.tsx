
import React, { useState } from 'react';
import { Camera, Upload, Loader2, Fish, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface IdentifiedFish {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  conservationStatus: string;
  description: string;
  confidence: number;
  imageUrl: string;
}

const FishIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedFish, setIdentifiedFish] = useState<IdentifiedFish | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI identification result
    const mockResult: IdentifiedFish = {
      id: 1,
      name: 'Clownfish',
      scientificName: 'Amphiprioninae',
      category: 'Fish',
      habitat: 'Coral Reefs',
      conservationStatus: 'Least Concern',
      description: 'Clownfish are known for their bright orange coloration with white stripes and black borders. They live in anemones and are popular in marine aquariums.',
      confidence: 87,
      imageUrl: '/placeholder.svg'
    };

    setIdentifiedFish(mockResult);
    setIsAnalyzing(false);
    setShowResult(true);

    toast({
      title: "Fish identified!",
      description: `Found a match with ${mockResult.confidence}% confidence`,
    });
  };

  const resetIdentifier = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setIdentifiedFish(null);
    setShowResult(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered':
        return 'bg-red-600 text-white';
      case 'Endangered':
        return 'bg-amber-500 text-white';
      case 'Vulnerable':
        return 'bg-yellow-500 text-ocean-900';
      case 'Near Threatened':
        return 'bg-yellow-300 text-ocean-900';
      case 'Least Concern':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-ocean-800 border-ocean-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Fish className="h-5 w-5" />
            See Which Fish You Got Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-ocean-600 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-ocean-400 mx-auto mb-4" />
              <p className="text-ocean-200 mb-4">Upload a photo of your fish sighting</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-ocean-700 border-ocean-600 text-white"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Selected fish"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={resetIdentifier}
                  size="icon"
                  variant="outline"
                  className="absolute top-2 right-2 bg-ocean-800/80 border-ocean-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {!isAnalyzing && !showResult && (
                <Button
                  onClick={analyzeImage}
                  className="w-full bg-seagreen-600 hover:bg-seagreen-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Identify This Fish
                </Button>
              )}

              {isAnalyzing && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-seagreen-500 mr-3" />
                  <span className="text-ocean-200">Analyzing your fish photo...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && identifiedFish && (
        <Card className="bg-ocean-800 border-ocean-700 animate-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Fish Identified!</span>
              <Badge className="bg-seagreen-600 text-white">
                {identifiedFish.confidence}% Match
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={identifiedFish.imageUrl}
                  alt={identifiedFish.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{identifiedFish.name}</h3>
                  <p className="text-ocean-300 italic">{identifiedFish.scientificName}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="secondary">{identifiedFish.category}</Badge>
                  <Badge className={getStatusColor(identifiedFish.conservationStatus)}>
                    {identifiedFish.conservationStatus}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-ocean-200">
                    <span className="font-medium">Habitat:</span> {identifiedFish.habitat}
                  </p>
                  <p className="text-sm text-ocean-100">{identifiedFish.description}</p>
                </div>
                
                <Button
                  onClick={resetIdentifier}
                  variant="outline"
                  className="w-full border-ocean-600 text-white hover:bg-ocean-700"
                >
                  Identify Another Fish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FishIdentifier;
