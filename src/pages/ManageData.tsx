
import React, { useState } from 'react';
import { Upload, Download, Database, FileSpreadsheet, Image, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import UploadTracker from '@/components/UploadTracker';
import DataPreviewDialog from '@/components/DataPreviewDialog';

interface UploadRecord {
  id: string;
  fileName: string;
  type: 'diveSites' | 'marineLife';
  uploadDate: string;
  recordCount: number;
  status: 'success' | 'processing' | 'error';
}

const ManageData = () => {
  const [diveSiteFile, setDiveSiteFile] = useState<File | null>(null);
  const [marineLifeFile, setMarineLifeFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewType, setPreviewType] = useState<'diveSites' | 'marineLife'>('diveSites');
  const [showPreview, setShowPreview] = useState(false);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
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

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
    
    return data;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'diveSites' | 'marineLife') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        
        if (data.length === 0) {
          toast({
            title: "Error",
            description: "No valid data found in the file.",
            variant: "destructive",
          });
          return;
        }

        setPreviewData(data);
        setPreviewFileName(file.name);
        setPreviewType(type);
        setShowPreview(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse the file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const confirmUpload = () => {
    const newUpload: UploadRecord = {
      id: Date.now().toString(),
      fileName: previewFileName,
      type: previewType,
      uploadDate: new Date().toLocaleDateString(),
      recordCount: previewData.length,
      status: 'success'
    };

    setUploads(prev => [newUpload, ...prev]);
    setShowPreview(false);
    setPreviewData([]);

    toast({
      title: "Upload successful",
      description: `${previewData.length} ${previewType === 'diveSites' ? 'dive sites' : 'marine life'} records imported.`,
    });
  };

  const deleteUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
    toast({
      title: "Upload deleted",
      description: "Upload record has been removed.",
    });
  };

  const previewUpload = (id: string) => {
    const upload = uploads.find(u => u.id === id);
    if (upload) {
      toast({
        title: "Preview",
        description: `Viewing ${upload.fileName} with ${upload.recordCount} records`,
      });
    }
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
            <TabsTrigger value="history" className="data-[state=active]:bg-ocean-700">Upload History</TabsTrigger>
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
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'diveSites')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="dive-sites-upload"
                    />
                    <Button
                      className="w-full bg-ocean-700 border-ocean-600 text-white hover:bg-ocean-600"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Dive Sites File
                    </Button>
                  </div>
                  
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
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'marineLife')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="marine-life-upload"
                    />
                    <Button
                      className="w-full bg-ocean-700 border-ocean-600 text-white hover:bg-ocean-600"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Marine Life File
                    </Button>
                  </div>
                  
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

          <TabsContent value="history" className="space-y-6">
            <UploadTracker
              uploads={uploads}
              onDelete={deleteUpload}
              onPreview={previewUpload}
            />
          </TabsContent>
        </Tabs>
      </div>

      <DataPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={confirmUpload}
        fileName={previewFileName}
        data={previewData}
        type={previewType}
      />
    </div>
  );
};

export default ManageData;
