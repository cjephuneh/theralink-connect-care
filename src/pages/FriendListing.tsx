
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

const FriendListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch verified friends
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ['verified-friends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          profile_image_url,
          friend_details (
            experience_description,
            areas_of_experience,
            personal_story,
            communication_preferences
          )
        `)
        .eq('role', 'friend')
        .not('friend_details', 'is', null);

      if (error) throw error;

      return data.map(profile => ({
        id: profile.id,
        full_name: profile.full_name || 'Anonymous Friend',
        profile_image_url: profile.profile_image_url,
        experience_description: profile.friend_details?.[0]?.experience_description || '',
        areas_of_experience: profile.friend_details?.[0]?.areas_of_experience || '',
        personal_story: profile.friend_details?.[0]?.personal_story || '',
        communication_preferences: profile.friend_details?.[0]?.communication_preferences || '',
      })) as Friend[];
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

    const matchesArea = !areaFilter || 
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
                    <SelectItem value="">All Areas</SelectItem>
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
                <Button onClick={() => { setSearchQuery(""); setAreaFilter(""); }}>Show All Friends</Button>
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
