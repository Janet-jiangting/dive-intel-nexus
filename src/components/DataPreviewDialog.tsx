
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  data: any[];
  type: 'diveSites' | 'marineLife';
}

const DataPreviewDialog = ({ isOpen, onClose, onConfirm, fileName, data, type }: DataPreviewDialogProps) => {
  const getPreviewColumns = () => {
    if (type === 'diveSites') {
      return ['Name', 'Location', 'Type', 'Difficulty', 'Depth (m)'];
    } else {
      return ['Name', 'Scientific Name', 'Category', 'Habitat', 'Conservation Status', 'Image Filename'];
    }
  };

  const getPreviewRow = (item: any, index: number) => {
    const getValue = (keys: string[]): string => {
      for (const key of keys) {
        if (item[key] !== undefined && item[key] !== '') return item[key];
      }
      return '-';
    };
    
    if (type === 'diveSites') {
      return (
        <tr key={index} className="border-b border-ocean-600">
          <td className="p-2 text-ocean-100">{getValue(['Name', 'name'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Location', 'location'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Type', 'type'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Difficulty', 'difficulty'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Depth (m)', 'Depth', 'depth'])}</td>
        </tr>
      );
    } else {
      return (
        <tr key={index} className="border-b border-ocean-600">
          <td className="p-2 text-ocean-100">{getValue(['Name', 'name'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Scientific Name', 'scientificName', 'Scientific_Name'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Category', 'category'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Habitat', 'habitat'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Conservation Status', 'conservationStatus', 'Conservation_Status'])}</td>
          <td className="p-2 text-ocean-100">{getValue(['Image Filename', 'imageFilename', 'Image_Filename']) || '(No image)'}</td>
        </tr>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-ocean-800 border-ocean-700 text-white">
        <DialogHeader>
          <DialogTitle>Preview Data: {fileName}</DialogTitle>
          <DialogDescription className="text-ocean-200">
            Found {data.length} records. Please review before confirming import.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <ScrollArea className="h-96 w-full border border-ocean-600 rounded">
            <table className="w-full">
              <thead className="bg-ocean-900 sticky top-0">
                <tr>
                  {getPreviewColumns().map((column) => (
                    <th key={column} className="p-2 text-left text-ocean-200 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((item, index) => getPreviewRow(item, index))}
                {data.length > 50 && (
                  <tr>
                    <td colSpan={getPreviewColumns().length} className="p-2 text-center text-ocean-400 italic">
                      ... and {data.length - 50} more records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-ocean-600 text-white hover:bg-ocean-700">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-seagreen-600 hover:bg-seagreen-700">
            Confirm Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataPreviewDialog;
