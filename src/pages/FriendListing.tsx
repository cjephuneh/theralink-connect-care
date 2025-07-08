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

interface FriendDetails {
  friend_id: string; // Assuming this column links to Friend's `id`
  experience_description: string;
  area_of_experience: string;
  personal_story: string;
  communication_preferences: string;
}

const FriendListing = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendDetails, setFriendDetails] = useState<FriendDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsAndDetails = async () => {
      setLoading(true);

      try {
        // Fetch friends' profiles independently
        const { data: friendData, error: friendError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "friend");

        if (friendError) {
          throw friendError;
        }

        // Fetch friend details independently
        const { data: detailsData, error: detailsError } = await supabase
          .from("friend_details")
          .select("*");

        if (detailsError) {
          throw detailsError;
        }

        // Set the fetched data
        setFriends(friendData || []);
        setFriendDetails(detailsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoading(false);
    };

    fetchFriendsAndDetails();
  }, []);

  // Combine profiles with their details based on the shared identifier `friend_id`
  const friendsWithDetails = friends.map(friend => {
    const details = friendDetails.find(detail => detail.friend_id === friend.id);
    return {
      ...friend,
      friend_details: details || null, // Attach details or null if none exist
    };
  });

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
        {friendsWithDetails.map((friend) => (
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
                <p className="text-sm text-gray-600 mb-4">{friend.bio || "No bio available"}</p>

                {friend.friend_details ? (
                  <div className="text-left mt-4">
                    <p className="text-sm font-semibold">
                      <strong>Experience Description:</strong> {friend.friend_details.experience_description || "N/A"}
                    </p>
                    <p className="text-sm font-semibold">
                      <strong>Area of Experience:</strong> {friend.friend_details.area_of_experience || "N/A"}
                    </p>
                    <p className="text-sm font-semibold">
                      <strong>Personal Story:</strong> {friend.friend_details.personal_story || "N/A"}
                    </p>
                    <p className="text-sm font-semibold">
                      <strong>Communication Preferences:</strong> {friend.friend_details.communication_preferences || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-4">No additional details available.</p>
                )}

                <div className="flex justify-center mt-4 gap-2">
                  <Link
                    to={`/friends/${friend.id}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Profile
                  </Link>
                  <button
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleBooking(friend.id)}
                  >
                    Book
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Dummy booking handler function (you can replace this with your actual booking logic)
const handleBooking = (friendId: string) => {
  alert(`Booking initiated for friend ID: ${friendId}`);
};

export default FriendListing;