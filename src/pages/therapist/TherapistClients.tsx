
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Filter,
  MoreVertical,
  Plus,
  Search,
  MessageCircle,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock client data
const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    since: "Jan 2025",
    nextSession: "May 12, 3:00 PM",
    status: "active",
    concerns: ["Anxiety", "Depression"],
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg",
    email: "michael.c@example.com",
    phone: "(555) 234-5678",
    since: "Feb 2025",
    nextSession: "May 12, 4:30 PM",
    status: "active",
    concerns: ["Work Stress", "Relationships"],
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/placeholder.svg",
    email: "emily.d@example.com",
    phone: "(555) 345-6789",
    since: "Jan 2025",
    nextSession: "May 13, 10:00 AM",
    status: "active",
    concerns: ["Anxiety", "Self-Esteem"],
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg",
    email: "david.w@example.com",
    phone: "(555) 456-7890",
    since: "Mar 2025",
    nextSession: "May 14, 1:30 PM",
    status: "active",
    concerns: ["Depression", "Grief"],
  },
  {
    id: 5,
    name: "Jessica Brown",
    avatar: "/placeholder.svg",
    email: "jessica.b@example.com",
    phone: "(555) 567-8901",
    since: "Feb 2025",
    nextSession: "May 15, 11:00 AM",
    status: "active",
    concerns: ["Relationships", "Family Issues"],
  },
  {
    id: 6,
    name: "Robert Taylor",
    avatar: "/placeholder.svg",
    email: "robert.t@example.com",
    phone: "(555) 678-9012",
    since: "Mar 2025",
    nextSession: "Not scheduled",
    status: "inactive",
    concerns: ["Anxiety", "Insomnia"],
  },
  {
    id: 7,
    name: "Amanda Martinez",
    avatar: "/placeholder.svg",
    email: "amanda.m@example.com",
    phone: "(555) 789-0123",
    since: "Apr 2025",
    nextSession: "Not scheduled",
    status: "inactive",
    concerns: ["Depression", "Self-Esteem"],
  },
];

const TherapistClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [concernFilter, setConcernFilter] = useState("all");

  // Filter clients based on search query and filters
  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    // Concern filter
    const matchesConcern = concernFilter === "all" || 
                          client.concerns.some(concern => 
                            concern.toLowerCase() === concernFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesConcern;
  });

  // Get unique concerns for filtering
  const uniqueConcerns = Array.from(
    new Set(clients.flatMap(client => client.concerns))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage and view your client information.</p>
        </div>
        <Button asChild>
          <Link to="/therapist/clients/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Client
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={concernFilter} onValueChange={setConcernFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Concern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Concerns</SelectItem>
                  {uniqueConcerns.map(concern => (
                    <SelectItem key={concern} value={concern.toLowerCase()}>
                      {concern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="sm:w-10 h-10 px-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border">
                <div className="hidden md:grid grid-cols-7 p-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-2">Client</div>
                  <div>Since</div>
                  <div>Next Session</div>
                  <div>Status</div>
                  <div>Concerns</div>
                  <div className="text-right">Actions</div>
                </div>
                <Separator />
                <div className="divide-y">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="grid grid-cols-1 md:grid-cols-7 p-4 items-center gap-4">
                      <div className="col-span-2 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground hidden md:block">{client.email}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm md:flex hidden flex-col">
                        <span>{client.since}</span>
                      </div>
                      
                      <div className="text-sm md:flex hidden">
                        <span>{client.nextSession}</span>
                      </div>
                      
                      <div className="md:block hidden">
                        <Badge variant={client.status === "active" ? "default" : "outline"}>
                          {client.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 md:block hidden">
                        {client.concerns.map((concern, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between md:justify-end items-center space-x-2">
                        <div className="md:hidden flex items-center space-x-2">
                          <Badge variant={client.status === "active" ? "default" : "outline"}>
                            {client.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link to={`/chat/${client.id}`}>
                              <MessageCircle className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="ghost" asChild>
                            <Link to={`/video/${client.id}`}>
                              <Video className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                              <DropdownMenuItem>View Notes</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit Client</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Archive Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredClients.length === 0 && (
                    <div className="p-8 text-center">
                      <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <h3 className="font-medium">No clients found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <Card key={client.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium text-lg">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        <Badge 
                          variant={client.status === "active" ? "default" : "outline"}
                          className="mt-2"
                        >
                          {client.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Client since:</span>
                          <span>{client.since}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next session:</span>
                          <span className="text-right">{client.nextSession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Concerns:</span>
                          <span className="text-right">{client.concerns.join(", ")}</span>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/chat/${client.id}`}>
                              <MessageCircle className="h-4 w-4 mr-1" /> Message
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/video/${client.id}`}>
                              <Video className="h-4 w-4 mr-1" /> Video
                            </Link>
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                            <DropdownMenuItem>View Notes</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Client</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Archive Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="col-span-full p-8 text-center">
                    <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-medium">No clients found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistClients;
