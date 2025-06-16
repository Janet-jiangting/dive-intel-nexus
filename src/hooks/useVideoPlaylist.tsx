
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
      console.log('Fetching videos from Supabase storage...');
      
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

      console.log('Raw storage data:', data);

      if (data) {
        // Filter for video files with more flexible extensions and include files without extensions
        const videoFiles = data
          .filter(file => {
            // Check if it's a file (not a folder)
            if (!file.name || file.name.endsWith('/')) return false;
            
            // Accept common video formats or files without extensions (assuming they're videos)
            const videoExtensions = /\.(mp4|webm|ogg|avi|mov|mkv|m4v)$/i;
            const hasNoExtension = !file.name.includes('.');
            
            return videoExtensions.test(file.name) || hasNoExtension;
          })
          .map(file => {
            const publicUrl = `https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/video/${file.name}`;
            console.log('Adding video:', publicUrl);
            return publicUrl;
          });
        
        console.log('Filtered video files:', videoFiles);
        setVideos(videoFiles);
        setError(null);
        
        if (videoFiles.length === 0) {
          console.warn('No video files found in the bucket. Make sure your videos have proper extensions (.mp4, .webm, .ogg, etc.) or upload them directly.');
          setError('No video files found in the storage bucket');
        }
      }
    } catch (err) {
      console.error('Error in fetchVideos:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred while fetching videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const nextVideo = useCallback(() => {
    if (videos.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      console.log(`Switching to next video: ${nextIndex + 1} of ${videos.length}`);
      setCurrentVideoIndex(nextIndex);
    }
  }, [videos.length, currentVideoIndex]);

  const refreshPlaylist = useCallback(() => {
    console.log('Refreshing video playlist...');
    fetchVideos();
  }, [fetchVideos]);

  const currentVideo = videos.length > 0 ? videos[currentVideoIndex] : null;

  return {
    videos,
    currentVideo,
    currentVideoIndex,
    nextVideo,
    refreshPlaylist,
    loading,
    error,
    totalVideos: videos.length
  };
};
