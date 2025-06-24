
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Edit } from "lucide-react";

interface TherapistData {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  specialization: string;
  years_experience: number;
  hourly_rate: number;
  preferred_currency: string;
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
    preferred_currency: "NGN",
  });

  const currencies = [
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "KES", label: "KES - Kenyan Shilling" },
    { value: "GHS", label: "GHS - Ghanaian Cedi" },
    { value: "ZAR", label: "ZAR - South African Rand" },
  ];

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
          preferred_currency: therapistData?.preferred_currency || "NGN",
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
          preferred_currency: formData.preferred_currency,
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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="text-lg sm:text-xl">Professional Information</span>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                disabled={!isEditing}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your location"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Anxiety, Depression, PTSD"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience" className="text-sm font-medium">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                value={formData.years_experience}
                onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                min="0"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_currency" className="text-sm font-medium">Preferred Currency</Label>
              {isEditing ? (
                <Select
                  value={formData.preferred_currency}
                  onValueChange={(value) => handleInputChange('preferred_currency', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.preferred_currency}
                  disabled
                  className="w-full"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourly_rate" className="text-sm font-medium">
              Hourly Rate ({formData.preferred_currency})
            </Label>
            <Input
              id="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell clients about your approach and experience..."
              rows={4}
              className="w-full resize-none"
            />
          </div>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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
                className="w-full sm:w-auto"
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
