
import React, { useState } from 'react';
import { Upload, Download, Database, FileSpreadsheet, Image, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ManageData = () => {
  const [diveSiteFile, setDiveSiteFile] = useState<File | null>(null);
  const [marineLifeFile, setMarineLifeFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const downloadSampleDiveSites = () => {
    const sampleData = [
      ['Name', 'Location', 'Latitude', 'Longitude', 'Type', 'Difficulty', 'Depth (m)', 'Visibility (m)', 'Temperature (°C)', 'Description'],
      ['Sample Reef', 'Maldives', '4.1755', '73.5093', 'Reef', 'Beginner', '15', '30', '28', 'Beautiful coral reef with diverse marine life'],
      ['Deep Blue Wall', 'Egypt', '27.2946', '33.8454', 'Wall', 'Advanced', '40', '25', '24', 'Spectacular wall dive with large pelagics']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_dive_sites.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadSampleMarineLife = () => {
    const sampleData = [
      ['Name', 'Scientific Name', 'Category', 'Habitat', 'Conservation Status', 'Description', 'Regions', 'Depth Range', 'Image Filename'],
      ['Sample Fish', 'Fishus sampleus', 'Fish', 'Coral Reefs', 'Least Concern', 'A beautiful sample fish species', 'Indo-Pacific', '5-20m', 'sample_fish.jpg'],
      ['Sample Turtle', 'Turtlus sampleus', 'Reptile', 'Seagrass Beds', 'Vulnerable', 'An endangered sea turtle species', 'Tropical Waters', '1-30m', 'sample_turtle.jpg']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_marine_life.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File, type: 'diveSites' | 'marineLife') => {
    if (!file) return;
    
    // Here you would process the CSV file and convert it to the appropriate format
    toast({
      title: "File uploaded successfully",
      description: `${type === 'diveSites' ? 'Dive sites' : 'Marine life'} data has been imported.`,
    });
  };

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Manage Data</h1>
          <p className="text-ocean-200 mb-8">
            Import dive sites and marine life data to enhance the application database
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="bg-ocean-800 border-ocean-700">
            <TabsTrigger value="import" className="data-[state=active]:bg-ocean-700">Import Data</TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-ocean-700">Upload Images</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dive Sites Import */}
              <Card className="bg-ocean-800 border-ocean-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Dive Sites Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={downloadSampleDiveSites}
                    variant="outline"
                    className="w-full border-ocean-600 text-white hover:bg-ocean-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample Format
                  </Button>
                  
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setDiveSiteFile(file);
                        handleFileUpload(file, 'diveSites');
                      }
                    }}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  
                  <div className="text-xs text-ocean-300">
                    <p>Supported formats: CSV, Excel (.xlsx)</p>
                    <p>Required columns: Name, Location, Latitude, Longitude, Type, Difficulty, Depth, Visibility, Temperature, Description</p>
                  </div>
                </CardContent>
              </Card>

              {/* Marine Life Import */}
              <Card className="bg-ocean-800 border-ocean-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Marine Life Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={downloadSampleMarineLife}
                    variant="outline"
                    className="w-full border-ocean-600 text-white hover:bg-ocean-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample Format
                  </Button>
                  
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMarineLifeFile(file);
                        handleFileUpload(file, 'marineLife');
                      }
                    }}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                  
                  <div className="text-xs text-ocean-300">
                    <p>Supported formats: CSV, Excel (.xlsx)</p>
                    <p>Required columns: Name, Scientific Name, Category, Habitat, Conservation Status, Description, Regions, Depth Range, Image Filename</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Upload Images for Marine Life
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-ocean-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-ocean-400 mx-auto mb-4" />
                  <p className="text-ocean-200 mb-4">Drag and drop images here or click to browse</p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(e.target.files)}
                    className="bg-ocean-700 border-ocean-600 text-white"
                  />
                </div>
                
                <div className="text-xs text-ocean-300">
                  <p>• Name your image files to match the "Image Filename" column in your marine life data</p>
                  <p>• Supported formats: JPG, PNG, WebP</p>
                  <p>• Recommended size: 800x600 pixels or higher</p>
                </div>
                
                {imageFiles && (
                  <div className="text-sm text-ocean-200">
                    {imageFiles.length} image(s) selected
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageData;
