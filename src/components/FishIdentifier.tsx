import React, { useState } from 'react';
import { Camera, Upload, Loader2, Fish, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast'; // Updated import path
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

interface IdentifiedFish {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  habitat?: string; // Habitat might not come from DB, make it optional
  conservationStatus: string;
  description: string;
  confidence: number;
  imageUrl: string;
  regions?: string[]; // Added from edge function
  depth?: string; // Added from edge function
}

const FishIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedFish, setIdentifiedFish] = useState<IdentifiedFish | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (e.g., JPEG, PNG)",
        variant: "destructive"
      });
      return;
    }
    
    // Limit file size (e.g., 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Please select an image smaller than ${MAX_FILE_SIZE / (1024*1024)}MB.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    setAnalysisError(null); // Clear previous errors
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setIdentifiedFish(null);
    setShowResult(false);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        console.log("Invoking identify-fish function...");
        const { data, error } = await supabase.functions.invoke('identify-fish', {
          body: { imageBase64: base64Image },
        });

        setIsAnalyzing(false);

        if (error) {
          console.error('Edge function invocation error:', error);
          const errorMessage = error.message.includes("Function not found") 
            ? "The fish identification service is currently unavailable. Please try again later."
            : (error.message || "An unknown error occurred during analysis.");
          setAnalysisError(errorMessage);
          toast({
            title: "Analysis Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        
        // The edge function now returns the error in data.error if it's a handled error
        if (data && data.error) {
          console.error('Analysis error from function:', data.error);
          setAnalysisError(data.error);
           toast({
            title: "Identification Issue",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log("Fish identified data:", data);
          // Ensure the data matches IdentifiedFish interface
          const fishData = data as IdentifiedFish; 
          // The habitat field might not be present, which is fine as it's optional.
          setIdentifiedFish(fishData);
          setShowResult(true);
          toast({
            title: "Fish identified!",
            description: `${fishData.name} found with ${fishData.confidence}% confidence.`,
          });
        } else {
            // This case should ideally be handled by data.error from the function
            setAnalysisError("No data returned from analysis.");
            toast({
                title: "Analysis Incomplete",
                description: "The analysis did not return any data.",
                variant: "destructive",
            });
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setIsAnalyzing(false);
        setAnalysisError("Could not read the image file.");
        toast({
          title: "Image Read Error",
          description: "There was an issue processing your image.",
          variant: "destructive"
        });
      };
    } catch (err: any) {
      console.error('Error in analyzeImage:', err);
      setIsAnalyzing(false);
      setAnalysisError(err.message || "An unexpected error occurred.");
      toast({
        title: "Analysis Error",
        description: err.message || "An unexpected error occurred during image analysis.",
        variant: "destructive"
      });
    }
  };

  const resetIdentifier = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setIdentifiedFish(null);
    setShowResult(false);
    setAnalysisError(null);
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
        return 'bg-yellow-500 text-ocean-900'; // Corrected color based on previous UI, if any
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
                className="bg-ocean-700 border-ocean-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-seagreen-600 file:text-white hover:file:bg-seagreen-700"
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
                  className="absolute top-2 right-2 bg-ocean-800/80 border-ocean-600 hover:bg-ocean-700 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {!isAnalyzing && !showResult && !analysisError && (
                <Button
                  onClick={analyzeImage}
                  className="w-full bg-seagreen-600 hover:bg-seagreen-700 text-white"
                  disabled={isAnalyzing}
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
              {analysisError && !isAnalyzing && (
                 <div className="text-center py-4">
                    <p className="text-red-400">{analysisError}</p>
                    <Button
                      onClick={resetIdentifier}
                      variant="outline"
                      className="mt-4 border-ocean-600 text-white hover:bg-ocean-700"
                    >
                      Try Another Image
                    </Button>
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
              <span>{identifiedFish.name}</span>
              <Badge className="bg-seagreen-600 text-white">
                {identifiedFish.confidence}% Match
              </Badge>
            </CardTitle>
            <p className="text-ocean-300 italic">{identifiedFish.scientificName}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={identifiedFish.imageUrl || '/placeholder.svg'}
                  alt={identifiedFish.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-ocean-700"
                  onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Fallback for broken image links
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-ocean-700 text-ocean-100">{identifiedFish.category}</Badge>
                  <Badge className={getStatusColor(identifiedFish.conservationStatus)}>
                    {identifiedFish.conservationStatus}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {identifiedFish.depth && (
                    <p className="text-sm text-ocean-200">
                      <span className="font-medium text-ocean-100">Typical Depth:</span> {identifiedFish.depth}
                    </p>
                  )}
                  {identifiedFish.regions && identifiedFish.regions.length > 0 && (
                     <p className="text-sm text-ocean-200">
                      <span className="font-medium text-ocean-100">Regions:</span> {identifiedFish.regions.join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-ocean-100 leading-relaxed">{identifiedFish.description}</p>
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
