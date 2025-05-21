
import { useState, useEffect } from "react";
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
import { AlertCircle, Bell, Calendar, Camera, Check, CheckCircle, CreditCard, Globe, Lock, LogOut, Mail, MessageCircle, Pencil, Search, Shield, Smartphone, UploadCloud, User, Video, Clock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const TherapistAccount = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [therapistDetails, setTherapistDetails] = useState(null);
  const [therapistData, setTherapistData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    professional_title: "Licensed Clinical Psychologist",
    phone: "(555) 123-4567",
    license_number: "",
    location: "New York, NY",
    bio: "",
    specialties: [],
    approaches: [],
    languages: "",
    age_groups: "Adults (18+), Seniors (65+)"
  });

  // Fetch therapist data
  useEffect(() => {
    const fetchTherapistData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get profile data
        if (profile) {
          setFormData(prev => ({
            ...prev,
            full_name: profile.full_name || "",
            email: profile.email || ""
          }));
          
          if (profile.profile_image_url) {
            setProfileImage(profile.profile_image_url);
          }
        }
        
        // Get therapist data
        const { data: therapistData, error: therapistError } = await supabase
          .from("therapists")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (therapistError && therapistError.code !== 'PGRST116') {
          console.error("Error fetching therapist data:", therapistError);
        }
        
        if (therapistData) {
          setTherapistData(therapistData);
          setFormData(prev => ({
            ...prev,
            bio: therapistData.bio || "",
            specialties: therapistData.specialization ? therapistData.specialization.split(",").map(s => s.trim()) : []
          }));
        }
        
        // Get therapist details
        const { data: detailsData, error: detailsError } = await supabase
          .from("therapist_details")
          .select("*")
          .eq("therapist_id", user.id)
          .maybeSingle();
          
        if (detailsError && detailsError.code !== 'PGRST116') {
          console.error("Error fetching therapist details:", detailsError);
        }
        
        if (detailsData) {
          setTherapistDetails(detailsData);
          setFormData(prev => ({
            ...prev,
            license_number: detailsData.license_number || "",
            approaches: detailsData.therapy_approaches ? detailsData.therapy_approaches.split(",").map(a => a.trim()) : [],
            languages: detailsData.languages || ""
          }));
        }
        
        // Fetch verification documents
        try {
          const { data: filesList } = await supabase
            .storage
            .from('verification-documents')
            .list(`${user.id}`);
            
          if (filesList && filesList.length > 0) {
            const documents = await Promise.all(filesList.map(async (file) => {
              const { data: { publicUrl } } = supabase
                .storage
                .from('verification-documents')
                .getPublicUrl(`${user.id}/${file.name}`);
                
              return {
                id: file.id,
                name: file.name,
                url: publicUrl,
                status: "verified" // Assuming all uploaded docs are verified
              };
            }));
            
            setUploadedDocuments(documents);
          }
        } catch (error) {
          console.log("No verification documents found");
        }
        
        // Fetch past sessions (appointments)
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select(`
            *,
            profiles(full_name, profile_image_url)
          `)
          .eq("therapist_id", user.id)
          .order("start_time", { ascending: false })
          .limit(5);
          
        if (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
        }
        
        if (appointmentsData) {
          setPastSessions(appointmentsData.map(appointment => ({
            client: appointment.profiles?.full_name || "Client",
            avatar: appointment.profiles?.profile_image_url || "/placeholder.svg",
            date: format(new Date(appointment.start_time), "MMM d, yyyy"),
            time: format(new Date(appointment.start_time), "h:mm a"),
            type: appointment.session_type || "video",
            duration: "50 minutes", // Default duration
            notes: appointment.notes || ""
          })));
        }
      } catch (error) {
        console.error("Error fetching therapist data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTherapistData();
  }, [user, profile, toast]);
  
  const handleDocumentUpload = async (e) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;
    
    setUploading(true);
    
    try {
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
      setUploadedDocuments(prev => [...prev, {
        id: Date.now(),
        name: file.name,
        url: publicUrl,
        status: "pending"
      }]);
      
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
      setUploading(false);
    }
  };
  
  const handleProfileImageUpload = async (e) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    setUploading(true);
    
    try {
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
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setUploading(true);
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
      
      // Update therapist
      const { error: therapistError } = await supabase
        .from("therapists")
        .update({
          bio: formData.bio,
          specialization: formData.specialties.join(", ")
        })
        .eq("id", user.id);
        
      if (therapistError) throw therapistError;
      
      // Update therapist details if it exists
      if (therapistDetails) {
        const { error: detailsError } = await supabase
          .from("therapist_details")
          .update({
            license_number: formData.license_number,
            therapy_approaches: formData.approaches.join(", "),
            languages: formData.languages
          })
          .eq("therapist_id", user.id);
          
        if (detailsError) throw detailsError;
      } else {
        // Insert therapist details if it doesn't exist
        const { error: insertError } = await supabase
          .from("therapist_details")
          .insert({
            therapist_id: user.id,
            license_number: formData.license_number,
            therapy_approaches: formData.approaches.join(", "),
            languages: formData.languages
          });
          
        if (insertError) throw insertError;
      }
      
      setIsEditingProfile(false);
      
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
      setUploading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSpecialtiesChange = (e) => {
    const specialties = e.target.value.split(",").map(s => s.trim());
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };
  
  const handleApproachesChange = (e) => {
    const approaches = e.target.value.split(",").map(a => a.trim());
    setFormData(prev => ({
      ...prev,
      approaches
    }));
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
                    onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isEditingProfile ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Pencil className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Saving..." : isEditingProfile ? "Save" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-2">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback>{formData.full_name?.[0] || "T"}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="rounded-full w-8 h-8 bg-secondary flex items-center justify-center">
                            <Camera className="h-4 w-4" />
                          </div>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageUpload}
                            disabled={uploading}
                          />
                        </Label>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Badge className="mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {therapistDetails?.application_status === 'approved' ? 'Verified' : 'Pending'}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Member since {therapistData?.created_at ? format(new Date(therapistData.created_at), "MMM yyyy") : "Jan 2025"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isEditingProfile ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input 
                              id="full_name" 
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="professional_title">Professional Title</Label>
                            <Input 
                              id="professional_title" 
                              name="professional_title"
                              value={formData.professional_title}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="license_number">License Number</Label>
                            <Input 
                              id="license_number" 
                              name="license_number"
                              value={formData.license_number}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{formData.full_name || "Dr. Morgan Smith"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Professional Title</p>
                            <p className="font-medium">{formData.professional_title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{formData.email || user?.email || "dr.morgan@theralink.com"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">License Number</p>
                            <p className="font-medium">{formData.license_number || "PSY12345"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{formData.location}</p>
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
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Write a professional bio that describes your experience and approach..."
                            className="min-h-[120px]"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Professional Bio</p>
                          <p>
                            {formData.bio || "Dr. Morgan Smith is a licensed clinical psychologist with over 10 years of experience specializing in anxiety, depression, and relationship issues. Dr. Smith utilizes evidence-based approaches including Cognitive Behavioral Therapy (CBT), mindfulness, and solution-focused methods."}
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
                            name="specialties"
                            value={formData.specialties.join(", ")}
                            onChange={handleSpecialtiesChange}
                            placeholder="Anxiety, Depression, Relationship Issues, etc."
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter specialties separated by commas
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-2">
                            {(formData.specialties.length > 0 
                              ? formData.specialties 
                              : ["Anxiety", "Depression", "Relationship Issues", "Trauma", "LGBTQ+ Issues", "Work Stress"]
                            ).map((specialty, idx) => (
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
                        name="approaches"
                        value={formData.approaches.join(", ")}
                        onChange={handleApproachesChange}
                        placeholder="CBT, Mindfulness, etc."
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter approaches separated by commas
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="languages">Languages Spoken</Label>
                        <Input 
                          id="languages" 
                          name="languages"
                          value={formData.languages}
                          onChange={handleInputChange}
                          placeholder="English, Spanish, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age_groups">Age Groups</Label>
                        <Input 
                          id="age_groups" 
                          name="age_groups"
                          value={formData.age_groups}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Therapy Approaches</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {(formData.approaches.length > 0 
                          ? formData.approaches 
                          : [
                              "Cognitive Behavioral Therapy (CBT)",
                              "Mindfulness-Based Cognitive Therapy (MBCT)",
                              "Solution-Focused Brief Therapy (SFBT)",
                              "Acceptance and Commitment Therapy (ACT)"
                            ]
                        ).map((approach, idx) => (
                          <li key={idx}>{approach}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                      <div>
                        <h4 className="font-medium mb-1">Languages Spoken</h4>
                        <p className="text-muted-foreground">{formData.languages || "English, Spanish"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Age Groups</h4>
                        <p className="text-muted-foreground">{formData.age_groups}</p>
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
                      <h3 className="font-medium">Verification {therapistDetails?.application_status === 'approved' ? 'Complete' : 'Pending'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {therapistDetails?.application_status === 'approved' 
                          ? 'Your professional credentials have been verified' 
                          : 'Your professional credentials are being reviewed'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    therapistDetails?.application_status === 'approved' 
                      ? 'bg-green-50 text-green-600' 
                      : therapistDetails?.application_status === 'rejected'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-yellow-50 text-yellow-600'
                  }>
                    {therapistDetails?.application_status 
                      ? therapistDetails.application_status.charAt(0).toUpperCase() + therapistDetails.application_status.slice(1) 
                      : 'Pending'}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
                  <div className="space-y-3">
                    {uploadedDocuments.length > 0 ? (
                      uploadedDocuments.map((doc) => (
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
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <span>{doc.name}</span>
                            </a>
                          </div>
                          <Badge variant="outline" className={
                            doc.status === "verified" 
                              ? "bg-green-50 text-green-600" 
                              : "bg-yellow-50 text-yellow-600"
                          }>
                            {doc.status === "verified" ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                            ) : (
                              <>Pending</>
                            )}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                    )}
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
                              onChange={handleDocumentUpload}
                              disabled={uploading}
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
                      <p className="font-medium">{formData.license_number || "PSY12345"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License State/Region</p>
                      <p className="font-medium">{therapistDetails?.license_type 
                        ? therapistDetails.license_type.split(' ')[0] 
                        : "New York"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Type</p>
                      <p className="font-medium">{therapistDetails?.license_type || formData.professional_title}</p>
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
                    {pastSessions.length > 0 ? (
                      pastSessions.map((session, idx) => (
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
                                        <p>{session.notes || "Continued work on anxiety management techniques. Client reported using deep breathing exercises successfully during stressful situations at work."}</p>
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
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No past sessions found
                      </div>
                    )}
                  </div>
                </div>
                
                {pastSessions.length > 0 && (
                  <div className="flex justify-center">
                    <Button variant="outline">Load More Sessions</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistAccount;
