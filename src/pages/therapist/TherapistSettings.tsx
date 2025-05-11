
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Globe, Palette, BellRing, User, Shield, Trash2, LogOut } from "lucide-react";

const TherapistSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application preferences and settings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your basic application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="america_los_angeles">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_los_angeles">Pacific Time (US & Canada)</SelectItem>
                    <SelectItem value="america_denver">Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="america_chicago">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="america_new_york">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="america_sao_paulo">São Paulo</SelectItem>
                    <SelectItem value="europe_london">London</SelectItem>
                    <SelectItem value="europe_paris">Paris</SelectItem>
                    <SelectItem value="asia_tokyo">Tokyo</SelectItem>
                    <SelectItem value="australia_sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mm_dd_yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy_mm_dd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="12h">
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (13:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">First Day of Week</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose which day should be the first day of the week in your calendar.
                  </p>
                </div>
                <Select defaultValue="sunday">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language for the application interface.
                  </p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>Connect external calendars to sync your appointments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0.5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-blue-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="4" fill="#4285F4" />
                      <path d="M6 10V7.2C6 6.0799 6 5.51984 6.21799 5.09202C6.40973 4.71569 6.71569 4.40973 7.09202 4.21799C7.51984 4 8.0799 4 9.2 4H14.8C15.9201 4 16.4802 4 16.908 4.21799C17.2843 4.40973 17.5903 4.71569 17.782 5.09202C18 5.51984 18 6.0799 18 7.2V10M6 10H18M6 10V16.8C6 17.9201 6 18.4802 6.21799 18.908C6.40973 19.2843 6.71569 19.5903 7.09202 19.782C7.51984 20 8.0799 20 9.2 20H14.8C15.9201 20 16.4802 20 16.908 19.782C17.2843 19.5903 17.5903 19.2843 17.782 18.908C18 18.4802 18 17.9201 18 16.8V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 14H14.5M9.5 17H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9.5 7L9.5 2M14.5 7L14.5 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Google Calendar</h4>
                    <p className="text-sm text-muted-foreground">Sync your Google Calendar</p>
                  </div>
                </div>
                <Button>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between space-y-0.5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-blue-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="4" fill="#0078D4" />
                      <path d="M12 6C10.8954 6 10 6.89543 10 8V11H14V8C14 6.89543 13.1046 6 12 6Z" fill="white"/>
                      <path d="M18 11H14V15H18V11Z" fill="white"/>
                      <path d="M14 15H10V19H14V15Z" fill="white"/>
                      <path d="M10 15H6V11H10V15Z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Microsoft Outlook</h4>
                    <p className="text-sm text-muted-foreground">Sync your Outlook Calendar</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between space-y-0.5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-blue-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="4" fill="#0C0C0D" />
                      <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="white" strokeWidth="2" />
                      <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Apple iCal</h4>
                    <p className="text-sm text-muted-foreground">Sync your Apple Calendar</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="light" name="theme" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="dark" name="theme" className="h-4 w-4" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="system" name="theme" className="h-4 w-4" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      className="w-12 h-12 bg-thera-600 rounded-full ring-offset-2 ring-offset-background ring-2 ring-thera-600" 
                      aria-label="Primary color"
                    />
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      className="w-12 h-12 bg-blue-600 rounded-full" 
                      aria-label="Blue color"
                    />
                    <span className="text-sm">Blue</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      className="w-12 h-12 bg-green-600 rounded-full" 
                      aria-label="Green color"
                    />
                    <span className="text-sm">Green</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      className="w-12 h-12 bg-amber-600 rounded-full" 
                      aria-label="Amber color"
                    />
                    <span className="text-sm">Amber</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Display more information with reduced spacing.
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable UI animations and transitions.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Hours</CardTitle>
              <CardDescription>Set your regular working hours for appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Monday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="8:30">8:30 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="monday-available" defaultChecked />
                    <Label htmlFor="monday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Tuesday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="8:30">8:30 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tuesday-available" defaultChecked />
                    <Label htmlFor="tuesday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Wednesday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="8:30">8:30 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="wednesday-available" defaultChecked />
                    <Label htmlFor="wednesday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Thursday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="8:30">8:30 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="thursday-available" defaultChecked />
                    <Label htmlFor="thursday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Friday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="9:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="8:30">8:30 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="friday-available" defaultChecked />
                    <Label htmlFor="friday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Saturday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="10:00">
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="14:00">
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="13:30">1:30 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="saturday-available" />
                    <Label htmlFor="saturday-available">Available</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                  <div className="font-medium">Sunday</div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="10:00">
                      <SelectTrigger disabled>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="9:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="14:00">
                      <SelectTrigger disabled>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="13:30">1:30 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sunday-available" />
                    <Label htmlFor="sunday-available">Available</Label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button>Save Availability</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appointment Types</CardTitle>
              <CardDescription>Configure the types of appointments you offer.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Video Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to book video sessions with you.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Chat Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to book text-based chat sessions with you.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Initial Consultations</h4>
                    <p className="text-sm text-muted-foreground">
                      Offer free initial consultation sessions to new clients.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Group Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Offer group therapy sessions for multiple clients.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Configure your privacy and data sharing preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your profile to be visible in therapist search results.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Availability</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your available time slots to potential clients.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Display Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow clients to leave reviews and display them on your profile.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Analytics Consent</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect anonymous usage data to improve our services.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features, tips, and promotions.
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex justify-end">
                <Button>Save Privacy Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your data and privacy options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-thera-600" />
                  Data Protection Information
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  TheraLink is committed to protecting your data and the data of your clients. All information is encrypted and stored securely according to industry standards and HIPAA compliance requirements.
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Request My Data
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Developer Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable advanced features for developers.
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable API access to your account data.
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Auto-logout after period of inactivity for security.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="export-data">Export Data</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    Export Appointments
                  </Button>
                  <Button variant="outline">
                    Export Client Data
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Advanced Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="mt-4">
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
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
