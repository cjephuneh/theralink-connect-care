
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, FileText, ExternalLink, Download, Library } from "lucide-react";

const ClientResources = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("articles");
  const [isLoading, setIsLoading] = useState(true);

  // Simulated loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample resources data (this would come from your database)
  const resources = {
    articles: [
      {
        id: 1,
        title: "Understanding Anxiety: Causes and Coping Strategies",
        description: "Learn about the root causes of anxiety and effective strategies to manage symptoms.",
        category: "Anxiety",
        url: "#",
      },
      {
        id: 2,
        title: "The Role of Mindfulness in Mental Health",
        description: "How mindfulness practices can improve mental wellbeing and reduce stress.",
        category: "Mindfulness",
        url: "#",
      },
      {
        id: 3,
        title: "Building Healthy Relationships: Communication Skills",
        description: "Develop better communication skills to enhance your relationships.",
        category: "Relationships",
        url: "#",
      },
    ],
    worksheets: [
      {
        id: 1,
        title: "Anxiety Thought Record",
        description: "Track and challenge anxious thoughts with this CBT-based worksheet.",
        fileType: "PDF",
        url: "#",
      },
      {
        id: 2,
        title: "Weekly Mood Tracker",
        description: "Monitor your emotions and identify patterns with this daily mood tracker.",
        fileType: "PDF",
        url: "#",
      },
      {
        id: 3,
        title: "Values Clarification Exercise",
        description: "Identify your core values to guide decision making and life direction.",
        fileType: "PDF",
        url: "#",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
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

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="articles" className="rounded-lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="worksheets" className="rounded-lg">
            <FileText className="mr-2 h-4 w-4" />
            Worksheets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="worksheets" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientResources;
