
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from '@/components/ui/badge';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Search, 
  RefreshCw, 
  PlusCircle, 
  FileEdit, 
  Trash2, 
  Eye, 
  Loader2,
  FilePlus,
  FileText,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const blogFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  category: z.string().min(3, { message: "Category is required" }),
  imageUrl: z.string().url({ message: "Valid image URL is required" }).optional().or(z.literal('')),
});

const resourceFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  resourceType: z.string().min(3, { message: "Resource type is required" }),
  externalUrl: z.string().url({ message: "Valid URL is required" }).optional().or(z.literal('')),
});

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [searchBlogTerm, setSearchBlogTerm] = useState('');
  const [searchResourceTerm, setSearchResourceTerm] = useState('');
  const [addBlogDialogOpen, setAddBlogDialogOpen] = useState(false);
  const [addResourceDialogOpen, setAddResourceDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const blogForm = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      imageUrl: "",
    },
  });

  const resourceForm = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      content: "",
      resourceType: "",
      externalUrl: "",
    },
  });

  useEffect(() => {
    // Check if user is admin
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Mock data for now - in a real app, this would fetch from the database
    const mockBlogs = [
      {
        id: '1',
        title: 'Understanding Anxiety Disorders',
        excerpt: 'Learn about the different types of anxiety disorders and their symptoms.',
        content: 'Anxiety disorders are the most common mental health conditions affecting millions worldwide...',
        category: 'Mental Health',
        author: 'Dr. Sarah Johnson',
        publishDate: '2025-04-15',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1682284353481-91bcbee5f11a?ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YW54aWV0eXxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '2',
        title: 'The Benefits of Mindfulness Meditation',
        excerpt: 'Discover how mindfulness meditation can improve your mental wellbeing.',
        content: 'Mindfulness meditation is a powerful practice that can help reduce stress, anxiety, and depression...',
        category: 'Self-Care',
        author: 'Dr. Michael Chen',
        publishDate: '2025-05-02',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: '3',
        title: 'Coping with Grief and Loss',
        excerpt: 'Strategies for managing grief and processing loss in healthy ways.',
        content: "Grief is a natural response to loss. Whether you're dealing with the death of a loved one...",
        category: 'Emotional Wellness',
        author: 'Dr. Emily Rodriguez',
        publishDate: '2025-05-10',
        imageUrl: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JpZWZ8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      }
    ];

    const mockResources = [
      {
        id: '1',
        title: 'Anxiety Self-Assessment Tool',
        content: 'A questionnaire to help identify anxiety symptoms and their severity.',
        resourceType: 'Assessment',
        externalUrl: 'https://example.com/anxiety-assessment'
      },
      {
        id: '2',
        title: 'Cognitive Behavioral Therapy Workbook',
        content: 'Practical exercises based on CBT principles to help manage negative thoughts.',
        resourceType: 'Worksheet',
        externalUrl: ''
      },
      {
        id: '3',
        title: 'Crisis Support Hotlines',
        content: 'A comprehensive list of mental health crisis support contacts.',
        resourceType: 'Guide',
        externalUrl: 'https://example.com/crisis-support'
      }
    ];

    setBlogs(mockBlogs);
    setIsLoadingBlogs(false);
    
    setResources(mockResources);
    setIsLoadingResources(false);
  }, [profile, navigate, toast]);

  const addBlog = (values: z.infer<typeof blogFormSchema>) => {
    // In a real app, this would send data to the database
    const newBlog = {
      id: `${blogs.length + 1}`,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      author: profile?.full_name || 'Admin',
      publishDate: new Date().toISOString().split('T')[0],
      imageUrl: values.imageUrl || '',
    };

    setBlogs([newBlog, ...blogs]);
    toast({
      title: 'Blog Post Added',
      description: 'The blog post has been successfully added',
    });
    
    setAddBlogDialogOpen(false);
    blogForm.reset();
  };

  const addResource = (values: z.infer<typeof resourceFormSchema>) => {
    // In a real app, this would send data to the database
    const newResource = {
      id: `${resources.length + 1}`,
      title: values.title,
      content: values.content,
      resourceType: values.resourceType,
      externalUrl: values.externalUrl || '',
    };

    setResources([newResource, ...resources]);
    toast({
      title: 'Resource Added',
      description: 'The resource has been successfully added',
    });
    
    setAddResourceDialogOpen(false);
    resourceForm.reset();
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    
    // In a real app, this would delete from the database
    const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
    setBlogs(updatedBlogs);
    
    toast({
      title: 'Blog Post Deleted',
      description: 'The blog post has been successfully deleted',
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;
    
    // In a real app, this would delete from the database
    const updatedResources = resources.filter(resource => resource.id !== resourceId);
    setResources(updatedResources);
    
    toast({
      title: 'Resource Deleted',
      description: 'The resource has been successfully deleted',
    });
  };

  // Filter blogs and resources based on search terms
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchBlogTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchBlogTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchBlogTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchResourceTerm.toLowerCase()) ||
    resource.resourceType.toLowerCase().includes(searchResourceTerm.toLowerCase()) ||
    resource.content.toLowerCase().includes(searchResourceTerm.toLowerCase())
  );

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      <Tabs defaultValue="blogs" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="blogs" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Self-Help Resources
          </TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blogs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search blog posts..."
                className="pl-10"
                value={searchBlogTerm}
                onChange={(e) => setSearchBlogTerm(e.target.value)}
              />
            </div>
            <Dialog open={addBlogDialogOpen} onOpenChange={setAddBlogDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-thera-600 hover:bg-thera-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Blog Post</DialogTitle>
                  <DialogDescription>
                    Create a new blog post for the mental health blog
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...blogForm}>
                  <form onSubmit={blogForm.handleSubmit(addBlog)} className="space-y-6">
                    <FormField
                      control={blogForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog post title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={blogForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Mental Health, Self-Care" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={blogForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Featured Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: URL to an image for the blog post
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={blogForm.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief summary of the blog post..." 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A short summary displayed in blog listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={blogForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your blog post content here..." 
                              className="min-h-[200px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAddBlogDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Publish Post</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                Manage blog content for mental health topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingBlogs ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading blog posts...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredBlogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <p className="text-gray-500">No blog posts found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold">{blog.title}</span>
                              <span className="text-gray-500 text-sm">{truncate(blog.excerpt, 60)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{blog.category}</Badge>
                          </TableCell>
                          <TableCell>{blog.author}</TableCell>
                          <TableCell>{blog.publishDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteBlog(blog.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Self-Help Resources Tab */}
        <TabsContent value="resources">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchResourceTerm}
                onChange={(e) => setSearchResourceTerm(e.target.value)}
              />
            </div>
            <Dialog open={addResourceDialogOpen} onOpenChange={setAddResourceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-thera-600 hover:bg-thera-700">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Self-Help Resource</DialogTitle>
                  <DialogDescription>
                    Create a new resource to help clients with mental health management
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...resourceForm}>
                  <form onSubmit={resourceForm.handleSubmit(addResource)} className="space-y-6">
                    <FormField
                      control={resourceForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter resource title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={resourceForm.control}
                        name="resourceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resource Type</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Worksheet, Guide, Assessment" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={resourceForm.control}
                        name="externalUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/resource" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Link to external resource
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={resourceForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the resource and its benefits..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAddResourceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Resource</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Self-Help Resources</CardTitle>
              <CardDescription>
                Manage downloadable content and self-help materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>External Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingResources ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading resources...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredResources.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <p className="text-gray-500">No resources found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold">{resource.title}</span>
                              <span className="text-gray-500 text-sm">{truncate(resource.content, 60)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.resourceType}</Badge>
                          </TableCell>
                          <TableCell>
                            {resource.externalUrl ? (
                              <div className="flex items-center text-blue-600">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                <span className="truncate max-w-[200px]">
                                  {resource.externalUrl}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteResource(resource.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
