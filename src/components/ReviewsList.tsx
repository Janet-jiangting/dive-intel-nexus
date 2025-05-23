
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, Flag } from 'lucide-react';

// Mock data for reviews
const reviews = [
  {
    id: 1,
    user: {
      name: 'Alex Johnson',
      image: null,
      initials: 'AJ',
    },
    rating: 5,
    date: '2023-12-15',
    title: 'Incredible dive experience',
    comment: 'One of the most amazing dives of my life. The visibility was excellent and we saw so many different species. The stalactites in the cave are truly impressive. Highly recommend to experienced divers.',
    helpful: 24,
  },
  {
    id: 2,
    user: {
      name: 'Sam Rivera',
      image: null,
      initials: 'SR',
    },
    rating: 4,
    date: '2023-11-28',
    title: 'Great dive, challenging conditions',
    comment: 'Beautiful site with unique geological features. The currents were stronger than expected which made the dive more challenging. Make sure to go with an experienced guide who knows the site well.',
    helpful: 17,
  },
  {
    id: 3,
    user: {
      name: 'Taylor Smith',
      image: null,
      initials: 'TS',
    },
    rating: 5,
    date: '2023-10-05',
    title: 'Worth the trip!',
    comment: 'The colors inside the Blue Hole are surreal. The deep blue gradient as you descend is something you have to see in person. We also encountered a small group of Caribbean reef sharks which was the highlight of our trip.',
    helpful: 32,
  },
];

const ReviewsList = () => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-ocean-700 pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border border-ocean-600">
              <AvatarImage src={review.user.image || undefined} alt={review.user.name} />
              <AvatarFallback className="bg-ocean-700 text-ocean-100">{review.user.initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white">{review.user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-ocean-300">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-ocean-700'}`} 
                        />
                      ))}
                    </div>
                    <span>·</span>
                    <time dateTime={review.date}>
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mt-2">{review.title}</h3>
              <p className="text-ocean-100 mt-2">{review.comment}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center text-ocean-300 text-sm hover:text-ocean-100">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center text-ocean-300 text-sm hover:text-ocean-100">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
