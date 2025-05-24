
import React, { useState } from 'react';
import { Plus, Image, MapPin, Fish, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePost = ({ isOpen, onClose }: CreatePostProps) => {
  const [postContent, setPostContent] = useState('');
  const [contributeData, setContributeData] = useState(false);
  const [contributionType, setContributionType] = useState<'dive-site' | 'marine-life' | ''>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [locationData, setLocationData] = useState({
    name: '',
    location: '',
    coordinates: '',
    type: '',
    depth: '',
    description: ''
  });
  const [marineLifeData, setMarineLifeData] = useState({
    name: '',
    scientificName: '',
    category: '',
    habitat: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    // Here you would submit the post and contribution data
    toast({
      title: "Post created successfully",
      description: contributeData ? "Your data contribution has been submitted for review" : "Your post has been shared with the community",
    });

    // Reset form
    setPostContent('');
    setContributeData(false);
    setContributionType('');
    setImages(null);
    setLocationData({ name: '', location: '', coordinates: '', type: '', depth: '', description: '' });
    setMarineLifeData({ name: '', scientificName: '', category: '', habitat: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-ocean-800 border-ocean-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Create New Post</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 text-white" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-ocean-200 mb-2 block">
              Share your diving experience
            </label>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Tell the community about your dive, marine life sightings, or diving tips..."
              className="bg-ocean-700 border-ocean-600 text-white min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ocean-200 mb-2 block">
              Upload Images
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="bg-ocean-700 border-ocean-600 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contribute"
              checked={contributeData}
              onCheckedChange={(checked) => setContributeData(checked as boolean)}
            />
            <label htmlFor="contribute" className="text-sm text-ocean-200">
              I want to contribute data to the app's database
            </label>
          </div>

          {contributeData && (
            <div className="space-y-4 p-4 bg-ocean-900 rounded-lg border border-ocean-600">
              <div>
                <label className="text-sm font-medium text-ocean-200 mb-2 block">
                  Contribution Type
                </label>
                <Select onValueChange={(value) => setContributionType(value as 'dive-site' | 'marine-life')}>
                  <SelectTrigger className="bg-ocean-700 border-ocean-600 text-white">
                    <SelectValue placeholder="Select what you're contributing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dive-site">Dive Site Information</SelectItem>
                    <SelectItem value="marine-life">Marine Life Sighting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {contributionType === 'dive-site' && (
                <div className="space-y-3">
                  <Input
                    placeholder="Dive site name"
                    value={locationData.name}
                    onChange={(e) => setLocationData({...locationData, name: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Location (e.g., Maldives, Red Sea)"
                    value={locationData.location}
                    onChange={(e) => setLocationData({...locationData, location: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="GPS Coordinates (e.g., 4.1755, 73.5093)"
                    value={locationData.coordinates}
                    onChange={(e) => setLocationData({...locationData, coordinates: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Dive type (e.g., Reef, Wreck, Wall)"
                    value={locationData.type}
                    onChange={(e) => setLocationData({...locationData, type: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Maximum depth (meters)"
                    value={locationData.depth}
                    onChange={(e) => setLocationData({...locationData, depth: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Textarea
                    placeholder="Describe the dive site, conditions, marine life..."
                    value={locationData.description}
                    onChange={(e) => setLocationData({...locationData, description: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                </div>
              )}

              {contributionType === 'marine-life' && (
                <div className="space-y-3">
                  <Input
                    placeholder="Species name"
                    value={marineLifeData.name}
                    onChange={(e) => setMarineLifeData({...marineLifeData, name: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Scientific name (if known)"
                    value={marineLifeData.scientificName}
                    onChange={(e) => setMarineLifeData({...marineLifeData, scientificName: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Category (Fish, Coral, Reptile, etc.)"
                    value={marineLifeData.category}
                    onChange={(e) => setMarineLifeData({...marineLifeData, category: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Input
                    placeholder="Habitat (e.g., Coral Reefs, Open Ocean)"
                    value={marineLifeData.habitat}
                    onChange={(e) => setMarineLifeData({...marineLifeData, habitat: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  <Textarea
                    placeholder="Describe the species, behavior, characteristics..."
                    value={marineLifeData.description}
                    onChange={(e) => setMarineLifeData({...marineLifeData, description: e.target.value})}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-seagreen-600 hover:bg-seagreen-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-ocean-600 text-white hover:bg-ocean-700"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
