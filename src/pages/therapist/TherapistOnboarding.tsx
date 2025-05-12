import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  Loader2, 
  UploadCloud, 
  User,
  FileText,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Calendar
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const specializations = [
  "Anxiety",
  "Depression",
  "Trauma & PTSD",
  "Relationship Issues",
  "Stress",
  "Self-Esteem",
  "Grief",
  "Addiction",
  "Family Conflicts",
  "Parenting",
  "Career Counseling",
  "Bipolar Disorder",
  "Anger Management",
  "Child & Adolescent Issues",
  "Eating Disorders",
  "ADHD",
  "OCD",
  "Sleep Issues",
  "LGBTQ+ Issues",
  "Chronic Pain"
];

const therapyApproaches = [
  "Cognitive Behavioral (CBT)",
  "Psychodynamic",
  "Person-Centered",
  "Mindfulness-Based",
  "Solution-Focused Brief Therapy (SFBT)",
  "Dialectical Behavior Therapy (DBT)",
  "Acceptance and Commitment Therapy (ACT)",
  "Narrative Therapy",
  "Emotionally-Focused Therapy (EFT)",
  "Gestalt Therapy",
  "Existential Therapy",
  "Motivational Interviewing",
  "Family Systems Therapy",
  "Integrative"
];

const formSchema = z.object({
  full_name: z.string().min(3, "Full name is required and must be at least 3 characters"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000, "Bio must not exceed 1000 characters"),
  education: z.string().min(10, "Education details are required"),
  license_number: z.string().min(3, "License number is required"),
  license_type: z.string().min(3, "License type is required"),
  years_experience: z.coerce.number().min(0, "Experience must be a positive number"),
  hourly_rate: z.coerce.number().min(10, "Hourly rate must be at least 10"),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  therapy_approaches: z.array(z.string()).min(1, "Select at least one therapy approach"),
  languages: z.string().min(3, "Languages spoken are required"),
  insurance_info: z.string().optional(),
  session_format: z.array(z.string()).min(1, "Select at least one session format"),
  availability: z.object({
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    sunday: z.boolean().optional(),
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  has_malpractice_insurance: z.boolean(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const TherapistOnboarding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: '',
      education: '',
      license_number: '',
      license_type: '',
      years_experience: 0,
      hourly_rate: 50,
      specializations: [],
      therapy_approaches: [],
      languages: '',
      insurance_info: '',
      session_format: [],
      availability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      start_time: '09:00',
      end_time: '17:00',
      has_malpractice_insurance: false,
      terms_accepted: false,
    },
  });
  
  const handleNext = async () => {
    let canProceed = false;
    if (step === 1) {
      const isValid = await form.trigger(['full_name', 'bio', 'education']);
      canProceed = isValid;
    } else if (step === 2) {
      const isValid = await form.trigger([
        'license_number', 
        'license_type', 
        'years_experience', 
        'hourly_rate'
      ]);
      canProceed = isValid;
    } else if (step === 3) {
      const isValid = await form.trigger([
        'specializations', 
        'therapy_approaches', 
        'languages'
      ]);
      canProceed = isValid;
    }

    if (canProceed) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format availability as JSON object for storage
      const availability = {
        days: {
          monday: values.availability.monday,
          tuesday: values.availability.tuesday,
          wednesday: values.availability.wednesday,
          thursday: values.availability.thursday,
          friday: values.availability.friday,
          saturday: values.availability.saturday,
          sunday: values.availability.sunday,
        },
        hours: {
          start: values.start_time,
          end: values.end_time,
        }
      };

      // Update therapist profile
      const { error: therapistError } = await supabase
        .from('therapists')
        .update({
          bio: values.bio,
          specialization: values.specializations.join(', '),
          years_experience: values.years_experience,
          hourly_rate: values.hourly_rate,
          availability: availability,
        })
        .eq('id', user.id);

      if (therapistError) throw therapistError;

      // Insert additional information to the therapist_details table using the RPC function
      const { error: detailsError } = await supabase.rpc(
        'insert_therapist_details',
        {
          p_therapist_id: user.id,
          p_education: values.education,
          p_license_number: values.license_number,
          p_license_type: values.license_type,
          p_therapy_approaches: values.therapy_approaches.join(', '),
          p_languages: values.languages,
          p_insurance_info: values.insurance_info || 'None',
          p_session_formats: values.session_format.join(', '),
          p_has_insurance: values.has_malpractice_insurance
        } as any
      );

      if (detailsError) {
        console.error('Error saving therapist details:', detailsError);
        throw new Error('Additional therapist details could not be saved. Please contact admin to set up the required database tables.');
      }

      // Update the user's full_name in profiles table if changed
      if (values.full_name !== profile?.full_name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: values.full_name })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Onboarding Complete",
        description: "Your profile has been successfully submitted and is awaiting approval.",
      });

      // Navigate to therapist dashboard
      navigate('/therapist/dashboard');

    } catch (error) {
      console.error('Error submitting therapist onboarding:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Therapist Onboarding</CardTitle>
            <CardDescription>
              Complete your professional profile to join the TheraLink platform.
              {step === 1 && " Let's start with your basic information."}
              {step === 2 && " Now tell us about your credentials."}
              {step === 3 && " What are your areas of expertise?"}
              {step === 4 && " Let us know when you're available."}
              {step === 5 && " Please review and submit your information."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-8 border-b pb-4">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div 
                  key={stepNumber} 
                  className={`flex flex-col items-center ${
                    stepNumber === step ? 'text-primary' : 
                    stepNumber < step ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    stepNumber === step ? 'bg-primary text-white' : 
                    stepNumber < step ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
                  </div>
                  <span className="text-xs mt-1 hidden md:block">
                    {stepNumber === 1 && "Profile"}
                    {stepNumber === 2 && "Credentials"}
                    {stepNumber === 3 && "Expertise"}
                    {stepNumber === 4 && "Availability"}
                    {stepNumber === 5 && "Review"}
                  </span>
                </div>
              ))}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Personal Information</h3>
                    </div>
                
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Jane Smith" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your full name as it appears on your professional credentials.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your background, approach to therapy, and what clients can expect when working with you..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed on your public profile. (50-1000 characters)
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
                          <FormLabel>Education Background</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g. Ph.D. in Clinical Psychology, University of Lagos, 2015" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            List your relevant degrees, certifications, and where you obtained them.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Professional Credentials */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Professional Credentials</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="license_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License/Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. PSY12345" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your professional license or registration number.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="license_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License/Registration Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Clinical Psychologist" {...field} />
                          </FormControl>
                          <FormDescription>
                            The type of professional license or registration you hold.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="years_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Professional Experience</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormDescription>
                              How many years have you been practicing?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hourly_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate (₦)</FormLabel>
                            <FormControl>
                              <Input type="number" min="10" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your standard rate per session hour.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="has_malpractice_insurance"
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
                              I have current malpractice/professional liability insurance
                            </FormLabel>
                            <FormDescription>
                              Required for practicing on our platform.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Areas of Expertise */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Areas of Expertise</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="specializations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specializations</FormLabel>
                          <FormDescription className="mb-3">
                            Select all areas you specialize in.
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {specializations.map((specialization) => (
                              <FormItem
                                key={specialization}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(specialization)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, specialization])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== specialization
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {specialization}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    <FormField
                      control={form.control}
                      name="therapy_approaches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Therapeutic Approaches</FormLabel>
                          <FormDescription className="mb-3">
                            Select all approaches you use in your practice.
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {therapyApproaches.map((approach) => (
                              <FormItem
                                key={approach}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(approach)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, approach])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== approach
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {approach}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages Spoken</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. English, Yoruba, Igbo" {...field} />
                          </FormControl>
                          <FormDescription>
                            List all languages you can conduct therapy in, separated by commas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance & Payment Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List insurance plans you accept or other payment information..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Information about insurance plans accepted or other payment options.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="session_format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Formats</FormLabel>
                          <FormDescription className="mb-3">
                            Select all formats you're available for.
                          </FormDescription>
                          <div className="flex flex-wrap gap-4">
                            {['Video', 'In-person', 'Chat', 'Phone'].map((format) => (
                              <FormItem
                                key={format}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(format)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, format])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== format
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {format}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Availability */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Availability</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="availability"
                      render={() => (
                        <FormItem>
                          <FormLabel>Available Days</FormLabel>
                          <FormDescription className="mb-3">
                            Select the days you are available to see clients.
                          </FormDescription>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                            {[
                              { day: 'monday', label: 'Monday' },
                              { day: 'tuesday', label: 'Tuesday' },
                              { day: 'wednesday', label: 'Wednesday' },
                              { day: 'thursday', label: 'Thursday' },
                              { day: 'friday', label: 'Friday' },
                              { day: 'saturday', label: 'Saturday' },
                              { day: 'sunday', label: 'Sunday' },
                            ].map(({ day, label }) => (
                              <FormField
                                key={day}
                                control={form.control}
                                name={`availability.${day}` as any}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your typical start time for sessions.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your typical end time for sessions.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Review and Submit */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Review & Submit</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Name:</span> {form.getValues('full_name')}</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Bio:</span> {form.getValues('bio').length > 100 ? `${form.getValues('bio').substring(0, 100)}...` : form.getValues('bio')}
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Professional Credentials</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">License Number:</span> {form.getValues('license_number')}</div>
                          <div><span className="font-medium">License Type:</span> {form.getValues('license_type')}</div>
                          <div><span className="font-medium">Years Experience:</span> {form.getValues('years_experience')}</div>
                          <div><span className="font-medium">Hourly Rate:</span> ₦{form.getValues('hourly_rate')}</div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Areas of Expertise</h4>
                        <div className="text-sm">
                          <div className="mb-2">
                            <span className="font-medium">Specializations:</span> {form.getValues('specializations').join(', ')}
                          </div>
                          <div className="mb-2">
                            <span className="font-medium">Approaches:</span> {form.getValues('therapy_approaches').join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Languages:</span> {form.getValues('languages')}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Availability</h4>
                        <div className="text-sm">
                          <div className="mb-2">
                            <span className="font-medium">Days:</span> {Object.entries(form.getValues('availability'))
                              .filter(([_, value]) => value === true)
                              .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                              .join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Hours:</span> {form.getValues('start_time')} - {form.getValues('end_time')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="terms_accepted"
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
                              I confirm that all information provided is accurate and complete
                            </FormLabel>
                            <FormDescription>
                              By submitting, you agree to our terms of service and privacy policy for therapists.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Form Navigation */}
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}
                  {step < 5 && (
                    <Button type="button" onClick={handleNext} className="ml-auto">
                      Continue
                    </Button>
                  )}
                  {step === 5 && (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="ml-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Complete Onboarding'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistOnboarding;
