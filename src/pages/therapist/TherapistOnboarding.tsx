import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, DollarSign, Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import AvailabilityPicker from "@/components/profile/AvailabilityPicker";

interface Slot {
  day: string;
  slots: string[];
}

const formSchema = z.object({
  education: z.string().min(10, {
    message: "Education details must be at least 10 characters.",
  }),
  license_number: z.string().min(3, {
    message: "License number is required.",
  }),
  license_type: z.string().min(3, {
    message: "License type is required.",
  }),
  therapy_approaches: z.array(z.string()).min(1, {
    message: "Please select at least one therapy approach.",
  }),
  languages: z.array(z.string()).min(1, {
    message: "Please select at least one language.",
  }),
  session_formats: z.array(z.string()).min(1, {
    message: "Please select at least one session format.",
  }),
  specializations: z.array(z.string()).min(1, {
    message: "Please select at least one specialization.",
  }),
  bio: z.string().min(50, {
    message: "Bio must be at least 50 characters.",
  }),
  hourly_rate: z.number().min(0, {
    message: "Hourly rate must be a positive number.",
  }).optional(),
  therapist_type: z.enum(["paid", "community"], {
    required_error: "Please select therapist type.",
  }),
  preferred_currency: z.string().min(3, {
    message: "Please select your preferred currency.",
  }),
  insurance_info: z.string().optional(),
  has_insurance: z.boolean().default(false),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

const TherapistOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<Slot[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: "",
      license_number: "",
      license_type: "",
      therapy_approaches: [],
      languages: [],
      session_formats: [],
      specializations: [],
      bio: "",
      hourly_rate: undefined,
      therapist_type: "paid",
      preferred_currency: "NGN",
      insurance_info: "",
      has_insurance: false,
      termsAccepted: false,
    },
  });

  const watchTherapistType = form.watch("therapist_type");

  const currencies = [
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "KES", label: "KES - Kenyan Shilling" },
    { value: "GHS", label: "GHS - Ghanaian Cedi" },
    { value: "ZAR", label: "ZAR - South African Rand" },
  ];

  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese (Mandarin)",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Russian",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Polish",
    "Czech",
    "Hungarian",
    "Greek",
    "Turkish",
    "Hebrew",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay",
    "Tagalog",
    "Swahili",
    "Amharic",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Zulu",
    "Afrikaans",
  ];

  const availableSessionFormats = [
    "Individual Therapy",
    "Couples Therapy",
    "Family Therapy",
    "Group Therapy",
    "Online Therapy",
    "In-Person Therapy",
    "Child Therapy",
    "Adolescent Therapy",
    "Adult Therapy",
    "Senior Therapy",
    "Crisis Intervention",
    "EMDR Therapy",
    "Cognitive Behavioral Therapy (CBT)",
    "Dialectical Behavior Therapy (DBT)",
    "Psychodynamic Therapy",
    "Mindfulness-Based Therapy",
    "Art Therapy",
    "Play Therapy",
    "Music Therapy",
    "Sand Tray Therapy",
  ];

  const availableTherapyApproaches = [
    "Cognitive Behavioral Therapy (CBT)",
    "Dialectical Behavior Therapy (DBT)",
    "Acceptance and Commitment Therapy (ACT)",
    "Psychodynamic Therapy",
    "Humanistic Therapy",
    "Solution-Focused Brief Therapy (SFBT)",
    "Mindfulness-Based Cognitive Therapy (MBCT)",
    "Eye Movement Desensitization and Reprocessing (EMDR)",
    "Narrative Therapy",
    "Family Systems Therapy",
    "Gestalt Therapy",
    "Interpersonal Therapy (IPT)",
    "Trauma-Informed Care",
    "Somatic Experiencing",
    "Internal Family Systems (IFS)",
    "Emotionally Focused Therapy (EFT)",
    "Cognitive Processing Therapy (CPT)",
    "Exposure and Response Prevention (ERP)",
    "Motivational Interviewing",
    "Person-Centered Therapy",
    "Psychoanalytic Therapy",
    "Behavioral Activation",
    "Mindfulness-Based Stress Reduction (MBSR)",
    "Art Therapy",
    "Music Therapy",
    "Play Therapy",
    "Sand Tray Therapy",
    "Integrative Approach",
    "Eclectic Approach",
  ];

  const availableSpecializations = [
    "Anxiety Disorders",
    "Depression",
    "Trauma and PTSD",
    "Relationship Issues",
    "Marriage Counseling",
    "Family Therapy",
    "Child Psychology",
    "Adolescent Therapy",
    "Addiction and Substance Abuse",
    "Eating Disorders",
    "Bipolar Disorder",
    "ADHD",
    "Autism Spectrum Disorders",
    "Grief and Loss",
    "Anger Management",
    "Stress Management",
    "Career Counseling",
    "Life Transitions",
    "Self-Esteem Issues",
    "Social Anxiety",
    "Panic Disorders",
    "OCD (Obsessive-Compulsive Disorder)",
    "Phobias",
    "Sleep Disorders",
    "Chronic Pain Management",
    "LGBTQ+ Issues",
    "Cultural and Multicultural Issues",
    "Women's Issues",
    "Men's Issues",
    "Parenting Support",
    "Divorce and Separation",
    "Domestic Violence",
    "Sexual Abuse Recovery",
    "Body Image Issues",
    "Borderline Personality Disorder",
    "Narcissistic Personality Disorder",
    "Workplace Issues",
    "Academic Stress",
    "Retirement Planning",
    "Chronic Illness Coping",
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to complete your profile",
        variant: "destructive",
      });
      return;
    }

    if (availability.length === 0) {
      toast({ title: "Select availability", description: "Please select at least one available slot.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the therapist profile to indicate type and currency
      await supabase
        .from('therapists')
        .upsert({
          id: user.id,
          education: values.education,
          license_number: values.license_number,
          license_type: values.license_type,
          therapy_approaches: values.therapy_approaches,
          languages: values.languages,
          insurance_info: values.insurance_info,
          session_formats: values.session_formats,
          specialization: values.specializations.join(', '),
          bio: values.bio,
          has_insurance: values.has_insurance,
          preferred_currency: values.preferred_currency,
          hourly_rate: values.therapist_type === 'community' ? 0 : values.hourly_rate,
          availability: JSON.parse(JSON.stringify(availability)),
        });

      toast({
        title: "Profile completed",
        description: values.therapist_type === 'community' 
          ? "Your community therapist profile has been submitted for review. Thank you for your generous commitment to helping others!"
          : "Your therapist profile has been submitted for review.",
      });

      navigate('/therapist/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-4 py-6 lg:py-8 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Therapist Profile
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-2">
              Please provide your professional information to help us verify your credentials and match you with the right clients.
            </p>
          </div>

          <div className="px-2 sm:px-0">
            <ProfileImageUpload />
          </div>
          
          <Card className="w-full">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">Professional Information</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fill out all required fields to complete your therapist profile.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 px-4 sm:px-6">
                  {/* Therapist Type Selection */}
                  <FormField
                    control={form.control}
                    name="therapist_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base sm:text-lg font-semibold">Therapist Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4"
                          >
                            <div className="flex items-start space-x-3 border rounded-lg p-3 sm:p-4 hover:bg-muted/50">
                              <RadioGroupItem value="paid" id="paid" className="mt-1" />
                              <div className="flex-1">
                                <label htmlFor="paid" className="flex items-start cursor-pointer">
                                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">Paid Therapist</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                      Set your own rates and earn income from sessions
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 border rounded-lg p-3 sm:p-4 hover:bg-muted/50">
                              <RadioGroupItem value="community" id="community" className="mt-1" />
                              <div className="flex-1">
                                <label htmlFor="community" className="flex items-start cursor-pointer">
                                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">Community Therapist</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                      Provide free services to help those in need
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchTherapistType === "community" && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Community Therapist Program:</strong> As a community therapist, you'll provide free therapy sessions to clients who cannot afford traditional therapy. This is a wonderful way to give back to the community and make mental health services accessible to everyone.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Currency Selection */}
                  <FormField
                    control={form.control}
                    name="preferred_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-sm">
                          This will be used for setting your session rates and payments.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education & Qualifications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your educational background, degrees, and professional qualifications..."
                            className="min-h-[80px] sm:min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm">
                          Include your degree(s), institution(s), and any relevant certifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="license_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your professional license number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="license_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., LCSW, LPC, Ph.D., Psy.D." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="therapy_approaches"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Therapy Approaches</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!field.value.includes(value)) {
                              field.onChange([...field.value, value]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select therapy approaches" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTherapyApproaches
                              .filter(approach => !field.value.includes(approach))
                              .map((approach) => (
                              <SelectItem key={approach} value={approach}>
                                {approach}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((approach, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {approach}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newApproaches = field.value.filter((_, i) => i !== index);
                                    field.onChange(newApproaches);
                                  }}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <FormDescription className="text-sm">
                          Select the therapy approaches and techniques you use.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select languages" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableLanguages
                                .filter(lang => !field.value.includes(lang))
                                .map((language) => (
                                <SelectItem key={language} value={language}>
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((language, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {language}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newLanguages = field.value.filter((_, i) => i !== index);
                                      field.onChange(newLanguages);
                                    }}
                                    className="ml-2 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          <FormDescription className="text-sm">
                            Languages you can provide therapy in.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="session_formats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Formats</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select session formats" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSessionFormats
                                .filter(format => !field.value.includes(format))
                                .map((format) => (
                                <SelectItem key={format} value={format}>
                                  {format}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((format, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {format}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFormats = field.value.filter((_, i) => i !== index);
                                      field.onChange(newFormats);
                                    }}
                                    className="ml-2 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          <FormDescription className="text-sm">
                            Types of therapy sessions you offer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a brief professional bio that clients will see. Describe your experience, approach to therapy, and what clients can expect when working with you..."
                            className="min-h-[120px] sm:min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm">
                          This will be displayed on your profile to help clients understand your background and approach.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specializations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializations</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!field.value.includes(value)) {
                              field.onChange([...field.value, value]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specializations" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSpecializations
                              .filter(spec => !field.value.includes(spec))
                              .map((specialization) => (
                              <SelectItem key={specialization} value={specialization}>
                                {specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((specialization, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialization}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSpecs = field.value.filter((_, i) => i !== index);
                                    field.onChange(newSpecs);
                                  }}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <FormDescription className="text-sm">
                          Select the areas you specialize in treating.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchTherapistType === "paid" && (
                    <FormField
                      control={form.control}
                      name="hourly_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ({form.getValues("preferred_currency")})</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter your hourly rate"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription className="text-sm">
                            Set your hourly rate for therapy sessions. This can be updated later.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="has_insurance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start justify-between rounded-md border p-3 sm:p-4 space-y-0">
                        <div className="space-y-0.5 pr-4">
                          <FormLabel className="text-base">Accepts Insurance</FormLabel>
                          <FormDescription className="text-sm">
                            Do you accept insurance payments?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues("has_insurance") && (
                    <FormField
                      control={form.control}
                      name="insurance_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Information</FormLabel>
                          <FormControl>
                            <Input placeholder="List accepted insurance providers..." {...field} />
                          </FormControl>
                          <FormDescription className="text-sm">
                            Specify the insurance providers you are in-network with.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div>
                    <label className="text-sm font-medium mb-3 block">Availability</label>
                    <AvailabilityPicker value={availability} onChange={setAvailability} />
                  </div>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the Terms of Service and Privacy Policy
                          </FormLabel>
                          <FormDescription className="text-sm">
                            {watchTherapistType === "community" 
                              ? "By agreeing, you commit to providing quality care while volunteering your services for free to help those in need."
                              : "By agreeing, you confirm that you will maintain the highest standards of professional care."
                            }
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Submitting..." : "Complete Profile"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistOnboarding;
