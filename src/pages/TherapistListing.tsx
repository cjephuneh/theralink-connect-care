
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Calendar, MessageCircle, MapPin, Filter, User } from "lucide-react";
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
  session_formats: string;
  therapy_approaches: string;
  languages: string;
  has_insurance: boolean;
}

// Hardcoded therapists data as fallback
const hardcodedTherapists: Therapist[] = [
  {
    id: "1",
    full_name: "Dr. Sarah Mitchell",
    profile_image_url: null,
    bio: "Licensed clinical psychologist specializing in anxiety and depression with over 10 years of experience.",
    specialization: "Anxiety & Depression",
    years_experience: 10,
    hourly_rate: 150,
    rating: 4.9,
    session_formats: "Video, In-person",
    therapy_approaches: "CBT, Mindfulness",
    languages: "English, Spanish",
    has_insurance: true
  },
  {
    id: "2",
    full_name: "Dr. Michael Johnson",
    profile_image_url: null,
    bio: "Specializing in trauma therapy and PTSD treatment using evidence-based approaches.",
    specialization: "Trauma & PTSD",
    years_experience: 15,
    hourly_rate: 180,
    rating: 4.8,
    session_formats: "Video, In-person",
    therapy_approaches: "EMDR, Trauma-Focused CBT",
    languages: "English",
    has_insurance: true
  },
  {
    id: "3",
    full_name: "Dr. Emily Chen",
    profile_image_url: null,
    bio: "Couples and family therapist helping relationships thrive through effective communication.",
    specialization: "Couples & Family Therapy",
    years_experience: 8,
    hourly_rate: 120,
    rating: 4.7,
    session_formats: "Video, In-person",
    therapy_approaches: "Gottman Method, EFT",
    languages: "English, Mandarin",
    has_insurance: false
  },
  {
    id: "4",
    full_name: "Dr. David Brown",
    profile_image_url: null,
    bio: "Addiction counselor and psychiatrist specializing in substance abuse recovery.",
    specialization: "Addiction & Substance Abuse",
    years_experience: 12,
    hourly_rate: 200,
    rating: 4.6,
    session_formats: "Video, In-person, Phone",
    therapy_approaches: "Motivational Interviewing, CBT",
    languages: "English",
    has_insurance: true
  },
  {
    id: "5",
    full_name: "Dr. Lisa Rodriguez",
    profile_image_url: null,
    bio: "Child and adolescent psychologist helping young people navigate life's challenges.",
    specialization: "Child & Adolescent Therapy",
    years_experience: 9,
    hourly_rate: 140,
    rating: 4.8,
    session_formats: "Video, In-person",
    therapy_approaches: "Play Therapy, CBT",
    languages: "English, Spanish",
    has_insurance: true
  },
  {
    id: "6",
    full_name: "Dr. Robert Kim",
    profile_image_url: null,
    bio: "Clinical psychologist specializing in OCD and anxiety disorders with specialized training.",
    specialization: "OCD & Anxiety Disorders",
    years_experience: 11,
    hourly_rate: 160,
    rating: 4.9,
    session_formats: "Video, In-person",
    therapy_approaches: "ERP, ACT, CBT",
    languages: "English, Korean",
    has_insurance: true
  }
];

const TherapistListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all");
  const [maxRate, setMaxRate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Try to fetch approved therapists, but use hardcoded data as fallback
  const { data: therapists = hardcodedTherapists, isLoading: therapistsLoading } = useQuery({
    queryKey: ['approved-therapists'],
    queryFn: async () => {
      try {
        // Try to fetch from database first
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'therapist');

        if (error) {
          console.log('Database query failed, using hardcoded data:', error);
          return hardcodedTherapists;
        }

        if (!data || data.length === 0) {
          console.log('No therapists found in database, using hardcoded data');
          return hardcodedTherapists;
        }

        // If we have database data, transform it to match our interface
        return data.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'Dr. Anonymous',
          profile_image_url: profile.profile_image_url,
          bio: 'Licensed therapist ready to help',
          specialization: 'General Therapy',
          years_experience: 5,
          hourly_rate: 120,
          rating: 4.5,
          session_formats: 'Video, In-person',
          therapy_approaches: 'CBT, Humanistic',
          languages: 'English',
          has_insurance: true,
        })) as Therapist[];
      } catch (error) {
        console.log('Error fetching therapists, using hardcoded data:', error);
        return hardcodedTherapists;
      }
    }
  });

  // Get unique specializations for filtering
  const allSpecializations = Array.from(
    new Set(
      therapists
        .map(therapist => therapist.specialization)
        .filter(Boolean)
    )
  ).sort();

  // Get unique session types for filtering
  const allSessionTypes = Array.from(
    new Set(
      therapists
        .map(therapist => therapist.session_formats.split(','))
        .flat()
        .map(format => format.trim())
        .filter(Boolean)
    )
  ).sort();

  // Filter therapists based on search and filters
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = !searchQuery || 
      therapist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization = specializationFilter === "all" || 
      therapist.specialization.toLowerCase().includes(specializationFilter.toLowerCase());

    const matchesSessionType = sessionTypeFilter === "all" || 
      therapist.session_formats.toLowerCase().includes(sessionTypeFilter.toLowerCase());

    const matchesRate = !maxRate || therapist.hourly_rate <= parseFloat(maxRate);

    return matchesSearch && matchesSpecialization && matchesSessionType && matchesRate;
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
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">Professional Care</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Therapist</h1>
            <p className="text-lg opacity-90">
              Connect with licensed, verified therapists who specialize in your specific needs and offer personalized care.
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
                    placeholder="Search by name, specialization, or bio"
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
                    <SelectItem value="all">All Specializations</SelectItem>
                    {allSpecializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Session Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Session Types</SelectItem>
                    {allSessionTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <Input
                  type="number"
                  placeholder="Max hourly rate (₦)"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-2">
            <p className="text-muted-foreground mb-6">{filteredTherapists.length} therapists available</p>
            
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
                <Button onClick={() => { setSearchQuery(""); setSpecializationFilter("all"); setSessionTypeFilter("all"); setMaxRate(""); }}>
                  Show All Therapists
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.map(therapist => (
                  <Card key={therapist.id} className="overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                    <div className="relative">
                      <div className="w-full h-52 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
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
                          {therapist.rating || 'New'}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">{therapist.full_name}</h3>
                      <p className="text-secondary text-sm font-medium mb-2">{therapist.specialization}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{therapist.years_experience} years experience</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="line-clamp-3">{therapist.bio}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary">
                          ₦{therapist.hourly_rate?.toLocaleString()}/hr
                        </div>
                        {therapist.has_insurance && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Insurance
                          </span>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 border-t border-border/50 flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/therapist/${therapist.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                        asChild
                      >
                        <Link to={`/booking/${therapist.id}`}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
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
