
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ForTherapistsSection = () => {
  return (
    <section className="py-24 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="space-y-6 md:order-2">
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full">
              For Licensed Therapists
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">Expand your practice with TheraLink</h2>
            <p className="text-lg text-muted-foreground">
              Join our platform of licensed therapists providing professional mental health services. 
              Grow your client base and practice therapy in a modern, flexible environment.
            </p>
            <div className="space-y-4 md:space-y-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Connect with clients who match your expertise</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Secure video sessions and messaging</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Simple scheduling and client management</p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/for-therapists" className="flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative md:order-1">
            <div className="aspect-square w-full max-w-[500px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full animate-pulse-subtle"></div>
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Professional therapist in session"
                className="rounded-2xl w-full h-full object-cover card-shadow z-10 relative"
              />
              
              <div className="absolute -bottom-5 right-20 card-glass rounded-xl p-3 shadow-glass animate-float z-20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Licensed Professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForTherapistsSection;
