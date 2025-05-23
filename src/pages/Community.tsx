import React, { useState } from 'react';
import { 
  Search, Plus, MessageSquare, ThumbsUp, Clock, Eye, Users,
  Camera, Award, BookOpen, Fish 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const posts = [
  {
    id: 1,
    author: 'Alice Diver',
    avatarUrl: '/avatars/avatar-1.png',
    date: '2 hours ago',
    content: 'Just finished an amazing dive at the Great Barrier Reef! The coral was stunning and saw so many colorful fish. #diving #greatbarrierreef',
    imageUrl: '/placeholder.svg',
    likes: 52,
    comments: 12,
  },
  {
    id: 2,
    author: 'Bob Ocean',
    avatarUrl: '/avatars/avatar-2.png',
    date: '1 day ago',
    content: 'Anyone know of good wreck dives in the Caribbean? Looking for my next adventure! #wreckdiving #caribbean',
    likes: 38,
    comments: 8,
  },
  {
    id: 3,
    author: 'Carolyn Sea',
    avatarUrl: '/avatars/avatar-3.png',
    date: '3 days ago',
    content: 'I\'m organizing a cleanup dive next month in Monterey. All are welcome to join! Let\'s keep our oceans clean. #cleanupdiving #monterey',
    likes: 75,
    comments: 25,
  },
];

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0; // Already in order
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
          <p className="text-ocean-200 mb-8">
            Connect with fellow divers, share your experiences, and discover new adventures.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts by content or author..."
                className="pl-9 bg-ocean-700/50 border-ocean-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button className="bg-ocean-500 hover:bg-ocean-400 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-ocean-200">{sortedPosts.length} posts found</span>
          </div>
          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger className="w-[180px] bg-ocean-800/50 border-ocean-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {sortedPosts.map(post => (
            <Card key={post.id} className="bg-ocean-800 border-ocean-700">
              <CardHeader className="flex items-start">
                <Avatar className="w-8 h-8 mr-4">
                  <AvatarImage src={post.avatarUrl} alt={post.author} />
                  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white">{post.author}</CardTitle>
                  <p className="text-ocean-300 text-sm">{post.date}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-ocean-100 mb-4">{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post" className="rounded-md mb-4" />
                )}
                <div className="flex justify-between items-center text-ocean-300">
                  <div className="flex items-center">
                    <Button variant="ghost" className="gap-2 px-2 hover:bg-ocean-700/50">
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" className="gap-2 px-2 hover:bg-ocean-700/50">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="link" className="text-sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
