
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Clock, User } from "lucide-react";
import { format } from "date-fns";

const AdminSessionNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // First, fetch all session notes
      const { data: notesData, error: notesError } = await supabase
        .from('session_notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;

      if (!notesData || notesData.length === 0) {
        setNotes([]);
        setLoading(false);
        return;
      }

      // Create sets of therapist and client IDs
      const therapistIds = new Set(notesData.map(note => note.therapist_id).filter(Boolean));
      const clientIds = new Set(notesData.map(note => note.client_id).filter(Boolean));
      
      // Combine all unique user IDs
      const userIds = [...Array.from(therapistIds), ...Array.from(clientIds)];
      
      // Fetch profiles for all user IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of user IDs to profiles for quick lookup
      const profilesMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Combine session notes with profile data
      const enrichedNotes = notesData.map(note => ({
        ...note,
        therapist: note.therapist_id ? profilesMap[note.therapist_id] : null,
        client: note.client_id ? profilesMap[note.client_id] : null
      }));
      
      setNotes(enrichedNotes);
    } catch (error) {
      console.error("Error fetching session notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Session Notes Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="font-medium">{note.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          <span className="font-medium">
                            {note.therapist?.full_name || 'Unknown Therapist'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>
                            {note.client?.full_name || 'Unknown Client'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          {note.created_at && format(new Date(note.created_at), 'PP')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{note.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <User size={16} className="text-primary" />
                                  <span className="text-sm">
                                    Therapist: {note.therapist?.full_name || 'Unknown'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  <span className="text-sm">
                                    Client: {note.client?.full_name || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock size={12} />
                                {note.created_at && format(new Date(note.created_at), 'PPpp')}
                              </div>
                              <div className="bg-muted/30 rounded-md p-4 whitespace-pre-wrap">
                                {note.content}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No session notes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessionNotes;
