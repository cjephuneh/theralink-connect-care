
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Bell, Calendar, CreditCard, Globe, Laptop, Lock, Mail, Save, Shield, Smartphone, Download, Video, Badge } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const TherapistSettings = () => {
  const [timezoneOpen, setTimezoneOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and settings.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your professional information visible to clients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Dr. Morgan Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue="Licensed Clinical Psychologist" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="dr.morgan@theralink.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    className="min-h-[100px]"
                    defaultValue="Dr. Morgan Smith is a licensed clinical psychologist with over 10 years of experience specializing in anxiety, depression, and relationship issues. Dr. Smith utilizes evidence-based approaches including Cognitive Behavioral Therapy (CBT), mindfulness, and solution-focused methods."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialities">Areas of Specialization</Label>
                  <Textarea
                    id="specialities"
                    defaultValue="Anxiety, Depression, Relationship Issues, Trauma, LGBTQ+ Issues, Work Stress"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter specialties separated by commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" defaultValue="PSY12345" />
                </div>
                
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Language & Timezone</CardTitle>
                <CardDescription>
                  Set your preferred language and timezone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      defaultValue="America/New_York"
                      onOpenChange={setTimezoneOpen}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {!timezoneOpen ? null : (
                          <>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                            <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="format24" />
                  <label
                    htmlFor="format24"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use 24-hour time format
                  </label>
                </div>
                
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Manage how clients can contact you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-messaging">Allow Messaging</Label>
                      <p className="text-sm text-muted-foreground">
                        Clients can message you through the platform
                      </p>
                    </div>
                    <Switch id="allow-messaging" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-scheduling">Allow Direct Scheduling</Label>
                      <p className="text-sm text-muted-foreground">
                        Clients can book appointments without approval
                      </p>
                    </div>
                    <Switch id="allow-scheduling" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-phone">Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your phone number on your profile
                      </p>
                    </div>
                    <Switch id="show-phone" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your email address on your profile
                      </p>
                    </div>
                    <Switch id="show-email" />
                  </div>
                </div>
                
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> Email Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-appointments" className="flex-1">
                      New appointment bookings
                    </Label>
                    <Switch id="email-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders" className="flex-1">
                      Appointment reminders (24 hours before)
                    </Label>
                    <Switch id="email-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-cancellations" className="flex-1">
                      Appointment cancellations
                    </Label>
                    <Switch id="email-cancellations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-messages" className="flex-1">
                      New client messages
                    </Label>
                    <Switch id="email-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-system" className="flex-1">
                      System updates and announcements
                    </Label>
                    <Switch id="email-system" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" /> Push Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-appointments" className="flex-1">
                      New appointment bookings
                    </Label>
                    <Switch id="push-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminders" className="flex-1">
                      Appointment reminders
                    </Label>
                    <Switch id="push-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-messages" className="flex-1">
                      New client messages
                    </Label>
                    <Switch id="push-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-cancellations" className="flex-1">
                      Appointment cancellations
                    </Label>
                    <Switch id="push-cancellations" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Bell className="h-4 w-4 mr-2" /> Notification Frequency
                </h3>
                <div className="space-y-4">
                  <RadioGroup defaultValue="real-time">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="real-time" id="r1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="r1">Real-time</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications as events happen
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="daily" id="r2" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="r2">Daily digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a daily summary of notifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="none" id="r3" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="r3">Turn off all</Label>
                        <p className="text-sm text-muted-foreground">
                          Don't receive any notifications
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>
                Set your working hours and appointment preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> Working Hours
                  </h3>
                  <Button variant="outline" size="sm">
                    Copy to All Days
                  </Button>
                </div>
                
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="grid grid-cols-[1fr_3fr] gap-4 items-center">
                    <Label>{day}</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Select defaultValue="9:00">
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["8:00", "8:30", "9:00", "9:30", "10:00"].map((time) => (
                              <SelectItem key={time} value={time}>{time} AM</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>to</span>
                        <Select defaultValue="17:00">
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["4:00", "4:30", "5:00", "5:30", "6:00"].map((time) => (
                              <SelectItem key={time} value={time}>{time} PM</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="sm">
                        Add Break
                      </Button>
                    </div>
                  </div>
                ))}
                
                {["Saturday", "Sunday"].map((day) => (
                  <div key={day} className="grid grid-cols-[1fr_3fr] gap-4 items-center">
                    <Label>{day}</Label>
                    <div className="flex items-center gap-2">
                      <Switch id={`available-${day.toLowerCase()}`} />
                      <Label htmlFor={`available-${day.toLowerCase()}`}>Available</Label>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Session Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Default Session Duration</Label>
                    <Select defaultValue="50">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="50">50 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buffer-time">Buffer Time Between Sessions</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advance-booking">Advance Booking Window</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimum-notice">Minimum Notice Required</Label>
                    <Select defaultValue="24">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="confirmation">Require Confirmation</Label>
                      <p className="text-sm text-muted-foreground">
                        Manually approve each booking request
                      </p>
                    </div>
                    <Switch id="confirmation" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="intake-form">Require Intake Form</Label>
                      <p className="text-sm text-muted-foreground">
                        New clients must complete an intake form before booking
                      </p>
                    </div>
                    <Switch id="intake-form" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Save Schedule Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>
                  Update your password and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Update Password
                </Button>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" /> Two-Factor Authentication
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Two-factor authentication is recommended</AlertTitle>
                      <AlertDescription>
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </AlertDescription>
                    </Alert>
                    
                    <RadioGroup defaultValue="disabled">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="disabled" id="2fa-disabled" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="2fa-disabled">Disabled</Label>
                          <p className="text-sm text-muted-foreground">
                            No additional security beyond your password
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="app" id="2fa-app" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="2fa-app">Authenticator App</Label>
                          <p className="text-sm text-muted-foreground">
                            Use an app like Google Authenticator or Authy
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="sms" id="2fa-sms" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="2fa-sms">SMS</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a code via text message
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    <Button>Enable Two-Factor Authentication</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your data and privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Analytics & Usage Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of anonymized usage statistics
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-recording">Session Recording</Label>
                    <p className="text-sm text-muted-foreground">
                      Record video sessions for clinical review (client consent required)
                    </p>
                  </div>
                  <Switch id="session-recording" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="directory-visibility">Therapist Directory</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your profile in the public therapist directory
                    </p>
                  </div>
                  <Switch id="directory-visibility" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button variant="outline" className="text-destructive">
                    <Lock className="h-4 w-4 mr-2" /> Request Data Export
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Sessions</CardTitle>
                <CardDescription>
                  Manage your currently signed-in devices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      device: "Chrome / macOS",
                      location: "New York, USA",
                      ip: "192.168.1.1",
                      lastActive: "Current session",
                      icon: <Laptop className="h-8 w-8" />
                    },
                    {
                      device: "Safari / iOS",
                      location: "New York, USA",
                      ip: "192.168.1.2",
                      lastActive: "1 hour ago",
                      icon: <Smartphone className="h-8 w-8" />
                    }
                  ].map((session, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="bg-muted p-2 rounded-md">
                          {session.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{session.device}</h4>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.ip}
                          </p>
                          <div className="mt-1 text-xs">
                            {session.lastActive === "Current session" ? (
                              <Badge variant="secondary">Current session</Badge>
                            ) : (
                              <span className="text-muted-foreground">
                                Last active: {session.lastActive}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {session.lastActive !== "Current session" && (
                        <Button variant="outline" size="sm">Sign Out</Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="destructive">
                    Sign Out All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      $49.99/month • Renews on June 15, 2025
                    </p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Plan Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Unlimited client sessions
                    </li>
                    <li className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Secure messaging
                    </li>
                    <li className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Client management tools
                    </li>
                    <li className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Document storage (10GB)
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">View Plans</Button>
                  <Button variant="outline" className="text-destructive">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-card p-1 border rounded">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">•••• •••• •••• 4242</h4>
                        <p className="text-xs text-muted-foreground">Expires 06/2028</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  
                  <Button variant="outline" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-name">Name</Label>
                      <Input id="billing-name" defaultValue="Morgan Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-email">Email</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        defaultValue="dr.morgan@theralink.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-address">Address</Label>
                      <Input id="billing-address" defaultValue="123 Therapy St" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-city">City</Label>
                      <Input id="billing-city" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-state">State</Label>
                      <Input id="billing-state" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-zip">ZIP Code</Label>
                      <Input id="billing-zip" defaultValue="10001" />
                    </div>
                  </div>
                  
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Update Billing Information
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  <div className="rounded-md border overflow-hidden">
                    <div className="grid grid-cols-4 p-3 text-sm font-medium bg-muted/50">
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div className="text-right">Invoice</div>
                    </div>
                    <div className="divide-y">
                      {[
                        {
                          date: "May 15, 2025",
                          amount: "$49.99",
                          status: "Paid",
                        },
                        {
                          date: "Apr 15, 2025",
                          amount: "$49.99",
                          status: "Paid",
                        },
                        {
                          date: "Mar 15, 2025",
                          amount: "$49.99",
                          status: "Paid",
                        }
                      ].map((invoice, index) => (
                        <div key={index} className="grid grid-cols-4 p-3 text-sm">
                          <div>{invoice.date}</div>
                          <div>{invoice.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                              {invoice.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Download className="h-3 w-3" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Connect and manage integrations with other services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6">
                  {[
                    {
                      name: "Google Calendar",
                      icon: <Calendar className="h-6 w-6 text-blue-500" />,
                      description: "Sync your appointments with Google Calendar",
                      connected: true
                    },
                    {
                      name: "Electronic Health Records",
                      icon: <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-6 w-6 text-green-500"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                      </svg>,
                      description: "Connect with your EHR system",
                      connected: false
                    },
                    {
                      name: "Payment Processor",
                      icon: <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-6 w-6 text-purple-500"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>,
                      description: "Process client payments through integrated systems",
                      connected: true
                    },
                    {
                      name: "Video Conferencing",
                      icon: <Video className="h-6 w-6 text-red-500" />,
                      description: "Connect external video conferencing platforms",
                      connected: false
                    },
                  ].map((integration, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-2 rounded-md">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              Connected
                            </Badge>
                            <Button variant="ghost" size="sm">Configure</Button>
                          </div>
                        ) : (
                          <Button>Connect</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">API Access</h3>
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertTitle>Developer API</AlertTitle>
                    <AlertDescription>
                      Use our API to build custom integrations with your existing systems.
                      <div className="mt-2">
                        <Button size="sm" variant="outline">
                          View Developer Documentation
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistSettings;
