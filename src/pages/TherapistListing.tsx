
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Calendar, MapPin, Filter, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Therapist {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  bio: string;
  specialization: string;
  years_experience: number;
  hourly_rate: number;
  rating: number;
  therapy_approaches: string;
  languages: string;
  session_formats: string;
  has_insurance: boolean;
}

const TherapistListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sessionFormat, setSessionFormat] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch verified therapists only
  const { data: therapists = [], isLoading: therapistsLoading } = useQuery({
    queryKey: ['verified-therapists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          profile_image_url,
          therapists (
            bio,
            specialization,
            years_experience,
            hourly_rate,
            rating
          ),
          therapist_details (
            therapy_approaches,
            languages,
            session_formats,
            has_insurance,
            application_status
          )
        `)
        .eq('role', 'therapist')
        .not('therapists', 'is', null)
        .not('therapist_details', 'is', null);

      if (error) throw error;

      // Filter only verified therapists
      return data
        .filter(profile => {
          const therapistDetail = Array.isArray(profile.therapist_details) 
            ? profile.therapist_details[0] 
            : profile.therapist_details;
          return therapistDetail?.application_status === 'approved';
        })
        .map(profile => {
          const therapist = Array.isArray(profile.therapists) 
            ? profile.therapists[0] 
            : profile.therapists;
          const therapistDetail = Array.isArray(profile.therapist_details) 
            ? profile.therapist_details[0] 
            : profile.therapist_details;
          
          return {
            id: profile.id,
            full_name: profile.full_name || 'Dr. Anonymous',
            profile_image_url: profile.profile_image_url,
            bio: therapist?.bio || '',
            specialization: therapist?.specialization || '',
            years_experience: therapist?.years_experience || 0,
            hourly_rate: therapist?.hourly_rate || 0,
            rating: therapist?.rating || 5,
            therapy_approaches: therapistDetail?.therapy_approaches || '',
            languages: therapistDetail?.languages || '',
            session_formats: therapistDetail?.session_formats || '',
            has_insurance: therapistDetail?.has_insurance || false,
          };
        }) as Therapist[];
    }
  });

  // Get unique specializations for filtering
  const allSpecializations = Array.from(
    new Set(
      therapists
        .map(therapist => therapist.specialization.split(','))
        .flat()
        .map(spec => spec.trim())
        .filter(Boolean)
    )
  ).sort();

  // Filter therapists based on search and filters
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = !searchQuery || 
      therapist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization = !specializationFilter || 
      therapist.specialization.toLowerCase().includes(specializationFilter.toLowerCase());

    const matchesPriceRange = !priceRange || (() => {
      const rate = therapist.hourly_rate;
      switch (priceRange) {
        case 'under-50': return rate < 50;
        case '50-100': return rate >= 50 && rate <= 100;
        case '100-150': return rate >= 100 && rate <= 150;
        case 'over-150': return rate > 150;
        case 'free': return rate === 0;
        default: return true;
      }
    })();

    const matchesSessionFormat = !sessionFormat || 
      therapist.session_formats.toLowerCase().includes(sessionFormat.toLowerCase());

    return matchesSearch && matchesSpecialization && matchesPriceRange && matchesSessionFormat;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full animation-fade-in">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">Professional Therapy</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Therapist</h1>
            <p className="text-lg opacity-90">
              Connect with licensed, verified mental health professionals who understand your unique needs and can guide you on your healing journey.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          {/* Search and Filters */}
          <div className="bg-card rounded-xl shadow-sm border border-border/50">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialization, or approach"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    {allSpecializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Prices</SelectItem>
                    <SelectItem value="free">Free (Community)</SelectItem>
                    <SelectItem value="under-50">Under $50/hr</SelectItem>
                    <SelectItem value="50-100">$50-100/hr</SelectItem>
                    <SelectItem value="100-150">$100-150/hr</SelectItem>
                    <SelectItem value="over-150">Over $150/hr</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sessionFormat} onValueChange={setSessionFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Session Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Formats</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="chat">Text Chat</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-2">
            <p className="text-muted-foreground mb-6">{filteredTherapists.length} verified therapists available</p>
            
            {therapistsLoading || isLoading ? (
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
            ) : filteredTherapists.length === 0 ? (
              <div className="bg-card p-12 rounded-xl shadow-sm border border-border/50 text-center">
                <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No therapists match your criteria</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or browse all available therapists.</p>
                <Button onClick={() => { setSearchQuery(""); setSpecializationFilter(""); setPriceRange(""); setSessionFormat(""); }}>Show All Therapists</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.map(therapist => (
                  <Card key={therapist.id} className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                    <div className="relative">
                      <div className="w-full h-52 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        {therapist.profile_image_url ? (
                          <img 
                            src={therapist.profile_image_url} 
                            alt={therapist.full_name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <User className="h-20 w-20 text-muted-foreground" />
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {therapist.rating}
                        </div>
                      </div>
                      {therapist.hourly_rate === 0 && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                            Community
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">{therapist.full_name}</h3>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {therapist.specialization.split(',').slice(0, 3).map((spec, index) => (
                            <span 
                              key={index} 
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                            >
                              {spec.trim()}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {therapist.years_experience} years experience
                        </p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="line-clamp-3">{therapist.bio}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{therapist.session_formats}</span>
                        </div>
                        <div className="font-medium text-primary">
                          {therapist.hourly_rate === 0 ? 'Free' : `$${therapist.hourly_rate}/hr`}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 border-t border-border/50">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        asChild
                      >
                        <Link to={`/therapist/${therapist.id}`}>
                          <Calendar className="h-4 w-4 mr-2" />
                          View Profile & Book
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

export default TherapistListing;
