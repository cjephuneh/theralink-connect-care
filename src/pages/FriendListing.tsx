
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, MessageCircle, Filter, CheckCircle, Shield, Sparkles, Heart, User } from "lucide-react";
import { Link } from 'react-router-dom';

// Mock friend data (in a real app, this would come from Supabase)
const mockFriends = [
  {
    id: 1,
    name: "Emma Wilson",
    title: "Peer Support - Depression & Anxiety",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.8,
    reviewCount: 42,
    areas: ["Depression", "Anxiety", "Stress Management"],
    languages: ["English", "Spanish"],
    yearsExperience: 4,
    nextAvailable: "Today",
    about: "Having overcome severe depression and anxiety, I'm passionate about supporting others on their journey to mental wellness."
  },
  {
    id: 2,
    name: "Marcus Chen",
    title: "Peer Support - Work Stress & Burnout",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    reviewCount: 38,
    areas: ["Work Stress", "Burnout", "Life Balance"],
    languages: ["English", "Mandarin"],
    yearsExperience: 6,
    nextAvailable: "Tomorrow",
    about: "After experiencing burnout in my corporate career, I've learned valuable techniques to manage stress and maintain healthy boundaries."
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    title: "Peer Support - Grief & Loss",
    image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 5.0,
    reviewCount: 51,
    areas: ["Grief", "Loss", "Life Transitions"],
    languages: ["English", "Portuguese"],
    yearsExperience: 5,
    nextAvailable: "Today",
    about: "Having navigated profound loss, I provide compassionate support to others going through similar experiences."
  },
  {
    id: 4,
    name: "David Johnson",
    title: "Peer Support - Addiction Recovery",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.7,
    reviewCount: 29,
    areas: ["Addiction Recovery", "Sobriety Support", "Life Rebuilding"],
    languages: ["English"],
    yearsExperience: 8,
    nextAvailable: "In 2 days",
    about: "With 8 years of sobriety, I help others navigate the challenges of recovery and building a fulfilling life after addiction."
  },
  {
    id: 5,
    name: "Aisha Patel",
    title: "Peer Support - Cultural Identity",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    reviewCount: 34,
    areas: ["Cultural Identity", "Immigration", "Belonging"],
    languages: ["English", "Hindi", "Urdu"],
    yearsExperience: 3,
    nextAvailable: "Tomorrow",
    about: "As a third-culture individual, I support others navigating complex cultural identities and finding their authentic selves."
  },
  {
    id: 6,
    name: "Thomas Lee",
    title: "Peer Support - LGBTQ+ Issues",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 5.0,
    reviewCount: 47,
    areas: ["Coming Out", "Identity", "Family Relationships"],
    languages: ["English", "Korean"],
    yearsExperience: 7,
    nextAvailable: "Today",
    about: "I provide supportive guidance to others in the LGBTQ+ community based on my own journey of self-acceptance and resilience."
  },
];

// Interface for friend data
interface Friend {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  areas: string[];
  languages: string[];
  yearsExperience: number;
  nextAvailable: string;
  about: string;
}

const FriendListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [area, setArea] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // All unique areas from the mock data
  const allAreas = Array.from(
    new Set(mockFriends.flatMap(friend => friend.areas))
  ).sort();

  // All unique languages from the mock data
  const allLanguages = Array.from(
    new Set(mockFriends.flatMap(friend => friend.languages))
  ).sort();

  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter friends based on search and filters
  useEffect(() => {
    let filtered = [...mockFriends];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        friend => 
          friend.name.toLowerCase().includes(query) || 
          friend.about.toLowerCase().includes(query) ||
          friend.areas.some(area => 
            area.toLowerCase().includes(query)
          )
      );
    }
    
    if (area && area !== "all") {
      filtered = filtered.filter(
        friend => friend.areas.includes(area)
      );
    }
    
    if (language && language !== "all") {
      filtered = filtered.filter(
        friend => friend.languages.includes(language)
      );
    }
    
    if (availability && availability !== "all") {
      if (availability === "Today") {
        filtered = filtered.filter(
          friend => friend.nextAvailable === "Today"
        );
      } else if (availability === "This Week") {
        filtered = filtered.filter(
          friend => ["Today", "Tomorrow", "In 2 days", "In 3 days"].includes(friend.nextAvailable)
        );
      }
    }
    
    setFriends(filtered);
  }, [searchQuery, area, language, availability]);

  const resetFilters = () => {
    setSearchQuery("");
    setArea("");
    setLanguage("");
    setAvailability("");
  };

  return (
    <div className="w-full animation-fade-in">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-secondary to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">Find Peer Support</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Connect with Friends Who Understand</h1>
            <p className="text-lg opacity-90">
              Browse our community of peer supporters who have walked similar paths and can share their experiences.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          {/* Search and Filters */}
          <div className="bg-card rounded-xl shadow-sm border border-border/50">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, areas of experience or keyword"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="md:hidden">
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-between items-center"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                  >
                    <span>Filter Results</span> 
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 ${isFilterVisible ? '' : 'hidden md:grid'}`}>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Area of Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {allAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {allLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Availability</SelectItem>
                      <SelectItem value="Today">Available Today</SelectItem>
                      <SelectItem value="This Week">Available This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Applied filters */}
              {(searchQuery || area || language || availability) && (
                <div className="flex flex-wrap items-center mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                  {searchQuery && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      Search: {searchQuery}
                    </span>
                  )}
                  {area && area !== "all" && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {area}
                    </span>
                  )}
                  {language && language !== "all" && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {language}
                    </span>
                  )}
                  {availability && availability !== "all" && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {availability}
                    </span>
                  )}
                  <Button 
                    variant="link" 
                    className="text-sm text-primary hover:text-primary/80 mb-2"
                    onClick={resetFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mt-2">
            <p className="text-muted-foreground mb-6">{friends.length} friends found</p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden rounded-xl">
                    <div className="w-full h-52 bg-muted animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted animate-pulse rounded-full w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted animate-pulse rounded-full w-1/2 mb-6"></div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="bg-muted animate-pulse h-6 w-16 rounded-full"></span>
                        <span className="bg-muted animate-pulse h-6 w-20 rounded-full"></span>
                        <span className="bg-muted animate-pulse h-6 w-14 rounded-full"></span>
                      </div>
                      
                      <div className="h-16 bg-muted animate-pulse rounded mb-4"></div>
                    </CardContent>
                    
                    <div className="p-6 pt-0 flex gap-2">
                      <div className="h-10 bg-muted animate-pulse rounded w-full"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : friends.length === 0 ? (
              <div className="bg-card p-12 rounded-xl shadow-sm border border-border/50 text-center">
                <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No friends match your criteria</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map(friend => (
                  <Card key={friend.id} className="overflow-hidden rounded-xl hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                    <div className="relative">
                      <div className="w-full h-52 bg-muted overflow-hidden">
                        <img 
                          src={friend.image} 
                          alt={friend.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                        <div className="text-white">
                          <div className="flex items-center">
                            <div className="flex">
                              {Array.from({ length: Math.floor(friend.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              ))}
                              {friend.rating % 1 > 0 && (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              )}
                            </div>
                            <span className="ml-2 font-semibold">{friend.rating}</span>
                            <span className="ml-1 opacity-80">({friend.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <div className="bg-secondary/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                          Peer Support
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{friend.title}</p>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {friend.areas.slice(0, 3).map(area => (
                            <span 
                              key={area} 
                              className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                          {friend.areas.length > 3 && (
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                              +{friend.areas.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="line-clamp-2">{friend.about}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-secondary" />
                          <span>{friend.yearsExperience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-secondary" />
                          <span>Peer Support</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          <span className="text-secondary font-medium">{friend.nextAvailable}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-4 w-4 text-secondary" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 flex gap-2 border-t border-border/50">
                      <Button 
                        asChild
                        variant="default" 
                        className="flex-1 bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                      >
                        <Link to={`/friends/${friend.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="flex-1"
                      >
                        <Link to={`/friends/${friend.id}/chat`}>
                          Start Chat
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
      
      {/* Help Finding Section */}
      <section className="bg-muted/50 py-20 mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-card to-background rounded-2xl p-12 shadow-sm max-w-3xl mx-auto text-center border border-border/50">
            <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Want to Become a Friend?</h2>
            <p className="text-muted-foreground mb-6">
              Share your experiences and help others navigate similar challenges. Join our community of peer supporters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-secondary to-accent hover:opacity-90">
                <Link to="/for-friends">Learn More</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/auth/register?role=friend">Sign Up as Friend</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FriendListing;
