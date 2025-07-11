import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Calendar, MessageCircle, Video, Filter, Shield, Sparkles, CheckCircle, Languages } from "lucide-react";
import { Link } from 'react-router-dom';
// Simple interface to avoid infinite recursion
interface SimpleTherapist {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  email: string;
  bio: string | null;
  specialization: string;
  hourly_rate: number;
  rating: number;
  years_experience: number;
  languages: string[];
  therapy_approaches: string[];
  availability: any;
  is_community_therapist: boolean;
  preferred_currency: string;
}

const TherapistListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [language, setLanguage] = useState("");
  const [therapists, setTherapists] = useState<SimpleTherapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('therapists')
          .select(`
            *,
            profiles!therapists_id_fkey (
              id,
              full_name,
              email,
              profile_image_url,
              location
            )
          `)
          .eq('is_verified', true);


        if (error) throw error;

        const formattedTherapists: SimpleTherapist[] = (data || []).map((therapist: any) => ({
          id: therapist.id,
          full_name: therapist.profiles?.full_name || 'Unknown',
          profile_image_url: therapist.profiles?.profile_image_url,
          email: therapist.profiles?.email || '',
          bio: therapist.bio || '',
          specialization: therapist.specialization || 'General Therapy',
          hourly_rate: therapist.hourly_rate || 0,
          rating: therapist.rating || 0,
          years_experience: therapist.years_experience || 0,
          languages: therapist.languages || ['English'],
          therapy_approaches: therapist.therapy_approaches || [],
          availability: therapist.availability,
          is_community_therapist: therapist.is_community_therapist || false,
          preferred_currency: therapist.preferred_currency || 'USD',
        }));

        setTherapists(formattedTherapists);
      } catch (error) {
        console.error('Error fetching therapists:', error);
        toast({
          title: "Error loading therapists",
          description: "Could not fetch therapist data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchTherapists();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, specialty, language, filterType, toast]);

  // Get unique specialties and languages for filters
  const allSpecialties = Array.from(
    new Set(therapists.flatMap(therapist => 
      therapist.therapy_approaches || []
    ))
  ).filter(Boolean)
   .sort((a, b) => a.localeCompare(b));

  const allLanguages = Array.from(
    new Set(therapists.flatMap(therapist => therapist.languages || []))
  ).filter(Boolean)
   .sort((a, b) => a.localeCompare(b));

  const resetFilters = () => {
    setSearchQuery("");
    setSpecialty("");
    setLanguage("");
    setFilterType("all");
  };

  const getNextAvailable = (availability: any) => {
    // Parse availability from JSONB if it exists
    if (!availability) return "Available soon";
    
    try {
      const availabilityData = typeof availability === 'string' ? JSON.parse(availability) : availability;
      if (!Array.isArray(availabilityData) || availabilityData.length === 0) return "Available soon";
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      const nextDate = availabilityData
        .map(a => a.date)
        .sort()
        .find(date => date >= todayStr);
      
      if (!nextDate) return "Available soon";
      
      const diffDays = Math.floor(
        (new Date(nextDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      return `In ${diffDays} days`;
    } catch (error) {
      return "Available soon";
    }
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">
              Find Your Match
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Ideal Therapist</h1>
            <p className="text-lg opacity-90">
              Browse our network of experienced, licensed therapists and find the perfect match for your needs.
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
                    placeholder="Search by name, specialty or keyword"
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
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSpecialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="community">Community Therapists</SelectItem>
                      <SelectItem value="paid">Paid Therapists</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Applied filters */}
              {(searchQuery || specialty || language || filterType !== 'all') && (
                <div className="flex flex-wrap items-center mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                  {searchQuery && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      Search: {searchQuery}
                    </span>
                  )}
                  {specialty && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {specialty}
                    </span>
                  )}
                  {language && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {language}
                    </span>
                  )}
                  {filterType !== 'all' && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {filterType === 'community' ? 'Community Therapist' : 'Paid Therapist'}
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
            <p className="text-muted-foreground mb-6">
              {isLoading ? 'Loading...' : `${therapists.length} therapists found`}
            </p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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
            ) : therapists.length === 0 ? (
              <div className="bg-card p-12 rounded-xl shadow-sm border border-border/50 text-center">
                <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No therapists match your criteria</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapists.map(therapist => {
                  const nextAvailable = getNextAvailable(therapist.availability);
                  const approaches = therapist.therapy_approaches || [];
                  
                  return (
                    <Card key={therapist.id} className="overflow-hidden rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                      <div className="relative">
                        <div className="w-full h-52 bg-muted overflow-hidden">
                          {therapist.profile_image_url ? (
                            <img 
                              src={therapist.profile_image_url} 
                              alt={therapist.full_name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Therapist';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                              {therapist.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                          <div className="text-white">
                            <div className="flex items-center">
                              <div className="flex">
                                {Array.from({ length: Math.floor(therapist.rating) }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                ))}
                                {therapist.rating % 1 > 0 && (
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400/50" />
                                )}
                              </div>
                              <span className="ml-2 font-semibold">{therapist.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {therapist.is_community_therapist ? (
                          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Community Therapist
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-3 py-1 rounded-full">
                            {therapist.preferred_currency} {therapist.hourly_rate}
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold">{therapist.full_name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{therapist.specialization}</p>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {approaches.slice(0, 3).map(approach => (
                              <span 
                                key={approach} 
                                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                              >
                                {approach}
                              </span>
                            ))}
                            {approaches.length > 3 && (
                              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                                +{approaches.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-4">
                          <p className="line-clamp-2">{therapist.bio}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-secondary" />
                            <span>{therapist.years_experience} years exp.</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Languages className="h-4 w-4 text-secondary" />
                            <span>{therapist.languages.join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-secondary" />
                            <span className="text-primary font-medium">{nextAvailable}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-secondary" />
                            <span>Verified</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0 flex gap-2 border-t border-border/50">
                        <Link to={`/therapists/${therapist.id}`}>
                          <Button variant="default" className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                            View Profile
                          </Button>
                        </Link>
                        <Link to={`/therapists/${therapist.id}/book`}>
                          <Button variant="outline" className="flex-1">
                            Book Session
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Help Finding Section */}
      <section className="bg-muted/50 py-20 mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-card to-background rounded-2xl p-12 shadow-sm max-w-3xl mx-auto text-center border border-border/50">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Need Help Finding the Right Therapist?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI-powered matching system can help you find the perfect therapist based on your needs, preferences, and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/therapist-match">Use AI Matching</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TherapistListing;