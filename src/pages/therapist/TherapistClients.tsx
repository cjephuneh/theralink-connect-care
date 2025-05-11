
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, MoreHorizontal, Calendar, MessageCircle, Video, FileText, Mail, Clock, User, UserPlus } from "lucide-react";
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
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock client data
const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    status: "active",
    startDate: "2025-01-15",
    nextSession: "2025-05-15",
    sessionsCompleted: 8,
    primaryConcerns: ["Anxiety", "Work Stress"]
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg",
    email: "michael.chen@example.com",
    phone: "(555) 234-5678",
    status: "active",
    startDate: "2025-02-22",
    nextSession: "2025-05-12",
    sessionsCompleted: 4,
    primaryConcerns: ["Depression", "Relationship Issues"]
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/placeholder.svg",
    email: "emily.davis@example.com",
    phone: "(555) 345-6789",
    status: "pending",
    startDate: "2025-05-10",
    nextSession: "2025-05-13",
    sessionsCompleted: 0,
    primaryConcerns: ["Anxiety", "Life Transitions"]
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg",
    email: "david.wilson@example.com",
    phone: "(555) 456-7890",
    status: "active",
    startDate: "2025-03-18",
    nextSession: "2025-05-14",
    sessionsCompleted: 3,
    primaryConcerns: ["Trauma", "Self-esteem"]
  },
  {
    id: 5,
    name: "Jessica Brown",
    avatar: "/placeholder.svg",
    email: "jessica.brown@example.com",
    phone: "(555) 567-8901",
    status: "inactive",
    startDate: "2024-11-05",
    nextSession: null,
    sessionsCompleted: 12,
    primaryConcerns: ["Anxiety", "Depression"]
  }
];

const TherapistClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  
  const filteredClients = clients.filter(client => {
    const searchRegex = new RegExp(searchQuery, "i");
    return searchRegex.test(client.name) || 
           searchRegex.test(client.email) ||
           client.primaryConcerns.some(concern => searchRegex.test(concern));
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships and information.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter client details to create a new client record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="First name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="client@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concerns">Primary Concerns</Label>
                  <Select>
                    <SelectTrigger id="concerns">
                      <SelectValue placeholder="Select concerns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="stress">Stress</SelectItem>
                      <SelectItem value="trauma">Trauma</SelectItem>
                      <SelectItem value="relationships">Relationship Issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Input id="notes" placeholder="Optional notes about the client" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2 items-center">
            <Button 
              variant={view === "grid" ? "default" : "outline"} 
              size="icon"
              onClick={() => setView("grid")}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M4 2H2V4H4V2ZM2 1H4C4.55228 1 5 1.44772 5 2V4C5 4.55228 4.55228 5 4 5H2C1.44772 5 1 4.55228 1 4V2C1 1.44772 1.44772 1 2 1ZM9 2H7V4H9V2ZM7 1H9C9.55228 1 10 1.44772 10 2V4C10 4.55228 9.55228 5 9 5H7C6.44772 5 6 4.55228 6 4V2C6 1.44772 6.44772 1 7 1ZM14 2H12V4H14V2ZM12 1H14C14.5523 1 15 1.44772 15 2V4C15 4.55228 14.5523 5 14 5H12C11.4477 5 11 4.55228 11 4V2C11 1.44772 11.4477 1 12 1ZM4 7H2V9H4V7ZM2 6H4C4.55228 6 5 6.44772 5 7V9C5 9.55228 4.55228 10 4 10H2C1.44772 10 1 9.55228 1 9V7C1 6.44772 1.44772 6 2 6ZM9 7H7V9H9V7ZM7 6H9C9.55228 6 10 6.44772 10 7V9C10 9.55228 9.55228 10 9 10H7C6.44772 10 6 9.55228 6 9V7C6 6.44772 6.44772 6 7 6ZM14 7H12V9H14V7ZM12 6H14C14.5523 6 15 6.44772 15 7V9C15 9.55228 14.5523 10 14 10H12C11.4477 10 11 9.55228 11 9V7C11 6.44772 11.4477 6 12 6ZM4 12H2V14H4V12ZM2 11H4C4.55228 11 5 11.4477 5 12V14C5 14.5523 4.55228 15 4 15H2C1.44772 15 1 14.5523 1 14V12C1 11.4477 1.44772 11 2 11ZM9 12H7V14H9V12ZM7 11H9C9.55228 11 10 11.4477 10 12V14C10 14.5523 9.55228 15 9 15H7C6.44772 15 6 14.5523 6 14V12C6 11.4477 6.44772 11 7 11ZM14 12H12V14H14V12ZM12 11H14C14.5523 11 15 11.4477 15 12V14C15 14.5523 14.5523 15 14 15H12C11.4477 15 11 14.5523 11 14V12C11 11.4477 11.4477 11 12 11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
            <Button 
              variant={view === "table" ? "default" : "outline"} 
              size="icon"
              onClick={() => setView("table")}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M1 2C1 1.44772 1.44772 1 2 1H13C13.5523 1 14 1.44772 14 2V13C14 13.5523 13.5523 14 13 14H2C1.44772 14 1 13.5523 1 13V2ZM2 2V13H13V2H2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M2 5H13V4H2V5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M2 8H13V7H2V8Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M2 11H13V10H2V11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M5 13V5H6V13H5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M9 13V5H10V13H9Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/5">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search clients..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <Tabs defaultValue="all">
                  <TabsList className="w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-sm">Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="active-status" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="active-status" className="text-sm font-normal">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="pending-status" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="pending-status" className="text-sm font-normal">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="inactive-status" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="inactive-status" className="text-sm font-normal">Inactive</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Concerns</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="anxiety" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="anxiety" className="text-sm font-normal">Anxiety</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="depression" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="depression" className="text-sm font-normal">Depression</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="stress" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="stress" className="text-sm font-normal">Stress</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="trauma" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="trauma" className="text-sm font-normal">Trauma</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="relationships" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="relationships" className="text-sm font-normal">Relationships</Label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full md:w-4/5">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Clients ({filteredClients.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map((client) => (
                    <Card key={client.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className={`h-2 ${
                          client.status === 'active' ? 'bg-green-500' : 
                          client.status === 'pending' ? 'bg-amber-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={client.avatar} />
                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <User className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Session
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Notes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email Client
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status</span>
                              <Badge className={
                                client.status === 'active' ? 'bg-green-100 text-green-800' : 
                                client.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-gray-100 text-gray-800'
                              }>
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next Session</span>
                              <span>{formatDate(client.nextSession)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sessions</span>
                              <span>{client.sessionsCompleted}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-2">Primary Concerns</p>
                            <div className="flex flex-wrap gap-1">
                              {client.primaryConcerns.map((concern, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {concern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/therapist/clients/${client.id}`}>
                                View Details
                              </Link>
                            </Button>
                            
                            <div className="space-x-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Video className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Session</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Concerns</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client.avatar} />
                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              client.status === 'active' ? 'bg-green-100 text-green-800' : 
                              client.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'
                            }>
                              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{formatDate(client.nextSession)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{client.sessionsCompleted}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {client.primaryConcerns.map((concern, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {concern}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Video className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Notes
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email Client
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistClients;
