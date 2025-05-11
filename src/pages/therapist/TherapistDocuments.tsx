
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  File,
  FileText,
  Filter,
  FolderIcon,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Star,
  Upload,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock document data
const documents = [
  {
    id: 1,
    name: "Client Intake Form.pdf",
    type: "PDF",
    size: "245 KB",
    modified: "May 10, 2025",
    client: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
    },
    category: "Forms",
    starred: true,
  },
  {
    id: 2,
    name: "Therapy Agreement.docx",
    type: "DOCX",
    size: "128 KB",
    modified: "May 8, 2025",
    client: null,
    category: "Templates",
    starred: false,
  },
  {
    id: 3,
    name: "Session Notes - Michael Chen.pdf",
    type: "PDF",
    size: "312 KB",
    modified: "May 5, 2025",
    client: {
      name: "Michael Chen",
      avatar: "/placeholder.svg",
    },
    category: "Notes",
    starred: true,
  },
  {
    id: 4,
    name: "Anxiety Assessment.pdf",
    type: "PDF",
    size: "156 KB",
    modified: "Apr 28, 2025",
    client: {
      name: "Emily Davis",
      avatar: "/placeholder.svg",
    },
    category: "Assessments",
    starred: false,
  },
  {
    id: 5,
    name: "Consent for Telehealth.pdf",
    type: "PDF",
    size: "98 KB",
    modified: "Apr 25, 2025",
    client: null,
    category: "Forms",
    starred: false,
  },
  {
    id: 6,
    name: "Depression Screening.pdf",
    type: "PDF",
    size: "134 KB",
    modified: "Apr 20, 2025",
    client: {
      name: "David Wilson",
      avatar: "/placeholder.svg",
    },
    category: "Assessments",
    starred: false,
  },
  {
    id: 7,
    name: "Session Notes - Emily Davis.pdf",
    type: "PDF",
    size: "287 KB",
    modified: "Apr 15, 2025",
    client: {
      name: "Emily Davis",
      avatar: "/placeholder.svg",
    },
    category: "Notes",
    starred: false,
  },
  {
    id: 8,
    name: "HIPAA Notice.pdf",
    type: "PDF",
    size: "178 KB",
    modified: "Apr 10, 2025",
    client: null,
    category: "Forms",
    starred: true,
  },
];

// Document categories
const categories = [
  { name: "All Documents", count: documents.length },
  { name: "Forms", count: documents.filter(d => d.category === "Forms").length },
  { name: "Notes", count: documents.filter(d => d.category === "Notes").length },
  { name: "Assessments", count: documents.filter(d => d.category === "Assessments").length },
  { name: "Templates", count: documents.filter(d => d.category === "Templates").length },
];

// Get file icon based on type
const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "DOCX":
      return <FileText className="h-8 w-8 text-blue-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

const TherapistDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Documents");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [starredFilter, setStarredFilter] = useState(false);
  
  // Filter documents based on search query, category, and starred status
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === "All Documents" || doc.category === selectedCategory;
    
    // Starred filter
    const matchesStarred = !starredFilter || doc.starred;
    
    return matchesSearch && matchesCategory && matchesStarred;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your forms, templates, and client documents.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document to your secure document storage.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 font-medium">Drag and drop files here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Supported formats: PDF, DOCX, JPG, PNG. Max size: 5MB</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>
                  Create a new document from a template or from scratch.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                      <h3 className="font-medium">Client Intake Form</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Standard intake form for new clients
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <h3 className="font-medium">Session Notes</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Template for therapy session notes
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                      <h3 className="font-medium">Treatment Plan</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Client treatment plan template
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <File className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="font-medium">Blank Document</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a document from scratch
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <FolderIcon className="mr-2 h-4 w-4" />
                  {category.name}
                  <Badge variant="outline" className="ml-auto">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <Separator className="my-4" />
            <Button
              variant={starredFilter ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setStarredFilter(!starredFilter)}
            >
              <Star className={`mr-2 h-4 w-4 ${starredFilter ? "fill-yellow-400 text-yellow-400" : ""}`} />
              Starred
              <Badge variant="outline" className="ml-auto">
                {documents.filter(d => d.starred).length}
              </Badge>
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>{selectedCategory}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-accent" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-accent" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center p-8">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No documents found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="rounded-md border">
                <div className="hidden md:grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Client</div>
                  <div className="col-span-2">Modified</div>
                  <div className="col-span-1">Size</div>
                  <div className="col-span-1"></div>
                </div>
                <Separator />
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="grid grid-cols-12 p-4 items-center hover:bg-accent/50 transition-colors"
                  >
                    <div className="col-span-12 md:col-span-5 flex items-center gap-3 mb-2 md:mb-0">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{doc.name}</p>
                          {doc.starred && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {doc.modified} · {doc.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-span-6 md:col-span-3">
                      {doc.client ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={doc.client.avatar} />
                            <AvatarFallback>{doc.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm hidden md:inline">{doc.client.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 hidden md:block">
                      <span className="text-sm">{doc.modified}</span>
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 hidden md:block">
                      <span className="text-sm">{doc.size}</span>
                    </div>
                    
                    <div className="col-span-6 md:col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" /> {doc.starred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 justify-between">
                              <p className="font-medium truncate">{doc.name}</p>
                              {doc.starred && (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.category} · {doc.size}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {doc.client ? (
                              <>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={doc.client.avatar} />
                                  <AvatarFallback>{doc.client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs truncate max-w-[100px]">{doc.client.name}</span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">No client</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{doc.modified}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="p-2 flex justify-between">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Download className="h-3 w-3 mr-1" /> Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" /> {doc.starred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistDocuments;
