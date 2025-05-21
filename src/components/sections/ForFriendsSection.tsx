
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ForFriendsSection = () => {
  return (
    <section className="py-24 bg-accent/20" id="for-friends">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-secondary/10 text-secondary text-sm px-4 py-1.5 rounded-full">
              Become a Peer Support Friend
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">Share your mental health journey, help others heal</h2>
            <p className="text-lg text-muted-foreground">
              Have you overcome depression, anxiety, stress, or other mental health challenges? Your experience is invaluable. 
              Register as a Friend on TheraLink and provide meaningful peer support to others going through similar struggles.
            </p>
            <div className="space-y-4 md:space-y-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Offer authentic peer support based on your personal mental health experiences</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Connect with people seeking someone who truly understands their struggles</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <p>Make a difference by guiding others through their mental health journey</p>
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group">
                  <Link to="/for-friends" className="flex items-center">
                    Register as a Friend
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline">
                  <Link to="/friends" className="flex items-center">
                    Browse Friends
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Note: Friends provide peer support, not professional therapy services
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square w-full max-w-[500px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-radial from-secondary/20 to-transparent rounded-full animate-pulse-subtle"></div>
              <img 
                src="https://images.unsplash.com/photo-1516195851888-6f1a981a862e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Peer supporters sharing mental health experiences and providing emotional support"
                className="rounded-2xl w-full h-full object-cover card-shadow z-10 relative"
              />
              
              <div className="absolute -bottom-5 left-20 card-glass rounded-xl p-3 shadow-glass animate-float z-20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Authentic Peer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForFriendsSection;
