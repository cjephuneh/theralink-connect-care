
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Button, 
  Card, 
  CardContent,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui";
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Star, 
  Award, 
  Languages, 
  MapPin, 
  DollarSign, 
  Check
} from "lucide-react";

// Mock therapist data (in real app, this would come from a backend API)
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Anxiety", "Depression", "Trauma", "PTSD"],
    languages: ["English", "Spanish"],
    yearsExperience: 8,
    location: "New York, NY (Remote Available)",
    education: [
      { degree: "Ph.D. in Clinical Psychology", institution: "Columbia University", year: "2015" },
      { degree: "M.A. in Psychology", institution: "New York University", year: "2012" },
    ],
    certifications: [
      "Licensed Psychologist - State of New York",
      "Certified Trauma Professional",
      "Cognitive Behavioral Therapy Certification"
    ],
    approach: [
      "Cognitive Behavioral Therapy (CBT)",
      "Mindfulness-Based Therapy",
      "Trauma-Informed Care",
      "Solution-Focused Brief Therapy"
    ],
    price: 85,
    insurance: ["Blue Cross Blue Shield", "Aetna", "Cigna", "United Healthcare"],
    nextAvailable: [
      { date: "Monday, May 13", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { date: "Tuesday, May 14", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
      { date: "Wednesday, May 15", slots: ["1:00 PM", "5:00 PM"] },
    ],
    about: "I am a licensed clinical psychologist with over 8 years of experience helping clients navigate life's challenges. I specialize in evidence-based approaches including Cognitive Behavioral Therapy (CBT) and mindfulness techniques.\n\nMy practice focuses on creating a warm, non-judgmental environment where you can explore your thoughts and feelings safely. I believe therapy is a collaborative process, and I work with each client to develop personalized strategies for growth and healing.\n\nWhether you're dealing with anxiety, depression, trauma, or just feeling stuck, I'm here to support your journey toward better mental health. I particularly enjoy working with adults and young professionals navigating life transitions, identity issues, and relationship challenges."
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Licensed Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviewCount: 93,
    specialties: ["Relationships", "Couples Therapy", "Family Conflict"],
    languages: ["English", "Mandarin"],
    yearsExperience: 12,
    location: "San Francisco, CA (Remote Available)",
    education: [
      { degree: "Ph.D. in Marriage and Family Therapy", institution: "Stanford University", year: "2010" },
      { degree: "M.A. in Psychology", institution: "UC Berkeley", year: "2007" },
    ],
    certifications: [
      "Licensed Marriage and Family Therapist - California",
      "Gottman Method Couples Therapy (Level 3)",
      "Emotionally Focused Therapy Certification"
    ],
    approach: [
      "Gottman Method",
      "Emotionally Focused Therapy",
      "Narrative Therapy",
      "Family Systems Theory"
    ],
    price: 95,
    insurance: ["Aetna", "Cigna", "Kaiser Permanente"],
    nextAvailable: [
      { date: "Today", slots: ["6:00 PM", "7:00 PM"] },
      { date: "Tomorrow", slots: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { date: "Friday, May 16", slots: ["9:00 AM", "11:00 AM", "4:00 PM"] },
    ],
    about: "I am a licensed marriage and family therapist with over 12 years of experience helping couples and families improve their relationships. I specialize in communication issues, conflict resolution, and rebuilding trust.\n\nMy therapeutic approach integrates the Gottman Method and Emotionally Focused Therapy to help couples break negative cycles and develop more secure connections. For families, I use Family Systems Theory to address dynamics that may be contributing to conflict or distress.\n\nI believe that healthy relationships are foundational to our well-being. Whether you're navigating a specific crisis or looking to deepen your connection, I provide a supportive space where all parties feel heard and validated. My goal is to help you develop practical tools for more satisfying relationships."
  },
  {
    id: "3",
    name: "Dr. Amara Okafor",
    title: "Clinical Social Worker",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 5.0,
    reviewCount: 78,
    specialties: ["Depression", "Grief", "Life Transitions", "Identity"],
    languages: ["English"],
    yearsExperience: 5,
    location: "Boston, MA (Remote Available)",
    education: [
      { degree: "Master of Social Work (MSW)", institution: "Boston University", year: "2018" },
      { degree: "B.A. in Psychology", institution: "Tufts University", year: "2015" },
    ],
    certifications: [
      "Licensed Clinical Social Worker - Massachusetts",
      "Certified Grief Counselor",
      "Dialectical Behavior Therapy Trained"
    ],
    approach: [
      "Psychodynamic Therapy",
      "Dialectical Behavior Therapy (DBT)",
      "Grief Counseling",
      "Culturally-Responsive Therapy"
    ],
    price: 75,
    insurance: ["Blue Cross Blue Shield", "Harvard Pilgrim", "Tufts Health Plan"],
    nextAvailable: [
      { date: "Thursday, May 15", slots: ["11:00 AM", "1:00 PM", "3:00 PM"] },
      { date: "Friday, May 16", slots: ["9:00 AM", "4:00 PM"] },
      { date: "Monday, May 19", slots: ["10:00 AM", "12:00 PM", "2:00 PM"] },
    ],
    about: "I am a licensed clinical social worker passionate about helping individuals navigate through depression, grief, major life transitions, and identity exploration. With 5 years of clinical experience, I create a warm and inclusive therapeutic environment for all my clients.\n\nMy approach combines psychodynamic techniques with practical DBT skills to address both the root causes of distress and develop effective coping strategies. I believe in honoring each person's unique story while building resilience and self-compassion.\n\nWhether you're coping with loss, struggling with depression, navigating a significant change, or exploring aspects of your identity, I'm committed to walking alongside you on your journey. I particularly enjoy working with young adults, BIPOC individuals, and those navigating cultural or identity-related challenges."
  },
];

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      const foundTherapist = mockTherapists.find(t => t.id === id);
      setTherapist(foundTherapist || null);
      
      if (foundTherapist?.nextAvailable && foundTherapist.nextAvailable.length > 0) {
        setSelectedDate(foundTherapist.nextAvailable[0].date);
      }
      
      setLoading(false);
    }, 500); // Simulate API delay
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-6xl h-96 flex items-center justify-center">
          <div className="animate-pulse-subtle">
            <p className="text-gray-500">Loading therapist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Therapist Info */}
        <div className="lg:w-2/3 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src={therapist.image} 
                  alt={therapist.name}
                  className="w-full h-auto aspect-square object-cover rounded-lg"
                />
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{therapist.name}</h1>
                <p className="text-lg text-gray-600 mb-3">{therapist.title}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {Array.from({ length: Math.floor(therapist.rating) }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    {therapist.rating % 1 > 0 && (
                      <Star className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  <span className="ml-1 font-medium">{therapist.rating}</span>
                  <span className="ml-1 text-gray-500">({therapist.reviewCount} reviews)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-thera-600" />
                    <span>{therapist.yearsExperience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-thera-600" />
                    <span>{therapist.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-thera-600" />
                    <span>{therapist.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-thera-600" />
                    <span>${therapist.price} per session</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {therapist.specialties.map((specialty: string) => (
                    <span 
                      key={specialty} 
                      className="bg-thera-50 text-thera-700 text-xs px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="md:hidden mt-6 flex gap-2">
                  <Button 
                    asChild
                    className="flex-1 bg-thera-600 hover:bg-thera-700"
                    onClick={() => window.scrollTo({top: document.getElementById('booking-section')?.offsetTop || 0, behavior: 'smooth'})}
                  >
                    <Link to="#booking-section">
                      Book Session
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    className="flex-1"
                  >
                    <Link to={`/chat/${therapist.id}`}>
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Therapist Details Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <Tabs defaultValue="about">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="about" className="p-6">
                <h2 className="text-xl font-bold mb-4">About {therapist.name}</h2>
                {therapist.about.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
                ))}
                
                <h3 className="text-lg font-bold mt-6 mb-3">Therapeutic Approach</h3>
                <ul className="space-y-2">
                  {therapist.approach.map((approach: string) => (
                    <li key={approach} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-mint-500" />
                      <span>{approach}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-bold mt-6 mb-3">Insurance Accepted</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.insurance.map((insurance: string) => (
                    <span 
                      key={insurance} 
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {insurance}
                    </span>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="credentials" className="p-6">
                <h2 className="text-xl font-bold mb-4">Education & Credentials</h2>
                
                <h3 className="text-lg font-bold mb-3">Education</h3>
                <div className="space-y-4 mb-6">
                  {therapist.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-thera-200 pl-4">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-gray-600">{edu.institution}, {edu.year}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-bold mb-3">Certifications & Licenses</h3>
                <ul className="space-y-2">
                  {therapist.certifications.map((cert: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-mint-500" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Client Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex">
                      {Array.from({ length: Math.floor(therapist.rating) }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-1 font-medium">{therapist.rating}</span>
                    <span className="ml-1 text-gray-500">({therapist.reviewCount})</span>
                  </div>
                </div>
                
                {/* Mock reviews */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">1 month ago</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      "Dr. {therapist.name.split(' ')[1]} is an exceptional therapist. She really listens and offers practical advice that has helped me overcome my anxiety. I feel like I'm making real progress."
                    </p>
                    <p className="text-sm font-medium">Maria K.</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">3 months ago</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      "I appreciate how Dr. {therapist.name.split(' ')[1]} creates a safe space for me to explore difficult emotions. The video sessions are convenient, and I never feel rushed."
                    </p>
                    <p className="text-sm font-medium">James T.</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star, idx) => (
                          <Star key={star} className={`h-4 w-4 ${idx < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">5 months ago</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      "Dr. {therapist.name.split(' ')[1]} has been very helpful in my journey. The only reason for 4 stars instead of 5 is occasionally the video connection has issues, but that's more on the platform than the therapist."
                    </p>
                    <p className="text-sm font-medium">Alex W.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right Column - Booking */}
        <div className="lg:w-1/3" id="booking-section">
          <div className="bg-white rounded-xl shadow-sm sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Book a Session</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Select a Date
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {therapist.nextAvailable.map((day: any) => (
                    <Button
                      key={day.date}
                      variant={selectedDate === day.date ? "default" : "outline"}
                      className={selectedDate === day.date ? "bg-thera-600 hover:bg-thera-700" : ""}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedTime(null);
                      }}
                    >
                      {day.date}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Select a Time
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {therapist.nextAvailable
                      .find((day: any) => day.date === selectedDate)
                      ?.slots.map((time: string) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={selectedTime === time ? "bg-thera-600 hover:bg-thera-700" : ""}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <Button 
                  asChild
                  className="w-full bg-thera-600 hover:bg-thera-700"
                  disabled={!selectedDate || !selectedTime}
                >
                  <Link to={selectedDate && selectedTime ? `/checkout/${therapist.id}/${selectedDate}/${selectedTime}` : "#"}>
                    Book Session
                  </Link>
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-1/2"
                  >
                    <Link to={`/chat/${therapist.id}`}>
                      <MessageCircle className="h-4 w-4 mr-1" /> Message
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-1/2"
                  >
                    <Link to={`/video/${therapist.id}`}>
                      <Video className="h-4 w-4 mr-1" /> Quick Consult
                    </Link>
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4" /> ${therapist.price} per session
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 50-minute session
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-xl border-t border-gray-100 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                <Check className="h-4 w-4 text-mint-500" /> Secure & confidential
              </p>
              <p className="flex items-center gap-1">
                <Check className="h-4 w-4 text-mint-500" /> Cancel up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
