
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Languages, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface TherapistCardProps {
  therapist: {
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
  };
  featured?: boolean;
}

const TherapistCard = ({ therapist, featured = false }: TherapistCardProps) => {
  return (
    <Card 
      className={`overflow-hidden rounded-xl hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-1 group border border-border/50 h-full ${
        featured ? "bg-gradient-to-br from-primary/5 to-secondary/5" : ""
      }`}
    >
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
        
        {featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-3 py-1 rounded-full">
              Featured
            </div>
          </div>
        )}
        
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
      
      <CardFooter className="p-6 pt-0 flex gap-2 border-t border-border/50 mt-auto">
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
  );
};

export default TherapistCard;
