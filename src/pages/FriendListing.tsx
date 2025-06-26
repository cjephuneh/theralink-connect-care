import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Friend {
  id: string;
  full_name: string;
  profile_image_url?: string;
  bio?: string;
}

const FriendListing = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("friends")
        .select("id, full_name, profile_image_url, bio");

      if (error) {
        console.error("Error fetching friends:", error.message);
      } else {
        setFriends(data || []);
      }
      setLoading(false);
    };

    fetchFriends();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>No friends found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Available Friends</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <Card key={friend.id} className="p-4">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                {friend.profile_image_url ? (
                  <img
                    src={friend.profile_image_url}
                    alt={friend.full_name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
                )}

                <h2 className="text-xl font-semibold">{friend.full_name}</h2>
                <p className="text-sm text-gray-600">{friend.bio || "No bio available"}</p>

                <Link
                  to={`/friends/${friend.id}`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FriendListing;
