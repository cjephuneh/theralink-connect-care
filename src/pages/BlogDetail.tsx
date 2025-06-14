
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
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

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    if (!id) return;
    
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
        <p className="mt-4">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize mb-4">
            {post.category}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          
          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{calculateReadTime(post.content)} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image_url && (
          <div className="mb-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
            {post.content}
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-thera-50 text-thera-700 border-thera-200 capitalize">
                {post.category}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(post.updated_at)}
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Button asChild className="bg-thera-600 hover:bg-thera-700">
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
