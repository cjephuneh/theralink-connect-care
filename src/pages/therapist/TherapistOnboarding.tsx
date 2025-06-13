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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, DollarSign, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

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
      insurance_info: "",
      has_insurance: false,
      termsAccepted: false,
    },
  });

  const watchTherapistType = form.watch("therapist_type");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to complete your profile",
        variant: "destructive",
      });
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

      // Update the therapist profile to indicate type
      await supabase
        .from('therapists')
        .upsert({
          id: user.id,
          hourly_rate: values.therapist_type === 'community' ? 0 : null,
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
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      <ProfileImageUpload />
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Therapist Profile</CardTitle>
          <CardDescription>
            Please provide your professional information to help us verify your credentials and match you with the right clients.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Therapist Type Selection */}
              <FormField
                control={form.control}
                name="therapist_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">Therapist Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                          <RadioGroupItem value="paid" id="paid" />
                          <div className="flex-1">
                            <label htmlFor="paid" className="flex items-center cursor-pointer">
                              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                              <div>
                                <div className="font-medium">Paid Therapist</div>
                                <div className="text-sm text-muted-foreground">
                                  Set your own rates and earn income from sessions
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                          <RadioGroupItem value="community" id="community" />
                          <div className="flex-1">
                            <label htmlFor="community" className="flex items-center cursor-pointer">
                              <Heart className="h-5 w-5 mr-2 text-red-500" />
                              <div>
                                <div className="font-medium">Community Therapist</div>
                                <div className="text-sm text-muted-foreground">
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
                  <AlertDescription>
                    <strong>Community Therapist Program:</strong> As a community therapist, you'll provide free therapy sessions to clients who cannot afford traditional therapy. This is a wonderful way to give back to the community and make mental health services accessible to everyone. Your generous contribution will make a real difference in people's lives.
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education & Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your educational background, degrees, and professional qualifications..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include your degree(s), institution(s), and any relevant certifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain your methods and how you tailor therapy to individual needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                      <Input placeholder="List all languages you can provide therapy in..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify all languages fluently spoken to assist diverse clients.
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
                    <FormDescription>
                      Specify the formats of therapy sessions you offer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_insurance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Accepts Insurance</FormLabel>
                      <FormDescription>
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
                      <FormDescription>
                        Specify the insurance providers you are in-network with.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the Terms of Service and Privacy Policy
                      </FormLabel>
                      <FormDescription>
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
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Complete Profile"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default TherapistOnboarding;
