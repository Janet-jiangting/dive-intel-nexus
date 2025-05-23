
import React from 'react';
import { 
  Users, MessageSquare, Award, Calendar, User, ThumbsUp, 
  MessageCircle, Clock, Eye, Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Mock discussion topics/posts
const discussionTopics = [
  {
    id: 1,
    title: 'Best dive sites for beginners in Southeast Asia',
    author: {
      name: 'Alex Chen',
      initials: 'AC',
      image: null,
    },
    category: 'Dive Sites',
    replies: 24,
    views: 342,
    lastActivity: '2 hours ago',
    pinned: true,
  },
  {
    id: 2,
    title: 'Recommendations for underwater camera setup under $1000',
    author: {
      name: 'Sarah Johnson',
      initials: 'SJ',
      image: null,
    },
    category: 'Photography',
    replies: 37,
    views: 512,
    lastActivity: '4 hours ago',
    pinned: false,
  },
  {
    id: 3,
    title: 'Coral bleaching observed at Great Barrier Reef - April 2023',
    author: {
      name: 'Dr. Michael Lee',
      initials: 'ML',
      image: null,
    },
    category: 'Conservation',
    replies: 42,
    views: 867,
    lastActivity: '1 day ago',
    pinned: true,
  },
  {
    id: 4,
    title: 'Review: New Aqua Lung Legend regulator',
    author: {
      name: 'Tina Rodriguez',
      initials: 'TR',
      image: null,
    },
    category: 'Equipment',
    replies: 18,
    views: 294,
    lastActivity: '3 days ago',
    pinned: false,
  },
  {
    id: 5,
    title: 'Looking for dive buddies in California for summer trips',
    author: {
      name: 'Jake Wilson',
      initials: 'JW',
      image: null,
    },
    category: 'Meet-Up',
    replies: 15,
    views: 189,
    lastActivity: '5 days ago',
    pinned: false,
  },
];

// Mock featured members
const featuredMembers = [
  {
    name: 'Laura Martinez',
    initials: 'LM',
    image: null,
    role: 'Dive Master',
    contributions: 184,
    memberSince: '2019',
  },
  {
    name: 'Mark Taylor',
    initials: 'MT',
    image: null,
    role: 'Marine Biologist',
    contributions: 267,
    memberSince: '2020',
  },
  {
    name: 'Aisha Patel',
    initials: 'AP',
    image: null,
    role: 'Underwater Photographer',
    contributions: 142,
    memberSince: '2021',
  },
];

// Mock upcoming dive events
const upcomingEvents = [
  {
    id: 1,
    title: 'Annual Reef Cleanup - Bali',
    date: '2024-06-15',
    attendees: 28,
    location: 'Nusa Penida, Bali',
  },
  {
    id: 2,
    title: 'Dive Photography Workshop',
    date: '2024-06-30',
    attendees: 15,
    location: 'Key Largo, Florida',
  },
  {
    id: 3,
    title: 'Night Dive Expedition',
    date: '2024-07-22',
    attendees: 12,
    location: 'Great Barrier Reef, Australia',
  },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Diving Community</h1>
              <p className="text-ocean-200 mb-4">
                Connect with fellow divers, share experiences, and learn from the community
              </p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button className="bg-seagreen-600 hover:bg-seagreen-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Discussion
              </Button>
              <Button variant="outline" className="border-ocean-600 text-white hover:bg-ocean-700">
                <Users className="h-4 w-4 mr-2" />
                Find Dive Buddies
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="discussions" className="mb-8">
              <TabsList className="bg-ocean-800 border-b border-ocean-700 rounded-none w-full justify-start">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="dive-logs">Dive Logs</TabsTrigger>
                <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
              </TabsList>
              <TabsContent value="discussions">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Recent Discussions</CardTitle>
                      <div className="flex items-center">
                        <Input 
                          placeholder="Search discussions..." 
                          className="bg-ocean-700/50 border-ocean-600 text-white mr-2 w-[200px]"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {discussionTopics.map((topic) => (
                        <li key={topic.id}>
                          <a
                            href={`#topic-${topic.id}`}
                            className="block p-3 hover:bg-ocean-700/50 rounded-md transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Avatar className="h-10 w-10 border border-ocean-600">
                                  <AvatarImage src={topic.author.image || undefined} alt={topic.author.name} />
                                  <AvatarFallback className="bg-ocean-700 text-ocean-100">{topic.author.initials}</AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <div className="flex items-center">
                                    {topic.pinned && (
                                      <Badge variant="outline" className="mr-2 border-ocean-500 text-ocean-300">
                                        Pinned
                                      </Badge>
                                    )}
                                    <h3 className="font-medium text-white">{topic.title}</h3>
                                  </div>
                                  
                                  <div className="flex items-center mt-1 text-sm text-ocean-300">
                                    <span>{topic.author.name}</span>
                                    <span className="mx-2">•</span>
                                    <Badge className="bg-ocean-700 text-ocean-200">{topic.category}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center text-sm text-ocean-300 space-x-4">
                                <div className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  <span>{topic.replies}</span>
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span>{topic.views}</span>
                                </div>
                                <div className="hidden md:flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{topic.lastActivity}</span>
                                </div>
                              </div>
                            </div>
                          </a>
                          <Separator className="bg-ocean-700/50 last:hidden" />
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="text-sm text-ocean-300">
                        Showing 5 of 128 discussions
                      </div>
                      <Button variant="outline" className="border-ocean-600 text-white hover:bg-ocean-700">
                        View All Discussions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="dive-logs">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Dive Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <p className="text-ocean-200">Dive logs feature coming soon!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="photos">
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle className="text-white">Community Photo Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <p className="text-ocean-200">Photo gallery feature coming soon!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Popular Topics */}
            <Card className="bg-ocean-800 border-ocean-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Popular Discussion Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">Dive Sites</span>
                    <span className="text-xs text-ocean-300 mt-1">843 posts</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">Equipment</span>
                    <span className="text-xs text-ocean-300 mt-1">652 posts</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">Photography</span>
                    <span className="text-xs text-ocean-300 mt-1">479 posts</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">Conservation</span>
                    <span className="text-xs text-ocean-300 mt-1">375 posts</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">Meet-Up</span>
                    <span className="text-xs text-ocean-300 mt-1">231 posts</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="h-auto flex-col text-white border border-ocean-700 hover:bg-ocean-700 hover:text-white py-6"
                  >
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <span className="text-base">View All</span>
                    <span className="text-xs text-ocean-300 mt-1">12 categories</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Community Stats */}
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-ocean-700/50 rounded-md">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-ocean-300 mr-3" />
                      <span className="text-white">Members</span>
                    </div>
                    <span className="font-semibold text-white">4,293</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-ocean-700/50 rounded-md">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-ocean-300 mr-3" />
                      <span className="text-white">Discussions</span>
                    </div>
                    <span className="font-semibold text-white">12,847</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-ocean-700/50 rounded-md">
                    <div className="flex items-center">
                      <ThumbsUp className="h-5 w-5 text-ocean-300 mr-3" />
                      <span className="text-white">Contributions</span>
                    </div>
                    <span className="font-semibold text-white">35,128</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full border-ocean-600 text-white hover:bg-ocean-700">
                    Join Our Community
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Featured Members */}
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Featured Members</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {featuredMembers.map((member, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 border border-ocean-600">
                        <AvatarImage src={member.image || undefined} alt={member.name} />
                        <AvatarFallback className="bg-ocean-700 text-ocean-100">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-white">{member.name}</h3>
                          <Badge className="ml-2 bg-ocean-700 text-ocean-300">{member.role}</Badge>
                        </div>
                        <div className="text-sm text-ocean-300 flex items-center mt-1">
                          <Award className="h-3 w-3 mr-1" />
                          <span>{member.contributions} contributions</span>
                          <span className="mx-1">•</span>
                          <span>Since {member.memberSince}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Upcoming Events */}
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Upcoming Dive Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="border-l-2 border-ocean-500 pl-4 py-1">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <div className="flex items-center text-sm text-ocean-300 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-ocean-300">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {event.location}
                        </div>
                        <Badge variant="outline" className="border-ocean-600 text-ocean-300">
                          <User className="h-3 w-3 mr-1" />
                          {event.attendees} attending
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full mt-6 bg-ocean-700 hover:bg-ocean-600">
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
