
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Calendar, MessageCircle, Video, Filter, MapPin, Languages, CheckCircle, Shield } from "lucide-react";
import { Link } from 'react-router-dom';

// Mock therapist data (in real app, this would come from a backend API)
const mockTherapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Anxiety", "Depression", "Trauma", "PTSD"],
    languages: ["English", "Spanish"],
    yearsExperience: 8,
    nextAvailable: "Tomorrow",
    price: 85,
    about: "I help clients navigate life's challenges with evidence-based approaches including CBT and mindfulness techniques."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Licensed Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.8,
    reviewCount: 93,
    specialties: ["Relationships", "Couples Therapy", "Family Conflict"],
    languages: ["English", "Mandarin"],
    yearsExperience: 12,
    nextAvailable: "Today",
    price: 95,
    about: "I specialize in helping couples and families improve communication and resolve conflicts."
  },
  {
    id: 3,
    name: "Dr. Amara Okafor",
    title: "Clinical Social Worker",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 5.0,
    reviewCount: 78,
    specialties: ["Depression", "Grief", "Life Transitions", "Identity"],
    languages: ["English"],
    yearsExperience: 5,
    nextAvailable: "In 2 days",
    price: 75,
    about: "I create a warm and inclusive space for clients to process grief and navigate major life transitions."
  },
  {
    id: 4,
    name: "Dr. Robert Garcia",
    title: "Licensed Mental Health Counselor",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.7,
    reviewCount: 104,
    specialties: ["Anxiety", "Stress", "Work-Life Balance", "Men's Issues"],
    languages: ["English", "Portuguese"],
    yearsExperience: 7,
    nextAvailable: "Today",
    price: 90,
    about: "I help professionals manage stress and anxiety while achieving better work-life balance."
  },
  {
    id: 5,
    name: "Dr. Jasmine Patel",
    title: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    reviewCount: 86,
    specialties: ["Anxiety", "Cultural Issues", "Self-Esteem", "Relationships"],
    languages: ["English", "Hindi", "Gujarati"],
    yearsExperience: 9,
    nextAvailable: "Tomorrow",
    price: 95,
    about: "I blend Eastern and Western therapeutic approaches to help clients find balance and meaning in their lives."
  },
  {
    id: 6,
    name: "Dr. William Taylor",
    title: "Licensed Professional Counselor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.6,
    reviewCount: 72,
    specialties: ["Substance Use", "Addiction", "Recovery", "Depression"],
    languages: ["English"],
    yearsExperience: 15,
    nextAvailable: "In 3 days",
    price: 85,
    about: "I support individuals on their journey to recovery and building healthier relationships with themselves and others."
  },
];

// Interface for therapist data
interface Therapist {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  yearsExperience: number;
  nextAvailable: string;
  price: number;
  about: string;
}

const TherapistListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // All unique specialties from the mock data
  const allSpecialties = Array.from(
    new Set(mockTherapists.flatMap(therapist => therapist.specialties))
  ).sort();

  // All unique languages from the mock data
  const allLanguages = Array.from(
    new Set(mockTherapists.flatMap(therapist => therapist.languages))
  ).sort();

  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter therapists based on search and filters
  useEffect(() => {
    let filtered = [...mockTherapists];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        therapist => 
          therapist.name.toLowerCase().includes(query) || 
          therapist.about.toLowerCase().includes(query) ||
          therapist.specialties.some(specialty => 
            specialty.toLowerCase().includes(query)
          )
      );
    }
    
    if (specialty && specialty !== "all") {
      filtered = filtered.filter(
        therapist => therapist.specialties.includes(specialty)
      );
    }
    
    if (language && language !== "all") {
      filtered = filtered.filter(
        therapist => therapist.languages.includes(language)
      );
    }
    
    if (availability && availability !== "all") {
      if (availability === "Today") {
        filtered = filtered.filter(
          therapist => therapist.nextAvailable === "Today"
        );
      } else if (availability === "This Week") {
        filtered = filtered.filter(
          therapist => ["Today", "Tomorrow", "In 2 days", "In 3 days"].includes(therapist.nextAvailable)
        );
      }
    }
    
    setTherapists(filtered);
  }, [searchQuery, specialty, language, availability]);

  const resetFilters = () => {
    setSearchQuery("");
    setSpecialty("");
    setLanguage("");
    setAvailability("");
  };

  return (
    <div className="w-full animation-fade-in">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 inline-block">Find Your Match</span>
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
                      <SelectItem value="all">All Specialties</SelectItem>
                      {allSpecialties.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
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
              {(searchQuery || specialty || language || availability) && (
                <div className="flex flex-wrap items-center mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                  {searchQuery && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      Search: {searchQuery}
                    </span>
                  )}
                  {specialty && specialty !== "all" && (
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mr-2 mb-2">
                      {specialty}
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
            <p className="text-muted-foreground mb-6">{therapists.length} therapists found</p>
            
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
                {therapists.map(therapist => (
                  <Card key={therapist.id} className="overflow-hidden rounded-xl hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-1 group border border-border/50">
                    <div className="relative">
                      <div className="w-full h-52 bg-muted overflow-hidden">
                        <img 
                          src={therapist.image} 
                          alt={therapist.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                        <div className="text-white">
                          <div className="flex items-center">
                            <div className="flex">
                              {Array.from({ length: Math.floor(therapist.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              ))}
                              {therapist.rating % 1 > 0 && (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              )}
                            </div>
                            <span className="ml-2 font-semibold">{therapist.rating}</span>
                            <span className="ml-1 opacity-80">({therapist.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-3 py-1 rounded-full">
                          ${therapist.price}/session
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold">{therapist.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{therapist.title}</p>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {therapist.specialties.slice(0, 3).map(specialty => (
                            <span 
                              key={specialty} 
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {therapist.specialties.length > 3 && (
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                              +{therapist.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="line-clamp-2">{therapist.about}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          <span>{therapist.yearsExperience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Languages className="h-4 w-4 text-secondary" />
                          <span>{therapist.languages.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span className="text-primary font-medium">{therapist.nextAvailable}</span>
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
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <Link to={`/therapists/${therapist.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="flex-1"
                      >
                        <Link to={`/therapists/${therapist.id}/book`}>
                          Book Session
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
