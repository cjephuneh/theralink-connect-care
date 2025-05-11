import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  concernType: z.enum(["anxiety", "depression", "relationship", "trauma", "stress", "other"], {
    required_error: "Please select a primary concern.",
  }),
  therapistGender: z.enum(["any", "male", "female"], {
    required_error: "Please select your preference.",
  }),
  experienceLevel: z.number().min(0).max(5),
  preferences: z.array(z.string()).optional(),
});

const concerns = [
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "relationship", label: "Relationship Issues" },
  { value: "trauma", label: "Trauma & PTSD" },
  { value: "stress", label: "Stress Management" },
  { value: "other", label: "Other Concerns" },
];

const preferenceOptions = [
  { id: "cbt", label: "Cognitive-Behavioral Therapy (CBT)" },
  { id: "mindfulness", label: "Mindfulness-Based Therapy" },
  { id: "psychodynamic", label: "Psychodynamic Therapy" },
  { id: "humanistic", label: "Humanistic Approach" },
  { id: "remote", label: "Remote Sessions Available" },
];

const AIMatchingPage = () => {
  const [isMatching, setIsMatching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concernType: "anxiety",
      therapistGender: "any",
      experienceLevel: 2,
      preferences: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsMatching(true);
    
    try {
      // In a real application, we would send this data to a backend or make a direct query
      // Here, we'll simulate AI matching with a delay and query the therapists table
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const experienceThreshold = values.experienceLevel;
      const specialization = values.concernType !== "other" ? values.concernType : undefined;
      
      // Fixed query to avoid the foreign key relationship error
      let query = supabase
        .from('therapists')
        .select(`
          id, 
          years_experience, 
          specialization, 
          hourly_rate,
          rating
        `)
        .gte('years_experience', experienceThreshold);
        
      if (specialization) {
        query = query.ilike('specialization', `%${specialization}%`);
      }
      
      const { data: therapists, error } = await query.limit(3);
      
      if (error) throw error;
      
      if (therapists && therapists.length > 0) {
        // Now fetch profile information separately for each therapist
        const therapistsWithProfiles = await Promise.all(
          therapists.map(async (therapist) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, profile_image_url')
              .eq('id', therapist.id)
              .single();
              
            return {
              ...therapist,
              profile: profileData
            };
          })
        );
        
        // Store matched therapists in session storage for display on results page
        sessionStorage.setItem('matchedTherapists', JSON.stringify(therapistsWithProfiles));
        navigate('/ai-matching/results');
        
        toast({
          title: "Match Found!",
          description: `We've found ${therapistsWithProfiles.length} therapists that match your preferences.`,
        });
      } else {
        toast({
          title: "No Matches Found",
          description: "We couldn't find therapists matching your criteria. Please try with different preferences.",
          variant: "destructive",
        });
        setIsMatching(false);
      }
    } catch (error) {
      console.error('Error finding therapists:', error);
      toast({
        title: "Matching Error",
        description: "An error occurred while finding your match. Please try again.",
        variant: "destructive",
      });
      setIsMatching(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
          Find Your Perfect Therapist Match
        </h1>
        <p className="text-lg text-gray-600">
          Answer a few questions and our AI will match you with the right therapist for your needs
        </p>
      </div>
      
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-thera-50 to-thera-100 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-thera-600" />
            <CardTitle>AI Therapist Matching</CardTitle>
          </div>
          <CardDescription>
            Our algorithm analyzes your preferences to find your ideal therapist match
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="concernType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>What's your primary concern?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {concerns.map((item) => (
                          <FormItem key={item.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="therapistGender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have a preference for therapist gender?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="any" />
                          </FormControl>
                          <FormLabel className="font-normal">No Preference</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred years of experience (minimum)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>0 years</span>
                          <span>1 year</span>
                          <span>2 years</span>
                          <span>3 years</span>
                          <span>4 years</span>
                          <span>5+ years</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Selected: {field.value === 5 ? '5+' : field.value} year{field.value !== 1 ? 's' : ''} minimum
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferences"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Therapy Preferences</FormLabel>
                      <FormDescription>
                        Select the approaches or preferences you're interested in
                      </FormDescription>
                    </div>
                    {preferenceOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="preferences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-thera-600 hover:bg-thera-700" 
                disabled={isMatching}
              >
                {isMatching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding your match...
                  </>
                ) : (
                  <>
                    Find My Therapist Match
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMatchingPage;
