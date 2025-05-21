
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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  experience_description: z.string().min(10, {
    message: "Experience description must be at least 10 characters.",
  }),
  areas_of_experience: z.string().min(3, {
    message: "Please specify at least one area of experience.",
  }),
  personal_story: z.string().min(50, {
    message: "Your personal story should be at least 50 characters.",
  }),
  communication_preferences: z.string().min(3, {
    message: "Please specify your communication preferences.",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

const FriendOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience_description: "",
      areas_of_experience: "",
      personal_story: "",
      communication_preferences: "",
      termsAccepted: false,
    },
  });

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
      const { error } = await supabase
        .from('friend_details')
        .upsert({
          friend_id: user.id,
          experience_description: values.experience_description,
          areas_of_experience: values.areas_of_experience,
          personal_story: values.personal_story,
          communication_preferences: values.communication_preferences,
        });

      if (error) throw error;

      toast({
        title: "Profile completed",
        description: "Your friend profile has been successfully set up.",
      });

      navigate('/friend/dashboard');
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
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Friend Profile</CardTitle>
          <CardDescription>
            Please provide some information about your experience and how you can help others.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="experience_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your personal experience with mental health challenges..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your background and what you've personally experienced.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areas_of_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Depression, Anxiety, Grief, PTSD" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the specific areas where you have personal experience and can provide support.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personal_story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Personal Story</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your journey and how you overcame challenges..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will help clients understand how you can relate to their situation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communication_preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Communication Preferences</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Video calls, Text messaging, Voice calls" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How do you prefer to communicate with those you support?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        By agreeing, you confirm that you will maintain confidentiality and follow our community guidelines.
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

export default FriendOnboarding;
