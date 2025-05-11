
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Calendar, MessageCircle, Video } from "lucide-react";
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

  // All unique specialties from the mock data
  const allSpecialties = Array.from(
    new Set(mockTherapists.flatMap(therapist => therapist.specialties))
  ).sort();

  // All unique languages from the mock data
  const allLanguages = Array.from(
    new Set(mockTherapists.flatMap(therapist => therapist.languages))
  ).sort();

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
    
    if (specialty) {
      filtered = filtered.filter(
        therapist => therapist.specialties.includes(specialty)
      );
    }
    
    if (language) {
      filtered = filtered.filter(
        therapist => therapist.languages.includes(language)
      );
    }
    
    if (availability) {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Therapist</h1>
          <p className="text-gray-600 md:text-lg">
            Browse our network of licensed therapists and find the perfect match for your needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or specialty"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
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
                <SelectItem value="">All Languages</SelectItem>
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
                <SelectItem value="">Any Availability</SelectItem>
                <SelectItem value="Today">Available Today</SelectItem>
                <SelectItem value="This Week">Available This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Applied filters */}
          {(searchQuery || specialty || language || availability) && (
            <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              {searchQuery && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  Search: {searchQuery}
                </span>
              )}
              {specialty && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  {specialty}
                </span>
              )}
              {language && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  {language}
                </span>
              )}
              {availability && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  {availability}
                </span>
              )}
              <Button 
                variant="link" 
                className="text-sm text-thera-600 hover:text-thera-700"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-2">
          <p className="text-gray-600 mb-4">{therapists.length} therapists found</p>
          
          {therapists.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-xl font-medium mb-2">No therapists match your criteria</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map(therapist => (
                <Card key={therapist.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src={therapist.image} 
                          alt={therapist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white">
                          <h3 className="text-lg font-bold">{therapist.name}</h3>
                          <p className="text-sm opacity-90">{therapist.title}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {Array.from({ length: Math.floor(therapist.rating) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                        {therapist.rating % 1 > 0 && (
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <span className="text-sm font-medium ml-1">{therapist.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({therapist.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {therapist.specialties.slice(0, 3).map(specialty => (
                          <span 
                            key={specialty} 
                            className="bg-thera-50 text-thera-700 text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {therapist.specialties.length > 3 && (
                          <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-full">
                            +{therapist.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p>{therapist.about.substring(0, 100)}...</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <p className="font-medium">{therapist.yearsExperience} years</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Languages:</span>
                        <p className="font-medium">{therapist.languages.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Next available:</span>
                        <p className="font-medium text-mint-600">{therapist.nextAvailable}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Session fee:</span>
                        <p className="font-medium">${therapist.price}/session</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      asChild
                      variant="default" 
                      className="flex-1 bg-thera-600 hover:bg-thera-700"
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
  );
};

export default TherapistListing;
