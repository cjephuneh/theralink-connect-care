
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Search, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock blog data for demonstration
const BLOG_POSTS = [
  {
    id: 1,
    title: "5 Effective Strategies for Managing Anxiety in Daily Life",
    excerpt: "Anxiety can be overwhelming, but there are proven strategies to help manage it effectively in your everyday routine.",
    category: "anxiety",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Sarah Johnson",
    date: "2025-05-05",
    readTime: 5
  },
  {
    id: 2,
    title: "Understanding the Connection Between Sleep and Mental Health",
    excerpt: "The quality of your sleep has a profound impact on your mental wellbeing. Learn about this crucial connection and how to improve both.",
    category: "wellness",
    image: "https://images.unsplash.com/photo-1579710039144-85d6bdffddc9?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Michael Chen",
    date: "2025-04-28",
    readTime: 7
  },
  {
    id: 3,
    title: "Building Healthy Relationships: Communication Techniques That Work",
    excerpt: "Effective communication forms the foundation of healthy relationships. Discover proven techniques to enhance your connections with others.",
    category: "relationships",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Amanda Taylor",
    date: "2025-04-15",
    readTime: 6
  },
  {
    id: 4,
    title: "The Science Behind Mindfulness Meditation",
    excerpt: "Research continues to uncover the powerful benefits of mindfulness meditation for both mental and physical health.",
    category: "mindfulness",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80",
    author: "Dr. James Wilson",
    date: "2025-04-02",
    readTime: 8
  },
  {
    id: 5,
    title: "Recognizing Signs of Depression: When to Seek Help",
    excerpt: "Understanding the difference between temporary sadness and clinical depression is crucial for timely intervention and support.",
    category: "depression",
    image: "https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Emily Rodriguez",
    date: "2025-03-20",
    readTime: 6
  },
  {
    id: 6,
    title: "Trauma-Informed Care: A Guide for Healthcare Professionals",
    excerpt: "Learn how to provide effective care that acknowledges the impact of trauma on patients' lives and promotes healing.",
    category: "trauma",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Robert Kim",
    date: "2025-03-10",
    readTime: 9
  },
];

const CATEGORIES = [
  { value: "all", label: "All Topics" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "relationships", label: "Relationships" },
  { value: "trauma", label: "Trauma" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "wellness", label: "Wellness" },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);
  const { toast } = useToast();

  useEffect(() => {
    // Filter posts based on search term and category
    let filtered = BLOG_POSTS;
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, activeCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter. Thank you!",
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Insights, research, and practical advice from our expert therapists to support your mental health journey.
        </p>
      </div>

      {/* Search and Categories */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start mb-2">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="whitespace-nowrap">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {CATEGORIES.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles found. Try a different search term or category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Featured Article */}
      {filteredPosts.length > 0 && (
        <div className="mb-16">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img 
                  src={filteredPosts[0].image} 
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize">
                    {filteredPosts[0].category}
                  </Badge>
                  <span className="ml-3 text-gray-500 flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(filteredPosts[0].date)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3">{filteredPosts[0].title}</h2>
                <p className="text-gray-600 mb-6">{filteredPosts[0].excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">{filteredPosts[0].author}</div>
                  <div className="text-sm text-gray-500">{filteredPosts[0].readTime} min read</div>
                </div>
                
                <Button className="mt-6 bg-thera-600 hover:bg-thera-700">
                  Read Article
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.slice(1).map((post) => (
          <Card key={post.id} className="overflow-hidden border-0 shadow hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize">
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">{post.readTime} min read</span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2">
              <div className="text-sm font-medium">{post.author}</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.date)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-20 bg-thera-50 rounded-lg p-8 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 mb-6">Get the latest mental health insights and tips delivered to your inbox.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow"
          />
          <Button onClick={handleSubscribe} className="bg-thera-600 hover:bg-thera-700">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
