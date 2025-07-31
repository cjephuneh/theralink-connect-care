
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

// Define the availability structure type for better type checking
interface AvailabilityStructure {
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  hours: {
    start: string;
    end: string;
  };
}

const TherapistSettings = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [therapistDetails, setTherapistDetails] = useState(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [verificationDocuments, setVerificationDocuments] = useState<string[]>([]);
  const [documentUploading, setDocumentUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    bio: "",
    specialization: "",
    hourly_rate: "",
    years_experience: "",
    availability: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      hours: { start: "09:00", end: "17:00" }
    } as AvailabilityStructure
  });

  // Fetch therapist details
  useEffect(() => {
    const fetchTherapistDetails = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Set profile image if available
        if (profileData?.profile_image_url) {
          setProfileImage(profileData.profile_image_url);
        }
        
        // Get therapist data
        const { data: therapistData, error: therapistError } = await supabase
          .from("therapists")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (therapistError && therapistError.code !== 'PGRST116') throw therapistError;
        
        // Get therapist details (now in therapists table)
        const { data: detailsData, error: detailsError } = await supabase
          .from("therapists")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
          
        if (detailsError && detailsError.code !== 'PGRST116') throw detailsError;
        
        setTherapistDetails(detailsData);
        
        // Fetch verification documents if they exist
        if (detailsData) {
          try {
            const { data: filesList } = await supabase
              .storage
              .from('verification-documents')
              .list(`${user.id}`);
              
            if (filesList && filesList.length > 0) {
              const documentURLs = await Promise.all(filesList.map(async (file) => {
                const { data: { publicUrl } } = supabase
                  .storage
                  .from('verification-documents')
                  .getPublicUrl(`${user.id}/${file.name}`);
                return publicUrl;
              }));
              
              setVerificationDocuments(documentURLs);
            }
          } catch (error) {
            console.log("No verification documents found");
          }
        }
        
        // Set form data with default availability structure if not present
        const defaultAvailability: AvailabilityStructure = {
          days: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
          },
          hours: { start: "09:00", end: "17:00" }
        };
        
        // Parse availability from JSON if it's a string, or use default if not available
        let parsedAvailability = defaultAvailability;
        
        if (therapistData?.availability) {
          if (typeof therapistData.availability === 'string') {
            try {
              const parsed = JSON.parse(therapistData.availability);
              // Check if the parsed object has the expected structure
              if (parsed && 
                typeof parsed === 'object' &&
                parsed.days && 
                parsed.hours &&
                typeof parsed.hours.start === 'string' &&
                typeof parsed.hours.end === 'string') {
                parsedAvailability = parsed as AvailabilityStructure;
              }
            } catch (e) {
              console.error("Error parsing availability JSON:", e);
            }
          } else if (typeof therapistData.availability === 'object') {
            // Verify that the object has the expected structure
            const availObj = therapistData.availability as any;
            if (availObj && 
                availObj.days && 
                availObj.hours && 
                typeof availObj.hours.start === 'string' && 
                typeof availObj.hours.end === 'string') {
              parsedAvailability = {
                days: {
                  monday: Boolean(availObj.days.monday),
                  tuesday: Boolean(availObj.days.tuesday),
                  wednesday: Boolean(availObj.days.wednesday),
                  thursday: Boolean(availObj.days.thursday),
                  friday: Boolean(availObj.days.friday),
                  saturday: Boolean(availObj.days.saturday),
                  sunday: Boolean(availObj.days.sunday)
                },
                hours: {
                  start: String(availObj.hours.start),
                  end: String(availObj.hours.end)
                }
              };
            }
          }
        }
        
        setFormData({
          full_name: profileData?.full_name || "",
          email: profileData?.email || user.email || "",
          bio: therapistData?.bio || "",
          specialization: therapistData?.specialization || "",
          hourly_rate: therapistData?.hourly_rate?.toString() || "",
          years_experience: therapistData?.years_experience?.toString() || "",
          availability: parsedAvailability
        });
      } catch (error) {
        console.error("Error fetching therapist data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTherapistDetails();
  }, [user, toast]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: {
          ...prev.availability.days,
          [day]: !prev.availability.days[day]
        }
      }
    }));
  };
  
  const handleHoursChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        hours: {
          ...prev.availability.hours,
          [type]: value
        }
      }
    }));
  };
  
  const handleProfileImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    setUploading(true);
    
    try {
      // Check if profile-images bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'profile-images')) {
        toast({
          title: "Error",
          description: "Profile images bucket not found. Please contact support.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      // Update the profile with the new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setProfileImage(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleVerificationDocUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;
    
    setDocumentUploading(true);
    
    try {
      // Check if verification-documents bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'verification-documents')) {
        toast({
          title: "Error",
          description: "Verification documents bucket not found. Please contact support.",
          variant: "destructive",
        });
        setDocumentUploading(false);
        return;
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('verification-documents')
        .getPublicUrl(filePath);
      
      // Add the new document to the list
      setVerificationDocuments(prev => [...prev, publicUrl]);
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setDocumentUploading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          full_name: formData.full_name,
          email: formData.email
        })
        .eq("id", user.id);
        
      if (profileError) throw profileError;
      
      // Convert availability to a plain object before saving
      // This ensures it's compatible with Supabase's JSON type
      const availabilityForDb = {
        days: {
          monday: formData.availability.days.monday,
          tuesday: formData.availability.days.tuesday,
          wednesday: formData.availability.days.wednesday,
          thursday: formData.availability.days.thursday,
          friday: formData.availability.days.friday,
          saturday: formData.availability.days.saturday,
          sunday: formData.availability.days.sunday
        },
        hours: {
          start: formData.availability.hours.start,
          end: formData.availability.hours.end
        }
      };
      
      // Update therapist
      const { error: therapistError } = await supabase
        .from("therapists")
        .update({
          bio: formData.bio,
          specialization: formData.specialization,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
          availability: availabilityForDb
        })
        .eq("id", user.id);
        
      if (therapistError) throw therapistError;
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your professional profile and account information.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback>{formData.full_name ? formData.full_name[0] : "T"}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <Label htmlFor="profile-image" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                    {uploading ? 'Uploading...' : 'Change Image'}
                  </Label>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfileImageUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane.smith@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a short professional bio that describes your experience and approach..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="E.g., Anxiety, Depression, CBT"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourly_rate" 
                    name="hourly_rate"
                    type="number" 
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    placeholder="150"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Input 
                    id="years_experience" 
                    name="years_experience"
                    type="number" 
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>
                Set your working days and hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Working Days</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                  {Object.entries(formData.availability.days).map(([day, isActive]) => (
                    <div 
                      key={day}
                      onClick={() => handleDayChange(day)}
                      className={`p-3 rounded-md border cursor-pointer text-center ${
                        isActive ? 'bg-primary/10 border-primary' : 'bg-background'
                      }`}
                    >
                      <p className="capitalize">{day}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Working Hours</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input 
                      id="start_time" 
                      type="time" 
                      value={formData.availability.hours.start}
                      onChange={(e) => handleHoursChange('start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input 
                      id="end_time" 
                      type="time" 
                      value={formData.availability.hours.end}
                      onChange={(e) => handleHoursChange('end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Upload verification documents for your license and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload Verification Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please upload your license, certificates, and other credential verification documents.
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-6">
                    <Label htmlFor="verification-doc" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      {documentUploading ? 'Uploading...' : 'Upload Document'}
                    </Label>
                    <Input 
                      id="verification-doc" 
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                      className="hidden" 
                      onChange={handleVerificationDocUpload}
                      disabled={documentUploading}
                    />
                    <span className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG
                    </span>
                  </div>
                </div>
                
                {therapistDetails && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Verification Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">License Number</p>
                        <p>{therapistDetails.license_number || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">License Type</p>
                        <p>{therapistDetails.license_type || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Education</p>
                        <p>{therapistDetails.education || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Therapy Approaches</p>
                        <p>{therapistDetails.therapy_approaches || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Application Status</p>
                        <p className={`font-medium ${
                          therapistDetails.application_status === 'approved' 
                            ? 'text-green-600' 
                            : therapistDetails.application_status === 'rejected' 
                              ? 'text-red-600' 
                              : 'text-yellow-600'
                        }`}>
                          {(therapistDetails.application_status || 'Pending').charAt(0).toUpperCase() + 
                          (therapistDetails.application_status || 'pending').slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {verificationDocuments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {verificationDocuments.map((url, index) => (
                        <div key={index} className="border rounded-md p-2">
                          {url.toLowerCase().endsWith('.pdf') ? (
                            <div className="flex items-center justify-between">
                              <span>Document {index + 1} (.pdf)</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                View
                              </a>
                            </div>
                          ) : (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img 
                                src={url} 
                                alt={`Document ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Appointment Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified before your scheduled appointments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Client Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when clients request appointments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Messages</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for payment transactions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">System Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about platform updates and new features
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Button>Save Notification Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input id="current_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input id="new_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input id="confirm_password" type="password" />
                    </div>
                    <Button className="w-full sm:w-auto">Update Password</Button>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
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
