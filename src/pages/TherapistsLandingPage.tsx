
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  Users,
  Shield
} from "lucide-react";

const TherapistsLandingPage = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 -z-10 bg-dot-pattern bg-dot-small opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 animation-fade-in">
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full inline-block">
              For Licensed Therapists
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Grow your practice with <span className="gradient-text">TheraLink</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Join our network of licensed therapists and expand your reach. Connect with clients who need your expertise, all on a secure and user-friendly platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group bg-primary hover:bg-primary/90 text-white">
                <Link to="/auth/register?role=therapist" className="flex items-center">
                  Join as a Therapist
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#benefits" className="flex items-center">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animation-slide-up">
            <div className="aspect-video w-full max-w-[600px] mx-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Therapist in a professional setting"
                className="rounded-2xl w-full h-full object-cover card-shadow z-10 relative"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join TheraLink as a Therapist?</h2>
            <p className="text-lg text-muted-foreground">
              Our platform is designed to help therapists thrive while providing exceptional care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: "Expand Your Client Base",
                description: "Connect with clients who match your expertise and specialties. Our matching algorithm helps find the right fit."
              },
              {
                icon: <Calendar className="h-6 w-6 text-primary" />,
                title: "Flexible Scheduling",
                description: "Manage your availability with our intuitive scheduling system. Work when it suits you best."
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "HIPAA Compliant Platform",
                description: "Our secure, HIPAA-compliant platform protects your sessions and client data."
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-primary" />,
                title: "Secure Communication",
                description: "Encrypted messaging and video sessions for seamless client communication."
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-primary" />,
                title: "Simple Payment Processing",
                description: "Receive payments automatically with our integrated payment system."
              },
              {
                icon: <ArrowRight className="h-6 w-6 text-primary" />,
                title: "Comprehensive Tools",
                description: "Access notes, assessment tools, and resources to enhance your practice."
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Getting started with TheraLink is simple and straightforward
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description: "Sign up and complete your professional profile with your credentials, specialties, and approach."
            },
            {
              step: "02",
              title: "Set Your Availability",
              description: "Define when you're available for sessions and how many clients you can accommodate."
            },
            {
              step: "03",
              title: "Start Connecting",
              description: "Begin matching with clients and scheduling your first sessions."
            }
          ].map((step, index) => (
            <div key={index} className="relative bg-card rounded-xl p-8 border border-border/50 hover:border-primary/20 transition-colors duration-300">
              <div className="text-5xl font-bold text-primary/10 absolute -top-6 -left-2">{step.step}</div>
              <div className="pt-4 relative z-10">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button asChild size="lg" className="group">
            <Link to="/auth/register?role=therapist" className="flex items-center">
              Join as a Therapist
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to expand your practice?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community of therapists and start connecting with clients who need your expertise.
          </p>
          <Button asChild size="lg" className="group">
            <Link to="/auth/register?role=therapist" className="flex items-center">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TherapistsLandingPage;
