import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Bell, Calendar, Check, CreditCard, Globe, Lock, LogOut, Mail, MessageCircle, Pencil, Shield, Smartphone, UploadCloud, User, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const TherapistAccount = () => {
  const [profileData, setProfileData] = useState({
    name: "Dr. Morgan Riley",
    avatar: "/placeholder.svg",
    title: "Clinical Psychologist",
    email: "dr.morgan@theralink.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    languages: ["English", "Spanish"],
    specialties: [
      "Anxiety",
      "Depression",
      "Stress Management",
      "Trauma",
      "Relationship Issues"
    ],
    bio: "I am a licensed clinical psychologist with over 10 years of experience helping individuals navigate life's challenges. My approach combines cognitive-behavioral therapy, mindfulness practices, and compassion-focused techniques tailored to each client's unique needs.\n\nI believe in creating a safe, non-judgmental space where clients can explore their concerns and develop practical strategies for growth and healing."
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Account</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and account settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing & Plan</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          {/* Profile Banner */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                  <p className="text-muted-foreground">{profileData.title}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-thera-50 text-thera-700 hover:bg-thera-100">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <Shield className="h-3 w-3 mr-1" /> Licensed
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" value={profileData.title} onChange={e => setProfileData({...profileData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Input id="languages" value={profileData.languages.join(", ")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profileData.bio}
                    onChange={e => setProfileData({...profileData, bio: e.target.value})}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This bio appears on your public profile. Be descriptive about your approach and experience.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Specialties & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.map((specialty, index) => (
                    <Badge key={index} className="bg-accent text-accent-foreground">
                      {specialty}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6">
                    + Add
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Practice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Information</CardTitle>
              <CardDescription>Configure your practice details and availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="practice-name">Practice Name</Label>
                  <Input id="practice-name" defaultValue="Mind Wellness Center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" defaultValue="PSY12345" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Appointment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-length">Default Session Length</Label>
                    <div className="flex gap-2">
                      <Input id="session-length" type="number" defaultValue={50} />
                      <span className="py-2">minutes</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buffer-time">Buffer Time Between Sessions</Label>
                    <div className="flex gap-2">
                      <Input id="buffer-time" type="number" defaultValue={10} />
                      <span className="py-2">minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="advance-booking">How far in advance can clients book?</Label>
                    <div className="flex gap-2">
                      <Input id="advance-booking" type="number" defaultValue={30} />
                      <span className="py-2">days</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancel-policy">Cancellation Policy</Label>
                    <div className="flex gap-2">
                      <Input id="cancel-policy" type="number" defaultValue={24} />
                      <span className="py-2">hours notice</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Two-factor authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an additional verification step.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Authorized devices</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage the devices that have logged into your account.
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>Manage your active sessions and devices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Current Session</p>
                      <div className="text-xs text-muted-foreground">
                        <p>MacBook Pro • San Francisco, CA</p>
                        <p className="mt-0.5">Last active: Just now</p>
                      </div>
                    </div>
                  </div>
                  <Badge>Current</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <div className="text-xs text-muted-foreground">
                        <p>Mobile App • San Francisco, CA</p>
                        <p className="mt-0.5">Last active: 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Log out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your plan and billing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Professional Plan</h3>
                  <p className="text-muted-foreground">$49/month • Renews on June 12, 2025</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="destructive">Cancel Plan</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Unlimited clients</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Advanced scheduling</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Chat & video</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-muted p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#1A1F71" />
                    <path d="M9.5 15.5L8 8.5H10L11.5 15.5H9.5Z" fill="white" />
                    <path d="M13.5 8.5L11.75 13L11.25 10.5L10.75 8.5H8.75L10.5 15.5H12.5L15.25 8.5H13.5Z" fill="white" />
                    <path d="M16 8.5L14.5 15.5H16.25L17.75 8.5H16Z" fill="white" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 06/2026</p>
                </div>
                <Badge className="ml-auto">Default</Badge>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Add New</Button>
                <Button variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your recent invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Professional Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">May 12, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$49.00</p>
                    <Button variant="ghost" size="sm" className="h-8">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Invoice
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Professional Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">April 12, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$49.00</p>
                    <Button variant="ghost" size="sm" className="h-8">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Invoice
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Professional Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">March 12, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$49.00</p>
                    <Button variant="ghost" size="sm" className="h-8">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about new appointments, messages, and account updates.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex flex-row items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for appointment reminders and important updates.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex flex-row items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Customize the types of notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="appointment-requests" defaultChecked />
                    <Label htmlFor="appointment-requests">Appointment Requests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="appointment-reminders" defaultChecked />
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="client-messages" defaultChecked />
                    <Label htmlFor="client-messages">Client Messages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-notifications" defaultChecked />
                    <Label htmlFor="payment-notifications">Payment Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="system-updates" />
                    <Label htmlFor="system-updates">System Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="marketing-emails" />
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
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
