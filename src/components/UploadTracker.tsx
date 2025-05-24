
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Calendar, FileText, Database } from 'lucide-react';

interface UploadRecord {
  id: string;
  fileName: string;
  type: 'diveSites' | 'marineLife';
  uploadDate: string;
  recordCount: number;
  status: 'success' | 'processing' | 'error';
}

interface UploadTrackerProps {
  uploads: UploadRecord[];
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

const UploadTracker = ({ uploads, onDelete, onPreview }: UploadTrackerProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'diveSites' ? <Database className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  return (
    <Card className="bg-ocean-800 border-ocean-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upload History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-ocean-300 text-center py-4">No uploads yet</p>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 bg-ocean-900/50 rounded-lg border border-ocean-600">
                <div className="flex items-center gap-3">
                  {getTypeIcon(upload.type)}
                  <div>
                    <p className="text-white font-medium">{upload.fileName}</p>
                    <div className="flex items-center gap-2 text-sm text-ocean-300">
                      <span>{upload.recordCount} records</span>
                      <span>•</span>
                      <span>{upload.uploadDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(upload.status)}>
                    {upload.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPreview(upload.id)}
                    className="text-ocean-300 hover:text-white hover:bg-ocean-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(upload.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadTracker;
