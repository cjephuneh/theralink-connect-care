
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Star, MapPin, Clock, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClientTherapists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Mock therapist data
  const therapists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Anxiety & Depression",
      rating: 4.8,
      reviews: 124,
      hourlyRate: 120,
      location: "New York, NY",
      availability: "Available Today",
      bio: "Specialized in cognitive behavioral therapy with 8 years of experience.",
      image: null,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Relationship Counseling",
      rating: 4.9,
      reviews: 89,
      hourlyRate: 150,
      location: "Los Angeles, CA",
      availability: "Available Tomorrow",
      bio: "Expert in couples therapy and family counseling.",
      image: null,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Trauma Therapy",
      rating: 4.7,
      reviews: 156,
      hourlyRate: 140,
      location: "Chicago, IL",
      availability: "Available This Week",
      bio: "EMDR certified therapist specializing in trauma recovery.",
      image: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Therapists</h1>
        <p className="text-muted-foreground mt-2">
          Discover qualified therapists that match your needs and preferences.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search therapists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anxiety">Anxiety & Depression</SelectItem>
                <SelectItem value="relationships">Relationship Counseling</SelectItem>
                <SelectItem value="trauma">Trauma Therapy</SelectItem>
                <SelectItem value="addiction">Addiction Recovery</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Therapist List */}
      <div className="grid gap-6">
        {therapists.map((therapist) => (
          <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-lg">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{therapist.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {therapist.specialization}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${therapist.hourlyRate}</p>
                      <p className="text-sm text-muted-foreground">per session</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{therapist.bio}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{therapist.rating}</span>
                      <span className="text-muted-foreground">({therapist.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{therapist.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="h-4 w-4" />
                      <span>{therapist.availability}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                    <Button className="flex-1">
                      Book Session
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientTherapists;
