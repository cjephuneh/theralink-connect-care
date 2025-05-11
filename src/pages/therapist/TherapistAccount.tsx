
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Bell, Calendar, Camera, Check, CheckCircle, CreditCard, Globe, Lock, LogOut, Mail, MessageCircle, Pencil, Shield, Smartphone, UploadCloud, User, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const TherapistAccount = () => {
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, name: "License Certificate.pdf", status: "verified" },
    { id: 2, name: "Professional Liability Insurance.pdf", status: "verified" }
  ]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground mt-1">Manage your professional profile and account information.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="sessions">Past Sessions</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Professional Profile</CardTitle>
                    <CardDescription>
                      This information will be displayed on your public profile.
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Pencil className="mr-2 h-4 w-4" />
                    )}
                    {isEditingProfile ? "Save" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-2">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <Button 
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        variant="secondary"
                        size="icon"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 text-center">
                      <Badge className="mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Member since Jan 2025
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isEditingProfile ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Dr. Morgan Smith" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title">Professional Title</Label>
                            <Input id="title" defaultValue="Licensed Clinical Psychologist" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="dr.morgan@theralink.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue="(555) 123-4567" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="license">License Number</Label>
                            <Input id="license" defaultValue="PSY12345" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" defaultValue="New York, NY" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">Dr. Morgan Smith</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Professional Title</p>
                            <p className="font-medium">Licensed Clinical Psychologist</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">dr.morgan@theralink.com</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium">(555) 123-4567</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">License Number</p>
                            <p className="font-medium">PSY12345</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">New York, NY</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div>
                      {isEditingProfile ? (
                        <div className="space-y-2">
                          <Label htmlFor="bio">Professional Bio</Label>
                          <Textarea 
                            id="bio" 
                            defaultValue="Dr. Morgan Smith is a licensed clinical psychologist with over 10 years of experience specializing in anxiety, depression, and relationship issues. Dr. Smith utilizes evidence-based approaches including Cognitive Behavioral Therapy (CBT), mindfulness, and solution-focused methods."
                            className="min-h-[120px]"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Professional Bio</p>
                          <p>
                            Dr. Morgan Smith is a licensed clinical psychologist with over 10 years of experience 
                            specializing in anxiety, depression, and relationship issues. Dr. Smith utilizes 
                            evidence-based approaches including Cognitive Behavioral Therapy (CBT), mindfulness, 
                            and solution-focused methods.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {isEditingProfile ? (
                        <div className="space-y-2">
                          <Label htmlFor="specialties">Specialties</Label>
                          <Textarea 
                            id="specialties" 
                            defaultValue="Anxiety, Depression, Relationship Issues, Trauma, LGBTQ+ Issues, Work Stress"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter specialties separated by commas
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-2">
                            {["Anxiety", "Depression", "Relationship Issues", "Trauma", "LGBTQ+ Issues", "Work Stress"].map((specialty, idx) => (
                              <Badge key={idx} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Therapy Approach</CardTitle>
                <CardDescription>
                  Describe your therapeutic approaches and treatment methods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="approaches">Therapy Approaches</Label>
                      <Textarea 
                        id="approaches" 
                        defaultValue="Cognitive Behavioral Therapy (CBT), Mindfulness-Based Cognitive Therapy (MBCT), Solution-Focused Brief Therapy (SFBT), Acceptance and Commitment Therapy (ACT)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Languages Spoken</Label>
                        <Input id="language" defaultValue="English, Spanish" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age-groups">Age Groups</Label>
                        <Input id="age-groups" defaultValue="Adults (18+), Seniors (65+)" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Therapy Approaches</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Cognitive Behavioral Therapy (CBT)</li>
                        <li>Mindfulness-Based Cognitive Therapy (MBCT)</li>
                        <li>Solution-Focused Brief Therapy (SFBT)</li>
                        <li>Acceptance and Commitment Therapy (ACT)</li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                      <div>
                        <h4 className="font-medium mb-1">Languages Spoken</h4>
                        <p className="text-muted-foreground">English, Spanish</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Age Groups</h4>
                        <p className="text-muted-foreground">Adults (18+), Seniors (65+)</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Verification Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your professional licenses and verification status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verification Complete</h3>
                      <p className="text-sm text-muted-foreground">
                        Your professional credentials have been verified
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600">
                    Verified
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
                  <div className="space-y-3">
                    {uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-5 w-5 text-primary"
                            >
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <path d="M14 2v6h6" />
                              <path d="M16 13H8" />
                              <path d="M16 17H8" />
                              <path d="M10 9H8" />
                            </svg>
                          </div>
                          <span>{doc.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4" variant="outline">
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Upload New Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription>
                          Upload additional professional verification documents.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="doc-type">Document Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="license">License Certificate</SelectItem>
                              <SelectItem value="insurance">Professional Liability Insurance</SelectItem>
                              <SelectItem value="certification">Professional Certification</SelectItem>
                              <SelectItem value="id">Government ID</SelectItem>
                              <SelectItem value="other">Other Documentation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Upload File</Label>
                          <div className="border-2 border-dashed rounded-md p-6 text-center">
                            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm mb-1">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, JPG, or PNG (max. 10MB)
                            </p>
                            <Input
                              type="file"
                              className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Upload Document</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Verification Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">License Number</p>
                      <p className="font-medium">PSY12345</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License State/Region</p>
                      <p className="font-medium">New York</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Type</p>
                      <p className="font-medium">Licensed Clinical Psychologist</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Expiration</p>
                      <p className="font-medium">December 31, 2027</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Communication Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications and updates via email
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive urgent notifications via text message
                      </p>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional offers and updates
                      </p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visibility Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="directory-listing">Therapist Directory Listing</Label>
                      <p className="text-sm text-muted-foreground">
                        Appear in the public therapist directory
                      </p>
                    </div>
                    <Switch id="directory-listing" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="availability-visibility">Show Availability</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your available appointment slots to clients
                      </p>
                    </div>
                    <Switch id="availability-visibility" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-md">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Two-factor authentication is not enabled</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                  </div>
                  <Button>Enable</Button>
                </div>
                
                <div className="pt-2">
                  <RadioGroup defaultValue="none">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <div className="space-y-1">
                        <Label htmlFor="none">None</Label>
                        <p className="text-sm text-muted-foreground">
                          No additional protection beyond your password
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 mt-4">
                      <RadioGroupItem value="app" id="app" />
                      <div className="space-y-1">
                        <Label htmlFor="app">Authenticator App</Label>
                        <p className="text-sm text-muted-foreground">
                          Use an app like Google Authenticator
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 mt-4">
                      <RadioGroupItem value="sms" id="sms" />
                      <div className="space-y-1">
                        <Label htmlFor="sms">SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive codes via text message
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage account recovery options and account status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Mail className="h-4 w-4" />
                    Update Recovery Email
                  </Button>
                  
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Smartphone className="h-4 w-4" />
                    Update Phone Number
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <div className="flex gap-3 items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      Active
                    </Badge>
                    <span className="text-sm text-muted-foreground">Your account is in good standing</span>
                  </div>
                  
                  <Button variant="destructive" className="mt-6 gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Past Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                View your past therapy sessions and details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="30">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="180">Last 6 months</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search sessions..." className="pl-9 w-full md:w-auto" />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="hidden md:grid grid-cols-5 p-3 text-sm font-medium text-muted-foreground">
                    <div>Client</div>
                    <div>Date & Time</div>
                    <div>Type</div>
                    <div>Duration</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        client: "Sarah Johnson",
                        avatar: "/placeholder.svg",
                        date: "May 10, 2025",
                        time: "3:00 PM",
                        type: "video",
                        duration: "50 minutes"
                      },
                      {
                        client: "Michael Chen",
                        avatar: "/placeholder.svg",
                        date: "May 8, 2025",
                        time: "4:30 PM",
                        type: "video",
                        duration: "50 minutes"
                      },
                      {
                        client: "Emily Davis",
                        avatar: "/placeholder.svg",
                        date: "May 5, 2025",
                        time: "10:00 AM",
                        type: "chat",
                        duration: "30 minutes"
                      },
                      {
                        client: "Sarah Johnson",
                        avatar: "/placeholder.svg",
                        date: "May 3, 2025",
                        time: "3:00 PM",
                        type: "video",
                        duration: "50 minutes"
                      },
                      {
                        client: "David Wilson",
                        avatar: "/placeholder.svg",
                        date: "Apr 30, 2025",
                        time: "1:30 PM",
                        type: "video",
                        duration: "50 minutes"
                      },
                    ].map((session, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 p-3 gap-3 md:gap-0 items-center">
                        <div className="flex items-center gap-3 md:col-span-1 col-span-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.avatar} />
                            <AvatarFallback>{session.client.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{session.client}</span>
                        </div>
                        
                        <div className="md:col-span-1 col-span-2 flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{session.date}, {session.time}</span>
                        </div>
                        
                        <div className="md:col-span-1 col-span-2">
                          <Badge variant={session.type === "video" ? "default" : "outline"}>
                            {session.type === "video" ? (
                              <Video className="h-3 w-3 mr-1" />
                            ) : (
                              <MessageCircle className="h-3 w-3 mr-1" />
                            )}
                            {session.type === "video" ? "Video" : "Chat"}
                          </Badge>
                        </div>
                        
                        <div className="md:col-span-1 col-span-2 text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground inline-block" />
                          {session.duration}
                        </div>
                        
                        <div className="md:col-span-1 col-span-2 flex gap-2">
                          <Button variant="outline" size="sm">
                            View Notes
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Details</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Session Details</DialogTitle>
                                <DialogDescription>
                                  Session with {session.client} on {session.date}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-3">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={session.avatar} />
                                    <AvatarFallback>{session.client.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{session.client}</h4>
                                    <p className="text-sm text-muted-foreground">Client</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">{session.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Time</p>
                                    <p className="font-medium">{session.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">{session.duration}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium capitalize">{session.type} session</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Session Notes</p>
                                  <Card>
                                    <CardContent className="p-3 text-sm">
                                      <p>Continued work on anxiety management techniques. Client reported using deep breathing exercises successfully during stressful situations at work.</p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button>Download Summary</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">Load More Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistAccount;
