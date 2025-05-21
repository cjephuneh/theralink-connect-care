
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FileText, 
  Eye, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminSessionNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('session_notes')
        .select(`
          *,
          therapist:therapist_id(id, full_name:profiles(full_name)),
          client:client_id(id, full_name:profiles(full_name)),
          appointment:appointment_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to extract nested information
      const processedData = data?.map(note => ({
        ...note,
        therapist_name: note.therapist?.full_name?.full_name || 'Unknown',
        client_name: note.client?.full_name?.full_name || 'Unknown',
      }));
      
      setNotes(processedData || []);
    } catch (error: any) {
      console.error('Error fetching session notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load session notes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewNote = (note: any) => {
    setSelectedNote(note);
  };

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.therapist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Session Notes Management</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={fetchNotes} 
          variant="outline" 
          size="icon" 
          className="h-10 w-10"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Session Notes</CardTitle>
          <CardDescription>
            Complete record of all therapist session notes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                      <p className="mt-2 text-gray-500">Loading notes...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <p className="text-gray-500">No session notes found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.title || 'Untitled'}</TableCell>
                      <TableCell>{note.therapist_name}</TableCell>
                      <TableCell>{note.client_name}</TableCell>
                      <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewNote(note)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNote?.title || 'Untitled Note'}</DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="font-medium">Therapist:</span> {selectedNote?.therapist_name}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {selectedNote?.client_name}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {selectedNote && new Date(selectedNote.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {selectedNote && new Date(selectedNote.updated_at).toLocaleString()}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">
            {selectedNote?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSessionNotes;
