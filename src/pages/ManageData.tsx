
import React, { useState } from 'react';
import { Upload, Download, Database, FileSpreadsheet, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import UploadTracker from '@/components/UploadTracker';
import DataPreviewDialog from '@/components/DataPreviewDialog';
import { useMarineLifeData, Species } from '@/contexts/MarineLifeDataContext';

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
  const { addMarineLifeEntries } = useMarineLifeData();

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
      ['Clownfish', 'Amphiprion ocellaris', 'Fish', 'Coral Reefs', 'Least Concern', 'Known for their bright orange coloration with white stripes', 'Indo-Pacific,Red Sea', '1-15m', 'clownfish.jpg'],
      ['Manta Ray', 'Manta birostris', 'Ray', 'Open Ocean', 'Vulnerable', 'The largest type of ray with a wingspan reaching 7 meters', 'Tropical Waters,Pacific Ocean', '10-120m', 'manta.jpg'],
      ['Green Sea Turtle', 'Chelonia mydas', 'Reptile', 'Coral Reefs,Seagrass Beds', 'Endangered', 'Named for the greenish color of their fat', 'Tropical Waters,Subtropical Waters', '3-40m', 'turtle.jpg']
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
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data = lines.slice(1).map(line => {
      // Handle commas in quotes before splitting
      let values = [];
      let inQuote = false;
      let currentVal = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(currentVal.trim().replace(/^"|"$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      
      // Push the last value
      values.push(currentVal.trim().replace(/^"|"$/g, ''));
      
      // If basic split didn't work, maintain the same length as headers
      if (values.length !== headers.length) {
        values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      }
      
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    }).filter(obj => Object.values(obj).some(val => val !== ''));
    
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
            title: "Parsing Issue",
            description: "No valid data rows found in the file, or file format is not as expected. Please check the sample format.",
            variant: "destructive",
          });
          return;
        }

        setPreviewData(data);
        setPreviewFileName(file.name);
        setPreviewType(type);
        setShowPreview(true);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Error",
          description: "Failed to parse the file. Please check the format and console for details.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setImageFiles(files);
    
    toast({
      title: "Images Selected",
      description: `${files.length} image(s) selected. They will be associated with marine life entries when uploaded.`,
    });
    
    // Reset input
    event.target.value = '';
  };

  const mapPreviewDataToSpecies = (data: any[]): Species[] => {
    return data.map((item, index) => {
      // Create a more robust mapping that handles different case formats
      const getName = (keys: string[]): string => {
        for (const key of keys) {
          if (item[key] !== undefined && item[key] !== '') return item[key];
        }
        return 'Unknown Species';
      };
      
      const name = getName(['Name', 'name']);
      const scientificName = getName(['Scientific Name', 'scientificName', 'Scientific_Name', 'scientific_name']) || 'N/A';
      const category = getName(['Category', 'category']) || 'Fish';
      const habitat = getName(['Habitat', 'habitat']) || 'N/A';
      const conservationStatus = getName(['Conservation Status', 'conservationStatus', 'Conservation_Status', 'conservation_status']) || 'N/A';
      const description = getName(['Description', 'description']) || 'No description available';
      
      // Handle regions as either comma-separated or array
      let regions: string[] = [];
      const regionsRaw = getName(['Regions', 'regions']);
      if (regionsRaw) {
        regions = regionsRaw.split(',').map((r: string) => r.trim()).filter((r: string) => r);
      }
      
      // Handle depth range
      const depth = getName(['Depth Range', 'depthRange', 'Depth_Range', 'depth_range', 'Depth', 'depth']) || 'N/A';
      
      // Handle image filename - build proper URL
      const imageFilename = getName(['Image Filename', 'imageFilename', 'Image_Filename', 'image_filename']);
      let imageUrl = '/placeholder.svg';
      
      if (imageFilename) {
        // Check if it looks like a URL already
        if (imageFilename.startsWith('http') || imageFilename.startsWith('/')) {
          imageUrl = imageFilename;
        } else {
          // Assume it's just a filename that will be in public/images/marine-life/
          imageUrl = `/images/marine-life/${imageFilename}`;
        }
      }
      
      // Generate a unique ID
      const id = `ml-${Date.now()}-${index}`;
      
      return {
        id,
        name,
        scientificName,
        category,
        habitat,
        conservationStatus,
        description,
        regions,
        imageUrl,
        depth,
      };
    });
  };

  const confirmUpload = () => {
    if (previewType === 'marineLife') {
      const newSpeciesEntries = mapPreviewDataToSpecies(previewData);
      
      // Link with uploaded images if available
      if (imageFiles && imageFiles.length > 0) {
        // In a real app, we'd upload these images to a server
        // For now, we'll just simulate that the images are uploaded
        console.log(`Would upload ${imageFiles.length} images and link them to species`);
        
        toast({
          title: "Image Association Note",
          description: "In a production environment, images would be uploaded to a server. For this demo, please ensure image files are manually placed in the public/images/marine-life/ folder.",
        });
      }
      
      addMarineLifeEntries(newSpeciesEntries);
      
      toast({
        title: "Marine Life Data Added",
        description: `${newSpeciesEntries.length} species added to the database.`,
      });
    }
    // For diveSites, you would have a similar context or handling if needed
    // For now, diveSites upload only adds to local history

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
    setPreviewData([]); // Clear preview data

    toast({
      title: "Upload successful",
      description: `${newUpload.recordCount} ${previewType === 'diveSites' ? 'dive sites' : 'marine life'} records processed.`,
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
      // This preview function currently just shows a toast. 
      // To show actual data, it would need to store/retrieve the data associated with this upload ID.
      // For now, we'll keep it as a toast.
      toast({
        title: "Previewing Upload Record",
        description: `Details for ${upload.fileName}: ${upload.recordCount} records, type: ${upload.type}, date: ${upload.uploadDate}. Actual data preview from history is not implemented yet.`,
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
                    <label htmlFor="dive-sites-upload" className="sr-only">Choose Dive Sites File</label>
                    <Input
                      type="file"
                      accept=".csv" // Simplified to CSV for now as XLSX parsing is not implemented
                      onChange={(e) => handleFileUpload(e, 'diveSites')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="dive-sites-upload"
                    />
                    <Button
                      asChild // Allows the button to act as a label for the hidden input
                      className="w-full bg-ocean-700 border-ocean-600 text-white hover:bg-ocean-600"
                      variant="outline"
                    >
                      <label htmlFor="dive-sites-upload" className="flex items-center justify-center cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Dive Sites File
                      </label>
                    </Button>
                  </div>
                  
                  <div className="text-xs text-ocean-300">
                    <p>Supported format: CSV</p>
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
                     <label htmlFor="marine-life-upload" className="sr-only">Choose Marine Life File</label>
                    <Input
                      type="file"
                      accept=".csv" // Simplified to CSV
                      onChange={(e) => handleFileUpload(e, 'marineLife')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="marine-life-upload"
                    />
                     <Button
                      asChild
                      className="w-full bg-ocean-700 border-ocean-600 text-white hover:bg-ocean-600"
                      variant="outline"
                    >
                      <label htmlFor="marine-life-upload" className="flex items-center justify-center cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Marine Life File
                      </label>
                    </Button>
                  </div>
                  
                  <div className="text-xs text-ocean-300">
                    <p>Supported format: CSV</p>
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
                    onChange={handleImageUpload}
                    className="bg-ocean-700 border-ocean-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ocean-600 file:text-ocean-100 hover:file:bg-ocean-500"
                  />
                </div>
                
                <div className="text-xs text-ocean-300">
                  <p>• Name your image files to match the "Image Filename" column in your marine life data (e.g., clownfish.jpg)</p>
                  <p>• Supported formats: JPG, PNG, WebP</p>
                  <p>• Recommended size: 800x600 pixels or higher</p>
                  <p>• For now, ensure images are placed in `public/images/marine-life/` folder manually after noting filenames.</p>
                </div>
                
                {imageFiles && (
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Selected Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-ocean-900/50 rounded-md">
                      {Array.from(imageFiles).map((file, index) => (
                        <div key={index} className="text-ocean-200 text-sm flex items-center gap-1 overflow-hidden">
                          <div className="w-8 h-8 bg-ocean-700 rounded-md flex items-center justify-center flex-shrink-0">
                            <Image className="w-4 h-4 text-ocean-300" />
                          </div>
                          <span className="truncate" title={file.name}>{file.name}</span>
                        </div>
                      ))}
                    </div>
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
        onClose={() => { setShowPreview(false); setPreviewData([]); }} // Clear data on close
        onConfirm={confirmUpload}
        fileName={previewFileName}
        data={previewData}
        type={previewType}
      />
    </div>
  );
};

export default ManageData;
