
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";

interface TherapistData {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  specialization: string;
  years_experience: number;
  hourly_rate: number;
}

const TherapistProfileForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TherapistData>({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    specialization: "",
    years_experience: 0,
    hourly_rate: 0,
  });

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (!user || !profile) return;

      try {
        // Get therapist data
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select('*')
          .eq('id', user.id)
          .single();

        if (therapistError && therapistError.code !== 'PGRST116') {
          throw therapistError;
        }

        setFormData({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          location: profile.location || "",
          bio: therapistData?.bio || "",
          specialization: therapistData?.specialization || "",
          years_experience: therapistData?.years_experience || 0,
          hourly_rate: therapistData?.hourly_rate || 0,
        });
      } catch (error) {
        console.error('Error fetching therapist data:', error);
      }
    };

    fetchTherapistData();
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update therapists table
      const { error: therapistError } = await supabase
        .from('therapists')
        .upsert({
          id: user.id,
          bio: formData.bio,
          specialization: formData.specialization,
          years_experience: formData.years_experience,
          hourly_rate: formData.hourly_rate,
        });

      if (therapistError) throw therapistError;

      await refreshProfile();
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TherapistData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Professional Information
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your location"
              />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Anxiety, Depression, PTSD"
              />
            </div>
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                value={formData.years_experience}
                onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (Ksh)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell clients about your approach and experience..."
              rows={4}
            />
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TherapistProfileForm;
