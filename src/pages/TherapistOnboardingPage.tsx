
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const TherapistOnboardingPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Join TheraLink as a Therapist</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with clients, grow your practice, and make mental healthcare accessible through our platform.
        </p>

        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Become a TheraLink Therapist</h2>
            <p className="mb-6">
              Our onboarding process is designed to be straightforward while ensuring we maintain our high standards of care. Here's how to get started:
            </p>

            <div className="grid gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Create Your Account</h3>
                      <p className="text-muted-foreground">
                        Sign up as a therapist and fill out your basic profile information including your contact details and professional background.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Verify Your Credentials</h3>
                      <p className="text-muted-foreground">
                        Upload your professional licenses, certifications, and proof of malpractice insurance. Our team will verify all documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Complete Your Profile</h3>
                      <p className="text-muted-foreground">
                        Add details about your practice, specializations, therapeutic approach, and set your availability and session rates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Platform Training</h3>
                      <p className="text-muted-foreground">
                        Complete a brief orientation on using the TheraLink platform, including the video sessions, messaging system, and documentation tools.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Start Your Practice</h3>
                      <p className="text-muted-foreground">
                        Once approved, your profile will be visible to potential clients and you can begin accepting appointments through the platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Why Join TheraLink?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Expand Your Client Base</h3>
                  <p className="text-muted-foreground text-sm">Access a broader network of potential clients seeking your specialized expertise.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Flexible Schedule</h3>
                  <p className="text-muted-foreground text-sm">Set your own availability and work hours that fit your lifestyle.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Secure Platform</h3>
                  <p className="text-muted-foreground text-sm">HIPAA-compliant video sessions, messaging, and documentation tools.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Streamlined Payments</h3>
                  <p className="text-muted-foreground text-sm">Get paid promptly with our integrated payment system. No more chasing invoices.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Practice Management Tools</h3>
                  <p className="text-muted-foreground text-sm">Access to scheduling, notes, client management, and analytics tools.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Professional Community</h3>
                  <p className="text-muted-foreground text-sm">Connect with other therapists for support and professional development.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mt-12 bg-primary/5 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Ready to Join Our Network?</h2>
                <p className="text-muted-foreground">
                  Start making a difference in more lives with TheraLink's therapist platform.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/auth/register">Apply Today</Link>
              </Button>
            </div>
          </section>
          
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">What are the requirements to join as a therapist?</h3>
                <p className="text-muted-foreground">
                  You must be a licensed mental health professional (e.g., psychologist, psychiatrist, counselor, clinical social worker) with valid credentials in your practicing jurisdiction.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">How long does the verification process take?</h3>
                <p className="text-muted-foreground">
                  Typically 3-5 business days after submitting all required documentation.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">What are the fees for therapists?</h3>
                <p className="text-muted-foreground">
                  TheraLink takes a 15% platform fee from each session. This covers payment processing, platform maintenance, and client acquisition.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">How do I get paid?</h3>
                <p className="text-muted-foreground">
                  Payments are processed after each completed session and transferred to your linked bank account weekly.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions about joining TheraLink?</p>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TherapistOnboardingPage;
