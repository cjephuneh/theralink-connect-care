
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const mockSettings = [
  {
    label: "Email Notifications",
    key: "email_notifications",
  },
  {
    label: "SMS Notifications",
    key: "sms_notifications",
  },
  {
    label: "Dark Mode",
    key: "dark_mode",
  },
];

export default function FriendSettings() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    dark_mode: false,
  });

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="flex justify-center py-12 px-2 bg-gradient-to-b from-accent/30 to-muted/50 min-h-[70vh]">
      <Card className="w-full max-w-xl border-2 border-accent rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Friend Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockSettings.map((s) => (
              <div className="flex items-center justify-between" key={s.key}>
                <div className="text-lg font-medium">{s.label}</div>
                <Switch checked={settings[s.key as keyof typeof settings]} onCheckedChange={() => handleToggle(s.key)} />
              </div>
            ))}
          </div>
          <Button className="mt-8 w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
