
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
      
      // Try to list files in the video bucket
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

      if (data && data.length > 0) {
        // Filter for video files with proper extensions
        const videoFiles = data
          .filter(file => {
            // Check if it's a file (not a folder)
            if (!file.name || file.name.endsWith('/')) return false;
            
            // Accept video formats
            const videoExtensions = /\.(mp4|webm|ogg|avi|mov|mkv|m4v|flv|wmv)$/i;
            return videoExtensions.test(file.name);
          })
          .map(file => {
            // Create public URL for each video file
            const { data: urlData } = supabase.storage
              .from('video')
              .getPublicUrl(file.name);
            
            console.log('Adding video:', urlData.publicUrl);
            return urlData.publicUrl;
          });
        
        console.log('Filtered video files:', videoFiles);
        
        if (videoFiles.length > 0) {
          setVideos(videoFiles);
          setError(null);
        } else {
          console.warn('No video files found with supported extensions');
          setError('No video files found with supported extensions (.mp4, .mov, .webm, etc.)');
        }
      } else {
        // If storage query returns empty, but we know there are videos, try direct URLs
        console.log('Storage list returned empty, trying fallback approach...');
        
        // Fallback: Try to construct URLs for known video types
        const fallbackVideos = [
          'https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/video/Screen%20Recording%202025-06-16%20at%2010.04.56.mov',
          'https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/video/60_1750060561.mp4',
          'https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/video/57_1750059558.mp4'
        ];
        
        // Test if these URLs are accessible
        const accessibleVideos = [];
        for (const videoUrl of fallbackVideos) {
          try {
            const response = await fetch(videoUrl, { method: 'HEAD' });
            if (response.ok) {
              accessibleVideos.push(videoUrl);
              console.log('Accessible video found:', videoUrl);
            }
          } catch (e) {
            console.log('Video not accessible:', videoUrl);
          }
        }
        
        if (accessibleVideos.length > 0) {
          setVideos(accessibleVideos);
          setError(null);
        } else {
          setError('No video files found in the storage bucket. Please check that videos are uploaded and accessible.');
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
    setCurrentVideoIndex(0); // Reset to first video
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
