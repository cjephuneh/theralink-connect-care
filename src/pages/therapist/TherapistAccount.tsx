
import TherapistProfileImageUpload from "@/components/therapist/TherapistProfileImageUpload";
import TherapistProfileForm from "@/components/therapist/TherapistProfileForm";

const TherapistAccount = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your professional profile and account settings</p>
      </div>

      <div className="grid gap-6">
        <TherapistProfileImageUpload />
        <TherapistProfileForm />
      </div>
    </div>
  );
};

export default TherapistAccount;
