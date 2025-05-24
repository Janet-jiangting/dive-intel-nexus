
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
      return ['Name', 'Scientific Name', 'Category', 'Habitat', 'Conservation Status'];
    }
  };

  const getPreviewRow = (item: any, index: number) => {
    if (type === 'diveSites') {
      return (
        <tr key={index} className="border-b border-ocean-600">
          <td className="p-2 text-ocean-100">{item.name || item.Name || '-'}</td>
          <td className="p-2 text-ocean-100">{item.location || item.Location || '-'}</td>
          <td className="p-2 text-ocean-100">{item.type || item.Type || '-'}</td>
          <td className="p-2 text-ocean-100">{item.difficulty || item.Difficulty || '-'}</td>
          <td className="p-2 text-ocean-100">{item.depth || item['Depth (m)'] || '-'}</td>
        </tr>
      );
    } else {
      return (
        <tr key={index} className="border-b border-ocean-600">
          <td className="p-2 text-ocean-100">{item.name || item.Name || '-'}</td>
          <td className="p-2 text-ocean-100">{item.scientificName || item['Scientific Name'] || '-'}</td>
          <td className="p-2 text-ocean-100">{item.category || item.Category || '-'}</td>
          <td className="p-2 text-ocean-100">{item.habitat || item.Habitat || '-'}</td>
          <td className="p-2 text-ocean-100">{item.conservationStatus || item['Conservation Status'] || '-'}</td>
        </tr>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-ocean-800 border-ocean-700 text-white">
        <DialogHeader>
          <DialogTitle>Preview Data: {fileName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-ocean-300">
            Found {data.length} records. Please review the data before confirming upload.
          </div>
          
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
                    <td colSpan={5} className="p-2 text-center text-ocean-400 italic">
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
