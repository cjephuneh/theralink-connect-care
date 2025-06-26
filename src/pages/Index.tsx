
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  Star, 
  Calendar, 
  MessageCircle, 
  Video, 
  Users, 
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles
} from "lucide-react";
import ForTherapistsSection from '@/components/sections/ForTherapistsSection';
import ForFriendsSection from '@/components/sections/ForFriendsSection';

const Index = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 -z-10 bg-dot-pattern bg-dot-small opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 animation-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your journey to <span className="gradient-text">better mental health</span> starts here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Connect with licensed therapists or experienced peers for support, secure messaging, and personalized care. 
              Experience healing on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group bg-primary hover:bg-primary/90 text-white">
                <Link to="/therapists" className="flex items-center">
                  Find Your Therapist
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-6 text-sm">
              <div className="flex -space-x-2">
                {[1].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80&auto=format&fit=crop&w=100&q=80`} 
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 font-semibold">4.9</span>
                <span className="ml-1 text-muted-foreground">(2.4k+ reviews)</span>
              </div>
            </div>
            
            {/* New section: User Type Options */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button asChild variant="outline" className="group border-primary/30 hover:border-primary">
                <Link to="/for-therapists" className="flex items-center">
                  I'm a Therapist
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="group border-secondary/30 hover:border-secondary">
                <Link to="friends" className="flex items-center">
                  Find a Friend
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animation-slide-up">
            <div className="aspect-square w-full max-w-[500px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full animate-pulse-subtle"></div>
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Therapist talking to patient"
                className="rounded-2xl w-full h-full object-cover card-shadow z-10 relative"
              />
              
              {/* Floating elements */}
              <div className="absolute top-5 -left-10 card-glass rounded-xl p-3 shadow-glass animate-float z-20">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Video Sessions</span>
                </div>
              </div>
              
              <div className="absolute -bottom-5 left-20 card-glass rounded-xl p-3 shadow-glass animate-float z-20" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-10 card-glass rounded-xl p-3 shadow-glass animate-float z-20" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Secure Messaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full inline-block mb-4">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose TheraLink?</h2>
            <p className="text-lg text-muted-foreground">
              We combine technology with human expertise to provide the best mental health support available online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Professional & Peer Support",
                description: "Choose between licensed therapists or experienced peers who've walked in your shoes."
              },
              {
                icon: <Calendar className="h-8 w-8 text-white" />,
                title: "Flexible Scheduling",
                description: "Book sessions that fit your schedule, with options for different time zones."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-white" />,
                title: "Secure Messaging",
                description: "Stay connected with your therapist or friend between sessions via encrypted messaging."
              },
              {
                icon: <Video className="h-8 w-8 text-white" />,
                title: "Video Sessions",
                description: "Enjoy face-to-face therapy from the comfort of your home."
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                title: "Privacy First",
                description: "Your data is protected with end-to-end encryption and HIPAA compliance."
              },
              {
                icon: <Heart className="h-8 w-8 text-white" />,
                title: "Personalized Care",
                description: "Receive tailored support that addresses your specific needs and situation."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-card rounded-2xl p-8 card-shadow hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For Therapists Section */}
      <ForTherapistsSection />
      
      {/* For Friends Section */}
      <ForFriendsSection />
      
      {/* How It Works */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-secondary/10 text-secondary text-sm px-4 py-1.5 rounded-full inline-block mb-4">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TheraLink Works</h2>
          <p className="text-lg text-muted-foreground">
            Connect with a therapist or friend in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Find Your Match",
              description: "Browse our directory and find the right professional or peer for your needs using our matching system."
            },
            {
              step: "02",
              title: "Book a Session",
              description: "Select an available time slot that works for you and complete your booking."
            },
            {
              step: "03",
              title: "Start Your Journey",
              description: "Connect with your therapist or friend via secure video call or messaging at your scheduled time."
            }
          ].map((step, index) => (
            <div key={index} className="relative bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-colors duration-300 hover:shadow-md">
              <div className="text-7xl font-bold text-primary/10 absolute -top-10 -left-3">{step.step}</div>
              <div className="pt-4 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-4">
                  {index === 0 && <Users className="h-5 w-5" />}
                  {index === 1 && <Calendar className="h-5 w-5" />}
                  {index === 2 && <Video className="h-5 w-5" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button asChild size="lg" className="group">
            <Link to="/therapists" className="flex items-center">
              Find Support Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-accent/30 py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-dot-pattern bg-dot-small opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full inline-block mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Real stories from people whose lives changed with TheraLink
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                quote: "Finding the right therapist changed everything for me. The video sessions are so convenient, and I've made real progress with my anxiety.",
                rating: 5
              },
              {
                name: "James K.",
                quote: "After trying several therapists locally, I found the perfect match on TheraLink. The secure messaging between sessions has been invaluable for my ongoing support.",
                rating: 5
              },
              {
                name: "Elena P.",
                quote: "Connecting with a Friend who understood my depression from personal experience made all the difference. It's not therapy, but having someone who's been there is incredibly comforting.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-card rounded-2xl p-8 card-shadow relative hover:shadow-elevation-3 transition-all duration-300"
              >
                <div className="text-6xl text-primary/20 absolute top-4 left-4">"</div>
                <div className="pt-8 pb-4">
                  <p className="text-foreground italic relative z-10">{testimonial.quote}</p>
                </div>
                <div className="border-t border-border/50 pt-4 mt-2">
                  <p className="font-medium">{testimonial.name}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl overflow-hidden card-shadow relative">
          <div className="relative z-10 p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full p-3 mb-8">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to begin your mental health journey?</h2>
              <p className="text-lg opacity-90 mb-8">
                Take the first step towards better mental health today. Our licensed therapists and experienced friends are ready to support you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/therapists">Find Support</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/auth/register">Create an Account</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link to="/for-therapists" className="flex items-center justify-center">
                    Join as a Therapist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link to="/for-friends" className="flex items-center justify-center">
                    Become a Friend
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-sm">
                {['HIPAA Compliant', 'Secure & Encrypted', 'Professional Support', 'Peer Connection'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
