
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Shield,
  Users,
  CheckCircle,
  Award,
  Lightbulb,
} from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Dr. Amina Okonkwo",
      role: "Founder & Clinical Director",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80",
      bio: "Dr. Okonkwo founded TheraLink with a vision to make mental healthcare accessible to all Nigerians. With over 15 years of experience in clinical psychology, she leads our team with compassion and expertise."
    },
    {
      name: "Dr. Emmanuel Adeyemi",
      role: "Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
      bio: "Dr. Adeyemi oversees our clinical protocols and therapist training. His research in cognitive behavioral therapy has been published in leading international journals."
    },
    {
      name: "Sarah Nwachukwu",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
      bio: "Sarah ensures TheraLink runs smoothly day-to-day. Her background in healthcare administration and passion for mental health advocacy drive our operational excellence."
    },
    {
      name: "Oluwaseun Afolabi",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80",
      bio: "Oluwaseun leads our technology team, developing the platform that connects clients with therapists. His focus on security and user experience makes our service both safe and accessible."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every client with empathy and understanding, recognizing that each person's journey is unique."
    },
    {
      icon: Shield,
      title: "Privacy",
      description: "We maintain the highest standards of confidentiality and data protection in all our services and interactions."
    },
    {
      icon: Users,
      title: "Inclusion",
      description: "We're committed to making mental healthcare accessible to all Nigerians regardless of background or location."
    },
    {
      icon: CheckCircle,
      title: "Excellence",
      description: "We strive for the highest clinical standards and continuously improve our services based on research and feedback."
    },
    {
      icon: Award,
      title: "Integrity",
      description: "We operate with honesty and transparency in all aspects of our business and therapeutic relationships."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace technology and new approaches to expand access to quality mental healthcare across Nigeria."
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About TheraLink</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connecting Nigerians with licensed therapists for accessible, effective mental healthcare.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-thera-50 to-thera-100 rounded-lg p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg">
              <p>
                TheraLink was founded in 2023 with a clear mission: to bridge the gap in mental healthcare access across Nigeria. Our founder, Dr. Amina Okonkwo, recognized that millions of Nigerians face barriers when seeking mental health support, from stigma to geographical limitations and cost constraints.
              </p>
              <p className="mt-4">
                What began as a small network of dedicated therapists has grown into Nigeria's leading online therapy platform, connecting thousands of clients with qualified mental health professionals. Our innovative approach combines technology with compassionate care, allowing us to reach people in urban centers and rural communities alike.
              </p>
              <p className="mt-4">
                Today, TheraLink continues to expand its services and advocate for mental health awareness throughout Nigeria. We believe that everyone deserves access to quality mental healthcare that respects their unique needs, background, and circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission and Vision */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To make quality mental healthcare accessible to all Nigerians through technology, education, and a network of compassionate professionals. We strive to remove barriers to care and empower individuals on their journey toward better mental wellbeing.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To create a Nigeria where mental health is prioritized as essential to overall wellbeing, where seeking help is normalized, and where everyone has access to the support they need. We envision a future where mental healthcare is integrated into everyday life.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-0 shadow hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-thera-100 p-3 rounded-full mb-4">
                  <value.icon className="h-6 w-6 text-thera-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Leadership Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-thera-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact and Statistics */}
      <section className="mb-20">
        <div className="bg-gray-900 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-thera-400 mb-2">15,000+</div>
              <div className="text-gray-300">Therapy Sessions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-thera-400 mb-2">5,000+</div>
              <div className="text-gray-300">Clients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-thera-400 mb-2">100+</div>
              <div className="text-gray-300">Licensed Therapists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-thera-400 mb-2">36</div>
              <div className="text-gray-300">States Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
        <Tabs defaultValue="general" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Questions</TabsTrigger>
            <TabsTrigger value="services">Our Services</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How did TheraLink start?</h3>
              <p className="text-gray-600">
                TheraLink was founded in 2023 by Dr. Amina Okonkwo to address the gap in mental healthcare accessibility in Nigeria. What began as a small network has evolved into the country's leading online therapy platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is TheraLink available throughout Nigeria?</h3>
              <p className="text-gray-600">
                Yes, our online platform allows us to provide services across all 36 states and the FCT. We're committed to reaching both urban and rural communities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How is TheraLink different from other mental health services?</h3>
              <p className="text-gray-600">
                TheraLink combines technology with compassionate care, offering a platform specifically designed for the Nigerian context. We provide flexible session options, secure communications, and therapists who understand local cultural nuances.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="services" className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What types of therapy do you offer?</h3>
              <p className="text-gray-600">
                We offer a wide range of therapeutic approaches including cognitive behavioral therapy (CBT), psychodynamic therapy, mindfulness-based therapies, and more. Our therapists are trained in multiple modalities to best serve client needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do you ensure the quality of your therapists?</h3>
              <p className="text-gray-600">
                All TheraLink therapists are licensed professionals with verified credentials. We have a thorough vetting process, require ongoing training, and collect client feedback to maintain the highest standards of care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer services in Nigerian languages?</h3>
              <p className="text-gray-600">
                Yes, many of our therapists speak local Nigerian languages including Yoruba, Igbo, Hausa, and others. You can filter by language preference when selecting a therapist.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AboutPage;
