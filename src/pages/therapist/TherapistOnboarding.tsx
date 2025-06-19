
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
import { Heart, DollarSign, Info, Menu, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import AvailabilityPicker from "@/components/profile/AvailabilityPicker";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  therapy_approaches: z.string().min(10, {
    message: "Please describe your therapy approaches.",
  }),
  languages: z.string().min(3, {
    message: "Please specify languages you speak.",
  }),
  session_formats: z.string().min(3, {
    message: "Please specify your preferred session formats.",
  }),
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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<Slot[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: "",
      license_number: "",
      license_type: "",
      therapy_approaches: "",
      languages: "",
      session_formats: "",
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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      const { error } = await supabase.rpc('insert_therapist_details', {
        p_therapist_id: user.id,
        p_education: values.education,
        p_license_number: values.license_number,
        p_license_type: values.license_type,
        p_therapy_approaches: values.therapy_approaches,
        p_languages: values.languages,
        p_insurance_info: values.insurance_info || '',
        p_session_formats: values.session_formats,
        p_has_insurance: values.has_insurance,
      });

      if (error) throw error;

      // Update therapist details with currency
      await supabase
        .from('therapist_details')
        .update({ preferred_currency: values.preferred_currency })
        .eq('therapist_id', user.id);

      // Update the therapist profile to indicate type and currency
      await supabase
        .from('therapists')
        .upsert({
          id: user.id,
          hourly_rate: values.therapist_type === 'community' ? 0 : null,
          preferred_currency: values.preferred_currency,
          availability: availability as any, // Cast to any to satisfy Json type
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

  const MobileNavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/therapist/dashboard" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <span className="font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg">TheraLink</span>
        </Link>
      </div>
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link 
            to="/therapist/dashboard" 
            className="block px-3 py-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/therapist/onboarding" 
            className="block px-3 py-2 rounded-md bg-blue-100 text-blue-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Complete Profile
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <MobileNavContent />
          </SheetContent>
        </Sheet>
        
        <Link to="/therapist/dashboard" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <span className="font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg">TheraLink</span>
        </Link>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

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
                        <FormControl>
                          <Textarea
                            placeholder="Describe your therapy approaches and techniques..."
                            className="min-h-[80px] sm:min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm">
                          Explain your methods and how you tailor therapy to individual needs.
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
                          <FormControl>
                            <Input placeholder="e.g., English, Spanish, French" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input placeholder="e.g., Individual, Couples, Family, Group" {...field} />
                          </FormControl>
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
