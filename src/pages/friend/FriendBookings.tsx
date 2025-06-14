
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { Loader2 } from "lucide-react";

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FriendBookings() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["friend-bookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("*, client:client_id(full_name, email, profile_image_url)")
        .eq("therapist_id", user.id)
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Calendar className="inline mr-2" /> My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-primary">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : data?.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No bookings yet. Clients who book a session will show up here!
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {data.map((appt: any) => (
                <div key={appt.id} className="flex items-center gap-4 border-b pb-3">
                  <div className="rounded-full bg-accent p-2">
                    <User className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{appt.client?.full_name || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{appt.client?.email}</div>
                    <div className="text-xs mt-1">
                      {formatDate(appt.start_time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
