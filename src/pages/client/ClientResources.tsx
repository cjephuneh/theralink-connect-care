
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, ExternalLink, Download, Library, Search, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

const ClientResources = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("articles");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState({
    articles: [],
    worksheets: [],
    videos: []
  });

  const form = useForm({
    defaultValues: {
      query: ""
    }
  });

  // Function to fetch resources based on the search query
  const fetchResources = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    toast({
      title: "Searching resources",
      description: `Finding resources for "${query}"`,
    });

    try {
      // Mock data - in a real app this would call an API
      setTimeout(() => {
        // Sample data for demo purposes
        const topicKeywords = query.toLowerCase().split(" ");
        
        const articles = generateArticles(query);
        const worksheets = generateWorksheets(query);
        const videos = generateVideos(query);

        setResources({
          articles,
          worksheets,
          videos
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Generate sample articles based on query
  const generateArticles = (query) => {
    return [
      {
        id: 1,
        title: `Understanding ${query}: A Guide`,
        description: `A comprehensive guide to understanding ${query} and its impact on mental health.`,
        category: "Mental Health",
        url: "#",
      },
      {
        id: 2,
        title: `${query} Management Techniques`,
        description: `Learn effective strategies for managing ${query} in your daily life.`,
        category: "Self Help",
        url: "#",
      },
      {
        id: 3,
        title: `The Science Behind ${query}`,
        description: `Research-backed information about ${query} and its psychological aspects.`,
        category: "Research",
        url: "#",
      },
    ];
  };

  // Generate sample worksheets based on query
  const generateWorksheets = (query) => {
    return [
      {
        id: 1,
        title: `${query} Self-Assessment Worksheet`,
        description: `A worksheet to help you assess and understand your ${query}.`,
        fileType: "PDF",
        url: "#",
      },
      {
        id: 2,
        title: `Weekly ${query} Tracker`,
        description: `Track your progress and identify patterns related to ${query}.`,
        fileType: "PDF",
        url: "#",
      },
      {
        id: 3,
        title: `${query} Management Plan`,
        description: `Create a personalized plan to address your ${query} concerns.`,
        fileType: "PDF",
        url: "#",
      },
    ];
  };

  // Generate sample videos based on query
  const generateVideos = (query) => {
    return [
      {
        id: 1,
        title: `Understanding ${query} - A Therapist's Perspective`,
        description: `Professional insights on ${query} and its impact on wellbeing.`,
        thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      },
      {
        id: 2,
        title: `${query} Management Techniques - Practical Guide`,
        description: `Learn practical techniques to manage ${query} in your daily life.`,
        thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg", 
        videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0"
      },
      {
        id: 3,
        title: `Expert Talk: ${query} and Mental Health`,
        description: `Expert discussion on how ${query} relates to overall mental health.`,
        thumbnailUrl: "https://i.ytimg.com/vi/QH2-TGUlwu4/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=QH2-TGUlwu4"
      }
    ];
  };

  const onSubmit = (data) => {
    setSearchQuery(data.query);
    fetchResources(data.query);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Resources</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <Library className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Therapy Resources</h1>
          <p className="text-muted-foreground">Helpful materials to support your therapy journey</p>
        </div>
      </div>

      {/* Search form */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Find Resources</CardTitle>
          <CardDescription>
            Tell us what you're looking for and we'll find relevant resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Example: anxiety, stress management, mindfulness..."
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Search Resources</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="articles" className="rounded-lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="worksheets" className="rounded-lg">
            <FileText className="mr-2 h-4 w-4" />
            Worksheets
          </TabsTrigger>
          <TabsTrigger value="videos" className="rounded-lg">
            <Youtube className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="mt-6">
          {!searchQuery ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Search for resources</h3>
              <p className="text-muted-foreground">
                Enter a topic above to find relevant articles
              </p>
            </div>
          ) : resources.articles.length === 0 ? (
            <div className="text-center py-12">
              <p>No articles found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.articles.map((article) => (
                <Card key={article.id} className="overflow-hidden card-shadow group hover:shadow-md transition-all duration-300 border-t-4 border-t-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </div>
                    <CardDescription className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {article.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/20 pt-2">
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10 transition-colors" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Read Article
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="worksheets" className="mt-6">
          {!searchQuery ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Search for resources</h3>
              <p className="text-muted-foreground">
                Enter a topic above to find relevant worksheets
              </p>
            </div>
          ) : resources.worksheets.length === 0 ? (
            <div className="text-center py-12">
              <p>No worksheets found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.worksheets.map((worksheet) => (
                <Card key={worksheet.id} className="overflow-hidden card-shadow group hover:shadow-md transition-all duration-300 border-t-4 border-t-secondary/50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                        {worksheet.fileType}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{worksheet.description}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/20 pt-2">
                    <Button variant="ghost" className="w-full group-hover:bg-secondary/10 transition-colors" asChild>
                      <a href={worksheet.url} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          {!searchQuery ? (
            <div className="text-center py-12">
              <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Search for resources</h3>
              <p className="text-muted-foreground">
                Enter a topic above to find relevant videos
              </p>
            </div>
          ) : resources.videos.length === 0 ? (
            <div className="text-center py-12">
              <p>No videos found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.videos.map((video) => (
                <Card key={video.id} className="overflow-hidden card-shadow group hover:shadow-md transition-all duration-300 border-t-4 border-t-primary/50">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <Youtube className="h-12 w-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/20 pt-2">
                    <Button variant="ghost" className="w-full group-hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors" asChild>
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch Video
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientResources;
