
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Filter, FolderPlus, Upload, Plus, MoreHorizontal, Download, Eye, Edit, Trash2, FileImage, FileCheck, FileLock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock document data
const documents = [
  {
    id: 1,
    name: "Intake Assessment - Sarah Johnson.pdf",
    type: "assessment",
    client: "Sarah Johnson",
    sharedWithClient: true,
    date: "2025-05-01",
    size: "1.2 MB",
    icon: FileCheck
  },
  {
    id: 2,
    name: "Progress Notes - Michael Chen - Session 4.pdf",
    type: "notes",
    client: "Michael Chen",
    sharedWithClient: false,
    date: "2025-04-28",
    size: "520 KB",
    icon: FileText
  },
  {
    id: 3,
    name: "Anxiety Worksheet.pdf",
    type: "worksheet",
    client: null,
    sharedWithClient: false,
    date: "2025-04-15",
    size: "850 KB",
    icon: FileText
  },
  {
    id: 4,
    name: "Treatment Plan - Emily Davis.pdf",
    type: "plan",
    client: "Emily Davis",
    sharedWithClient: true,
    date: "2025-04-10",
    size: "760 KB",
    icon: FileCheck
  },
  {
    id: 5,
    name: "CBT Techniques Reference.pdf",
    type: "resource",
    client: null,
    sharedWithClient: false,
    date: "2025-03-22",
    size: "1.5 MB",
    icon: FileText
  },
  {
    id: 6,
    name: "HIPAA Compliance Certificate.pdf",
    type: "certificate",
    client: null,
    sharedWithClient: false,
    date: "2025-01-15",
    size: "950 KB",
    icon: FileLock
  },
  {
    id: 7,
    name: "Stress Management Diagram.jpg",
    type: "image",
    client: null,
    sharedWithClient: true,
    date: "2025-02-18",
    size: "1.8 MB",
    icon: FileImage
  }
];

// Category data for the filter
const categories = [
  { value: "all", label: "All Documents" },
  { value: "assessment", label: "Assessments" },
  { value: "notes", label: "Session Notes" },
  { value: "plan", label: "Treatment Plans" },
  { value: "worksheet", label: "Worksheets" },
  { value: "resource", label: "Resources" },
  { value: "certificate", label: "Certificates" }
];

const TherapistDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.client && doc.client.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your clinical documents and resources.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>
                  Select the type of document you want to create or upload.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Create New Document</div>
                      <div className="text-sm text-muted-foreground">Start with a blank document or template</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Upload Document</div>
                      <div className="text-sm text-muted-foreground">Upload an existing document from your device</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-center">
                    <FolderPlus className="h-5 w-5 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Create Folder</div>
                      <div className="text-sm text-muted-foreground">Organize your documents into folders</div>
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document from your device.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                  <Upload className="h-8 w-8 mb-4 mx-auto text-muted-foreground" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG or PNG (max. 10MB)
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="client">Associate with client (optional)</Label>
                  <Input id="client" placeholder="Select client" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Select category" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" id="share" className="w-4 h-4" />
                  <Label htmlFor="share">Share with client</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled>Upload Document</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 lg:w-1/5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {categories.map(category => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4 lg:w-4/5">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>{categories.find(c => c.value === selectedCategory)?.label || "All Documents"}</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search documents..." 
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {filteredDocuments.length} {filteredDocuments.length === 1 ? "document" : "documents"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-end mb-4">
                  <TabsList>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <div className="bg-muted/30 p-6 flex flex-col items-center justify-center">
                          <doc.icon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">{doc.name}</p>
                              {doc.client && (
                                <p className="text-muted-foreground text-xs mt-1">Client: {doc.client}</p>
                              )}
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <span>{formatDate(doc.date)}</span>
                                <span className="mx-1">•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" /> Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {doc.sharedWithClient ? (
                                    <>
                                      <FileLock className="mr-2 h-4 w-4" /> Make Private
                                    </>
                                  ) : (
                                    <>
                                      <FileCheck className="mr-2 h-4 w-4" /> Share with Client
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {doc.sharedWithClient && (
                            <Badge variant="outline" className="mt-2 text-xs bg-muted/50">
                              Shared with client
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="table" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Name</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <doc.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                                <span>{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{doc.client || "—"}</TableCell>
                            <TableCell>{formatDate(doc.date)}</TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>
                              {doc.sharedWithClient ? (
                                <Badge variant="outline" className="bg-muted/50">Shared</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted/10">Private</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {doc.sharedWithClient ? (
                                      <>
                                        <FileLock className="mr-2 h-4 w-4" /> Make Private
                                      </>
                                    ) : (
                                      <>
                                        <FileCheck className="mr-2 h-4 w-4" /> Share with Client
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistDocuments;
