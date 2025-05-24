
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Database } from 'lucide-react';

interface DataImportProps {
  onDataImport: (data: any, type: 'diveSites' | 'marineLife' | 'mapData') => void;
}

const DataImport = ({ onDataImport }: DataImportProps) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importType, setImportType] = useState<'diveSites' | 'marineLife' | 'mapData'>('diveSites');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        onDataImport(jsonData, importType);
        console.log('Data imported successfully:', jsonData);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonSubmit = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      onDataImport(jsonData, importType);
      setJsonInput('');
      console.log('Data imported successfully:', jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Error parsing JSON. Please check the format.');
    }
  };

  const getSampleData = () => {
    switch (importType) {
      case 'diveSites':
        return `[
  {
    "id": 1,
    "name": "Custom Dive Site",
    "location": "Your Location",
    "coordinates": { "lat": 25.0, "lng": -80.0 },
    "type": "Reef",
    "rating": 4.5,
    "difficulty": "Intermediate",
    "depth": 25,
    "visibility": 30,
    "temperature": 26,
    "description": "A beautiful custom dive site",
    "reviews": 100
  }
]`;
      case 'marineLife':
        return `{
  "1": {
    "fish": ["Custom Fish 1", "Custom Fish 2"],
    "coral": ["Custom Coral 1", "Custom Coral 2"],
    "other": ["Custom Species 1", "Custom Species 2"]
  }
}`;
      case 'mapData':
        return `{
  "style": "mapbox://styles/mapbox/satellite-v9",
  "center": [0, 30],
  "zoom": 2
}`;
      default:
        return '';
    }
  };

  return (
    <Card className="bg-ocean-800 border-ocean-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          Import Custom Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ocean-200 mb-2 block">
            Data Type
          </label>
          <select
            value={importType}
            onChange={(e) => setImportType(e.target.value as 'diveSites' | 'marineLife' | 'mapData')}
            className="w-full p-2 bg-ocean-700 border border-ocean-600 rounded text-white"
          >
            <option value="diveSites">Dive Sites</option>
            <option value="marineLife">Marine Life</option>
            <option value="mapData">Map Configuration</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ocean-200 mb-2 block">
            Upload JSON File
          </label>
          <Input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="bg-ocean-700 border-ocean-600 text-white"
          />
        </div>

        <div className="text-center text-ocean-300">
          <span>or</span>
        </div>

        <div>
          <label className="text-sm font-medium text-ocean-200 mb-2 block">
            Paste JSON Data
          </label>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste your ${importType} JSON data here...`}
            className="bg-ocean-700 border-ocean-600 text-white min-h-[120px]"
          />
          <Button
            onClick={handleJsonSubmit}
            disabled={!jsonInput.trim()}
            className="mt-2 bg-seagreen-600 hover:bg-seagreen-700"
          >
            Import JSON Data
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-ocean-200 mb-2 block">
            Sample Data Format
          </label>
          <pre className="bg-ocean-900 p-3 rounded text-xs text-ocean-100 overflow-x-auto">
            {getSampleData()}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImport;
