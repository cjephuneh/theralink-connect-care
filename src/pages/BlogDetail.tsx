
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading blog post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/blog">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      {post.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize">
            {post.category}
          </Badge>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {calculateReadTime(post.content)} min read
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {post.content}
        </div>
      </div>

      {/* Article Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Written by {post.author}</p>
              <p className="text-sm text-gray-500">Published on {formatDate(post.created_at)}</p>
            </div>
          </div>
          
          <Link to="/blog">
            <Button variant="outline">
              View More Articles
            </Button>
          </Link>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-16 bg-thera-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
        <p className="text-gray-600 mb-6">Subscribe to our newsletter for more mental health insights and tips.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thera-500"
          />
          <Button className="bg-thera-600 hover:bg-thera-700">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
