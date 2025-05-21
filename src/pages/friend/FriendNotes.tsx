
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText } from "lucide-react";

const FriendNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // This is a placeholder. In a real app, you'd fetch notes from the database.
  const notes = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Session Notes</h2>
          <p className="text-muted-foreground mt-2">
            Keep track of your sessions and progress with clients.
          </p>
        </div>
        <Button className="flex items-center">
          <Plus className="mr-1 h-4 w-4" />
          New Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-12 bg-muted/40">
          <div className="rounded-full bg-primary/10 p-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
          <p className="text-muted-foreground text-center mt-2 max-w-sm">
            You haven't created any session notes yet. Start by creating a new note for one of your sessions.
          </p>
          <Button className="mt-4 flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            Create First Note
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Notes would go here */}
        </div>
      )}
    </div>
  );
};

export default FriendNotes;
