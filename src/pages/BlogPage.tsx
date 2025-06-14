
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
import { Search, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

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
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllPosts(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Filter posts based on search term and category
    let filtered = allPosts;
    
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
  }, [searchTerm, activeCategory, allPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter. Thank you!",
    });
  };

  if (isLoading) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading blog posts...</div>;
  }

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
                  src={filteredPosts[0].image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"} 
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
                    {formatDate(filteredPosts[0].created_at)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3">{filteredPosts[0].title}</h2>
                <p className="text-gray-600 mb-6">{filteredPosts[0].excerpt}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{filteredPosts[0].author}</span>
                  </div>
                  <div className="text-sm text-gray-500">{calculateReadTime(filteredPosts[0].content)} min read</div>
                </div>
                
                <Button asChild className="bg-thera-600 hover:bg-thera-700">
                  <Link to={`/blog/${filteredPosts[0].id}`}>
                    Read Article
                  </Link>
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
                src={post.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize">
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">{calculateReadTime(post.content)} min read</span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{post.author}</span>
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.created_at)}
              </div>
            </CardFooter>
            <div className="px-6 pb-4">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/blog/${post.id}`}>
                  Read Article
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
          <p className="text-gray-600">Check back soon for new mental health insights and articles.</p>
        </div>
      )}

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
