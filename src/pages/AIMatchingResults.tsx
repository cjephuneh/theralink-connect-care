
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Loader2, Star, Award, Clock, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Therapist {
  id: string;
  years_experience: number;
  specialization: string;
  hourly_rate: number;
  rating: number;
  profiles: {
    full_name: string;
    profile_image_url: string;
  };
}

const AIMatchingResults = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedResults = sessionStorage.getItem('matchedTherapists');
    
    if (!storedResults) {
      toast({
        title: "No Results Found",
        description: "Please complete the matching questionnaire first.",
        variant: "destructive",
      });
      navigate('/ai-matching');
      return;
    }
    
    try {
      const parsedResults = JSON.parse(storedResults);
      setTherapists(parsedResults);
    } catch (error) {
      console.error('Error parsing therapist data:', error);
      toast({
        title: "Error",
        description: "There was an error loading your matches.",
        variant: "destructive",
      });
      navigate('/ai-matching');
    }
    
    setLoading(false);
  }, [navigate, toast]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getMatchPercentage = (therapist: Therapist) => {
    // This would normally use a complex algorithm with user preferences
    // For demo purposes, we'll generate a random high percentage
    return Math.floor(Math.random() * 15) + 85; // 85-99%
  };

  const getTherapyMethods = (specialization: string) => {
    const methods = [
      'Cognitive-Behavioral',
      'Mindfulness',
      'Psychodynamic',
      'Humanistic',
      'Solution-Focused',
      'EMDR'
    ];
    
    // Generate 2-3 random methods
    const count = Math.floor(Math.random() * 2) + 2;
    const shuffled = methods.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-thera-600" />
        <p className="mt-4 text-muted-foreground">Loading your therapist matches...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="h-6 w-6 text-thera-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Your Perfect Matches</h1>
        </div>
        <p className="text-lg text-gray-600">
          Based on your preferences, we've found these therapists that would be a great fit for you
        </p>
      </div>
      
      <div className="space-y-8">
        {therapists.length > 0 ? (
          therapists.map((therapist, index) => {
            const matchPercent = getMatchPercentage(therapist);
            const therapyMethods = getTherapyMethods(therapist.specialization);
            
            return (
              <Card key={therapist.id} className="overflow-hidden border-0 shadow-lg">
                <div className={`absolute top-0 right-0 w-24 h-24 ${index === 0 ? 'bg-yellow-400' : 'bg-thera-200'}`}>
                  <div className="absolute transform rotate-45 translate-y-12 -translate-x-6 w-36 text-center py-1 font-semibold text-white">
                    {index === 0 ? 'Best Match' : `Match #${index + 1}`}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-thera-50 to-thera-100">
                    <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                      <AvatarImage src={therapist.profiles.profile_image_url} />
                      <AvatarFallback>{getInitials(therapist.profiles.full_name)}</AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-xl font-semibold">{therapist.profiles.full_name}</h3>
                    <div className="mt-1 flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                      <span>{therapist.rating.toFixed(1)}</span>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="text-3xl font-bold text-thera-600">{matchPercent}%</div>
                      <div className="text-sm text-gray-500">Match Score</div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Specializes in:</h4>
                        <p className="text-gray-700 capitalize">{therapist.specialization.replace(',', ', ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Session Fee</div>
                        <div className="font-bold text-gray-900">₦{therapist.hourly_rate.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-thera-500 mr-2" />
                        <span>{therapist.years_experience} years of experience</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-thera-500 mr-2" />
                        <span>Available for online & in-person sessions</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-5 w-5 text-thera-500 mr-2" />
                        <span>Approach: {therapyMethods.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Online Sessions', 'Evening Hours', 'Weekend Availability'].map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-thera-50 text-thera-700 border-thera-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <Button 
                        onClick={() => navigate(`/therapists/${therapist.id}`)} 
                        className="flex-1"
                      >
                        View Profile
                      </Button>
                      <Button
                        onClick={() => navigate(`/therapists/${therapist.id}/book`)} 
                        className="flex-1 bg-thera-600 hover:bg-thera-700"
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No matches found. Please try the questionnaire again with different preferences.</p>
            <Button 
              onClick={() => navigate('/ai-matching')} 
              className="mt-4"
            >
              Try Again
            </Button>
          </Card>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/ai-matching')}
          className="mr-4"
        >
          Start Over
        </Button>
        <Button 
          onClick={() => navigate('/therapists')} 
        >
          Browse All Therapists
        </Button>
      </div>
    </div>
  );
};

export default AIMatchingResults;
