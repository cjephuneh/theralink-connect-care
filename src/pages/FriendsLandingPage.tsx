
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Heart, 
  Users, 
  MessageSquare,
  Calendar,
  CheckCircle
} from "lucide-react";

const FriendsLandingPage = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-secondary/10 via-background to-accent/10">
        <div className="absolute inset-0 -z-10 bg-dot-pattern bg-dot-small opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 animation-fade-in">
            <span className="bg-secondary/10 text-secondary text-sm px-4 py-1.5 rounded-full inline-block">
              Become a Friend
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Share your journey, <span className="gradient-text">help others heal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Have you overcome mental health challenges? Your experience is valuable. 
              Join TheraLink as a Friend and support others going through similar struggles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group bg-secondary hover:bg-secondary/90 text-white">
                <Link to="/auth/register?role=friend" className="flex items-center">
                  Register as a Friend
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#benefits" className="flex items-center">
                  Learn More
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Friends provide peer support, not professional therapy
            </p>
          </div>
          
          <div className="lg:w-1/2 relative animation-slide-up">
            <div className="aspect-video w-full max-w-[600px] mx-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1516195851888-6f1a981a862e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="People having a supportive conversation"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Become a Friend?</h2>
            <p className="text-lg text-muted-foreground">
              Make a meaningful difference in people's lives while using your lived experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-6 w-6 text-secondary" />,
                title: "Share Your Experience",
                description: "Use your journey through mental health challenges to provide authentic peer support."
              },
              {
                icon: <Users className="h-6 w-6 text-secondary" />,
                title: "Connect With Others",
                description: "Build meaningful connections with people who need someone who truly understands."
              },
              {
                icon: <Calendar className="h-6 w-6 text-secondary" />,
                title: "Flexible Schedule",
                description: "Provide support on your own time. You decide when you're available."
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-secondary" />,
                title: "Ongoing Support",
                description: "Communicate with those you support through our secure messaging platform."
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-secondary" />,
                title: "Training & Resources",
                description: "Access resources to help you provide effective peer support."
              },
              {
                icon: <ArrowRight className="h-6 w-6 text-secondary" />,
                title: "Make a Difference",
                description: "Be part of someone's healing journey and create positive change."
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
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
            Becoming a Friend on TheraLink is simple
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description: "Sign up and share your experience with mental health challenges and how you've navigated your journey."
            },
            {
              step: "02",
              title: "Complete Onboarding",
              description: "Learn about peer support best practices and set up your availability."
            },
            {
              step: "03",
              title: "Start Supporting",
              description: "Connect with people seeking peer support and begin making a difference."
            }
          ].map((step, index) => (
            <div key={index} className="relative bg-card rounded-xl p-8 border border-border/50 hover:border-secondary/20 transition-colors duration-300">
              <div className="text-5xl font-bold text-secondary/10 absolute -top-6 -left-2">{step.step}</div>
              <div className="pt-4 relative z-10">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button asChild size="lg" variant="secondary" className="group">
            <Link to="/auth/register?role=friend" className="flex items-center">
              Become a Friend
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your experience matters. Join TheraLink as a Friend and help others on their mental health journey.
          </p>
          <Button asChild size="lg" variant="secondary" className="group">
            <Link to="/auth/register?role=friend" className="flex items-center">
              Register Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FriendsLandingPage;
