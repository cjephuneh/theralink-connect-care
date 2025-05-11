
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Video, Calendar, CheckCircle, Users, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          How <span className="text-thera-600">TheraLink</span> Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          We connect you with licensed therapists who can help with stress, anxiety, relationships, depression, and more. 
          Get the support you need, when and how you need it.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-thera-600" asChild>
            <Link to="/therapists">
              Find Your Therapist <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="#faq">
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Your Journey to Better Mental Health</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted rounded-full p-4 mb-5">
              <Users className="h-8 w-8 text-thera-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Find Your Match</h3>
            <p className="text-muted-foreground">
              Browse profiles of licensed therapists and counselors who specialize in your area of concern. 
              Filter by specialty, availability, and more.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted rounded-full p-4 mb-5">
              <Calendar className="h-8 w-8 text-thera-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Schedule a Session</h3>
            <p className="text-muted-foreground">
              Book your first appointment with your chosen therapist at a time that works for you. 
              Choose between video calls or text-based chat sessions.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted rounded-full p-4 mb-5">
              <Video className="h-8 w-8 text-thera-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Start Your Sessions</h3>
            <p className="text-muted-foreground">
              Connect with your therapist via our secure platform. Develop a treatment plan together 
              and begin your journey toward better mental wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Session Types */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Flexible Session Types</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the therapy format that works best for you and your schedule.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-thera-600">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-thera-100 p-3 rounded-lg">
                  <Video className="h-6 w-6 text-thera-600" />
                </div>
                <CardTitle>Video Sessions</CardTitle>
              </div>
              <CardDescription>Face-to-face connection from anywhere</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>50-minute live video sessions with your therapist</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Similar to in-office visits but from the comfort of your home</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Perfect for deep discussions and building rapport</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Secure, HIPAA-compliant platform</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Chat Sessions</CardTitle>
              </div>
              <CardDescription>Convenient text-based therapy</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>30-minute text-based chat sessions with your therapist</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Ideal for those who prefer writing out their thoughts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Great for check-ins and ongoing support between video sessions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>End-to-end encrypted messaging for privacy</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clinician Qualifications */}
      <section className="mb-20">
        <div className="bg-muted rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Qualified Professionals</h2>
              <p className="text-lg mb-6">
                We carefully vet all therapists on our platform to ensure they have the proper credentials, 
                experience, and approach to provide high-quality care.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-thera-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-thera-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Licensed Professionals</h3>
                    <p className="text-muted-foreground">All therapists are fully licensed in their state of practice</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-thera-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-thera-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verified Credentials</h3>
                    <p className="text-muted-foreground">We verify education, licenses, and professional standing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-thera-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-thera-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Experienced Specialists</h3>
                    <p className="text-muted-foreground">Our therapists have an average of 7+ years of clinical experience</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-thera-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-thera-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ongoing Supervision</h3>
                    <p className="text-muted-foreground">We monitor quality and client satisfaction</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-thera-100 to-blue-100 rounded-2xl w-[280px] h-[350px] flex items-center justify-center">
                  <Shield className="h-32 w-32 text-thera-600/50" />
                </div>
                <div className="absolute top-6 -right-5 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="font-semibold">100%</p>
                      <p className="text-sm text-muted-foreground">Licensed & Verified</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-10 w-10 text-thera-600" />
                    <div>
                      <p className="font-semibold">500+</p>
                      <p className="text-sm text-muted-foreground">Qualified Therapists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform and services.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">How much does therapy cost on TheraLink?</h3>
            <p className="text-muted-foreground">
              Therapy sessions start at $80 per session, with the exact price depending on your therapist's rates and 
              session type. Many of our therapists also accept insurance.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Is online therapy effective?</h3>
            <p className="text-muted-foreground">
              Yes! Research has shown that online therapy can be just as effective as in-person therapy for many conditions, 
              including anxiety, depression, and stress management.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How do I know if my therapist is a good match?</h3>
            <p className="text-muted-foreground">
              We recommend scheduling an initial consultation to see if you and your therapist connect well. You can always 
              switch therapists if needed at no additional cost.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Is my information secure and confidential?</h3>
            <p className="text-muted-foreground">
              Absolutely. We use bank-level encryption and are fully HIPAA compliant. Your privacy is our top priority, 
              and all sessions are completely confidential.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How often should I schedule sessions?</h3>
            <p className="text-muted-foreground">
              Most clients start with weekly sessions, but you and your therapist will determine the right frequency 
              based on your needs and goals.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I cancel or reschedule a session?</h3>
            <p className="text-muted-foreground">
              Yes, you can reschedule or cancel sessions up to 24 hours before the appointment time without any penalty.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="bg-gradient-to-r from-thera-600 to-blue-600 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of people who have improved their mental health with TheraLink's 
            professional online therapy services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-thera-600 hover:bg-gray-100" asChild>
              <Link to="/therapists">
                Find a Therapist
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
