
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users as UsersIcon } from "lucide-react";

const FriendClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // This is a placeholder. In a real app, you'd fetch clients from the database.
  const clients = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Clients</h2>
        <p className="text-muted-foreground mt-2">
          View and manage the people you're supporting as a Friend.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-12 bg-muted/40">
          <div className="rounded-full bg-primary/10 p-4">
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No clients yet</h3>
          <p className="text-muted-foreground text-center mt-2 max-w-sm">
            You don't have any clients at the moment. When someone connects with you, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Client cards would go here */}
        </div>
      )}
    </div>
  );
};

export default FriendClients;
