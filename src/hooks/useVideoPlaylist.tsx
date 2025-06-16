
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVideoPlaylist = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('video')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error fetching videos:', error);
        setError(error.message);
        return;
      }

      if (data) {
        // Filter for video files and create full URLs
        const videoFiles = data
          .filter(file => file.name.match(/\.(mp4|webm|ogg)$/i))
          .map(file => `https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/video/${file.name}`);
        
        console.log('Found videos:', videoFiles);
        setVideos(videoFiles);
        setError(null);
      }
    } catch (err) {
      console.error('Error in fetchVideos:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const nextVideo = useCallback(() => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }
  }, [videos.length]);

  const currentVideo = videos.length > 0 ? videos[currentVideoIndex] : null;

  return {
    videos,
    currentVideo,
    currentVideoIndex,
    nextVideo,
    loading,
    error,
    totalVideos: videos.length
  };
};
