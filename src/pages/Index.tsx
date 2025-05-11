
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Video, 
  MessageCircle,
  Calendar,
  Star,
  User
} from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-thera-500 to-thera-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Journey to Better Mental Health Starts Here
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Connect with licensed therapists for secure video sessions, messaging, and personalized support from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-thera-700 hover:bg-gray-100 font-semibold text-base"
                >
                  <Link to="/therapists">
                    Find Your Therapist <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-thera-600 font-semibold text-base"
                >
                  <Link to="/how-it-works">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-6 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Online therapy session" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-mint-500 text-white px-6 py-3 rounded-lg shadow-lg">
                <p className="font-semibold">96% Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How TheraLink Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to connect with professional therapists in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-thera-100 h-14 w-14 flex items-center justify-center rounded-full mb-4">
                <User className="h-6 w-6 text-thera-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Find Your Match</h3>
              <p className="text-gray-600">
                Browse our directory of licensed therapists and find the perfect match based on specialties, experience, and reviews.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-thera-100 h-14 w-14 flex items-center justify-center rounded-full mb-4">
                <Calendar className="h-6 w-6 text-thera-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Book a Session</h3>
              <p className="text-gray-600">
                Schedule a session at your convenience with our easy-to-use booking system that respects your time zone.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-thera-100 h-14 w-14 flex items-center justify-center rounded-full mb-4">
                <Video className="h-6 w-6 text-thera-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Connect Securely</h3>
              <p className="text-gray-600">
                Meet your therapist through our secure, HIPAA-compliant video platform or exchange messages through encrypted chat.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/how-it-works">
                Learn More About Our Process <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TheraLink</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've built a platform that prioritizes your mental health journey with features designed for success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="bg-thera-100 h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                <Star className="h-5 w-5 text-thera-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Licensed Professionals</h3>
                <p className="text-gray-600">
                  All therapists on our platform are fully licensed and vetted, ensuring you receive quality care from qualified professionals.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="bg-thera-100 h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                <Video className="h-5 w-5 text-thera-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">High-Quality Video Therapy</h3>
                <p className="text-gray-600">
                  Experience face-to-face therapy from anywhere with our high-definition, secure video platform.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="bg-thera-100 h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                <MessageCircle className="h-5 w-5 text-thera-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Secure Messaging</h3>
                <p className="text-gray-600">
                  Stay connected between sessions with end-to-end encrypted messaging for ongoing support.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="bg-thera-100 h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                <Calendar className="h-5 w-5 text-thera-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Book, reschedule, or cancel sessions with ease through our intuitive calendar system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from people who have transformed their mental health with TheraLink.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "TheraLink made it incredibly easy to find a therapist who understands my specific needs. The video sessions feel just as effective as in-person therapy."
              </p>
              <div className="flex items-center">
                <div className="bg-thera-200 h-10 w-10 rounded-full flex items-center justify-center text-thera-700 font-bold">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Maria K.</p>
                  <p className="text-sm text-gray-500">Client for 8 months</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As someone with a busy schedule, the flexibility of TheraLink has been life-changing. I can connect with my therapist from anywhere."
              </p>
              <div className="flex items-center">
                <div className="bg-thera-200 h-10 w-10 rounded-full flex items-center justify-center text-thera-700 font-bold">
                  J
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">James T.</p>
                  <p className="text-sm text-gray-500">Client for 5 months</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The messaging feature between sessions has been a game-changer. I can share thoughts as they come up, making my therapy journey more continuous."
              </p>
              <div className="flex items-center">
                <div className="bg-thera-200 h-10 w-10 rounded-full flex items-center justify-center text-thera-700 font-bold">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Sarah L.</p>
                  <p className="text-sm text-gray-500">Client for 3 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-thera-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Mental Health Journey?</h2>
            <p className="text-xl opacity-90 mb-8">
              Take the first step towards better mental health with TheraLink. Find a therapist that's right for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-thera-700 hover:bg-gray-100 font-semibold"
              >
                <Link to="/therapists">
                  Find a Therapist <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-thera-600"
              >
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
