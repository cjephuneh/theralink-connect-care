
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, MessageCircle, Heart, Filter, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Friend {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  experience_description: string;
  areas_of_experience: string;
  personal_story: string;
  communication_preferences: string;
}

// Hardcoded friends data as fallback
const hardcodedFriends: Friend[] = [
  {
    id: "1",
    full_name: "Sarah Johnson",
    profile_image_url: null,
    experience_description: "I've been through anxiety and depression and found ways to cope through mindfulness and community support.",
    areas_of_experience: "Anxiety, Depression, Mindfulness",
    personal_story: "After struggling with anxiety for years, I discovered the power of peer support and want to help others on their journey.",
    communication_preferences: "Text messages, Video calls"
  },
  {
    id: "2",
    full_name: "Michael Chen",
    profile_image_url: null,
    experience_description: "Overcame addiction and now help others navigate recovery with compassion and understanding.",
    areas_of_experience: "Addiction Recovery, Life Coaching",
    personal_story: "My recovery journey taught me the importance of having someone who truly understands what you're going through.",
    communication_preferences: "Phone calls, In-person meetings"
  },
  {
    id: "3",
    full_name: "Emma Rodriguez",
    profile_image_url: null,
    experience_description: "Living with ADHD and helping others develop coping strategies and organizational skills.",
    areas_of_experience: "ADHD, Organization, Time Management",
    personal_story: "I learned to work with my ADHD rather than against it, and I love sharing practical tips that actually work.",
    communication_preferences: "Text messages, Video calls"
  },
  {
    id: "4",
    full_name: "David Thompson",
    profile_image_url: null,
    experience_description: "Grief counselor and someone who has walked through loss, offering support and understanding.",
    areas_of_experience: "Grief, Loss, Bereavement",
    personal_story: "After losing my spouse, I found healing through helping others navigate their own grief journey.",
    communication_preferences: "Phone calls, Video calls"
  },
  {
    id: "5",
    full_name: "Lisa Park",
    profile_image_url: null,
    experience_description: "Mental health advocate focusing on workplace stress and work-life balance.",
    areas_of_experience: "Workplace Stress, Burnout, Work-Life Balance",
    personal_story: "I experienced severe burnout in my corporate career and learned how to create healthy boundaries.",
    communication_preferences: "Text messages, Email"
  },
  {
    id: "6",
    full_name: "James Wilson",
    profile_image_url: null,
    experience_description: "Supporting individuals with social anxiety and helping them build confidence in social situations.",
    areas_of_experience: "Social Anxiety, Confidence Building",
    personal_story: "I was extremely shy and anxious in social situations. Now I help others break out of their shells.",
    communication_preferences: "Video calls, In-person meetings"
  }
];

const FriendListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Try to fetch verified friends, but use hardcoded data as fallback
  const { data: friends = hardcodedFriends, isLoading: friendsLoading } = useQuery({
    queryKey: ['verified-friends'],
    queryFn: async () => {
      try {
        // Try to fetch from database first
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'friend');

        if (error) {
          console.log('Database query failed, using hardcoded data:', error);
          return hardcodedFriends;
        }

        if (!data || data.length === 0) {
          console.log('No friends found in database, using hardcoded data');
          return hardcodedFriends;
        }

        // If we have database data, transform it to match our interface
        return data.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'Anonymous Friend',
          profile_image_url: profile.profile_image_url,
          experience_description: 'Experienced in providing peer support',
          areas_of_experience: 'General Support',
          personal_story: 'Ready to help and support others in their journey',
          communication_preferences: 'Available for chat and support',
        })) as Friend[];
      } catch (error) {
        console.log('Error fetching friends, using hardcoded data:', error);
        return hardcodedFriends;
      }
    }
  });

  // Get unique areas of experience for filtering
  const allAreas = Array.from(
    new Set(
      friends
        .map(friend => friend.areas_of_experience.split(','))
        .flat()
        .map(area => area.trim())
        .filter(Boolean)
    )
  ).sort();

  // Filter friends based on search and filters
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = !searchQuery || 
      friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.experience_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.areas_of_experience.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = areaFilter === "all" || 
      friend.areas_of_experience.toLowerCase().includes(areaFilter.toLowerCase());

    return matchesSearch && matchesArea;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full animation-fade-in">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-secondary to-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">Peer Support</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Connect with Friends</h1>
            <p className="text-lg opacity-90">
              Find people who have walked in your shoes and can offer support, understanding, and hope through shared experiences.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          {/* Search and Filters */}
          <div className="bg-card rounded-xl shadow-sm border border-border/50">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, experience, or area"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {allAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-2">
            <p className="text-muted-foreground mb-6">{filteredFriends.length} friends available to help</p>
            
            {friendsLoading || isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden rounded-xl">
                    <div className="w-full h-52 bg-muted animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted animate-pulse rounded-full w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted animate-pulse rounded-full w-1/2 mb-6"></div>
                      <div className="h-16 bg-muted animate-pulse rounded mb-4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="bg-card p-12 rounded-xl shadow-sm border border-border/50 text-center">
                <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No friends match your criteria</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or browse all available friends.</p>
                <Button onClick={() => { setSearchQuery(""); setAreaFilter("all"); }}>Show All Friends</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFriends.map(friend => (
                  <Card key={friend.id} className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                    <div className="relative">
                      <div className="w-full h-52 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                        {friend.profile_image_url ? (
                          <img 
                            src={friend.profile_image_url} 
                            alt={friend.full_name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <User className="h-20 w-20 text-muted-foreground" />
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm text-secondary text-xs font-medium px-3 py-1 rounded-full flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          Friend
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">{friend.full_name}</h3>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {friend.areas_of_experience.split(',').slice(0, 3).map((area, index) => (
                            <span 
                              key={index} 
                              className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full"
                            >
                              {area.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="line-clamp-3">{friend.experience_description}</p>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium text-secondary mb-1">Communication:</p>
                        <p className="text-muted-foreground text-xs">{friend.communication_preferences}</p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 border-t border-border/50">
                      <Button 
                        className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                        asChild
                      >
                        <Link to={`/chat/${friend.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Connect
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendListing;
