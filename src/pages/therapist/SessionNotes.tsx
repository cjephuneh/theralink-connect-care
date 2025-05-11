
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { FileText, Plus, Search } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface SessionNote {
  id: string;
  appointment_id: string;
  client_id: string;
  therapist_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  appointment_date: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  appointment_id: z.string().uuid("Please select an appointment"),
});

const SessionNotes = () => {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      appointment_id: "",
    },
  });

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        // Fetch all notes for this therapist
        const { data: notesData, error: notesError } = await supabase
          .from('session_notes')
          .select(`
            *,
            profiles:client_id (full_name),
            appointments:appointment_id (start_time)
          `)
          .eq('therapist_id', user.id)
          .order('created_at', { ascending: false });

        if (notesError) throw notesError;

        // Transform data
        const formattedNotes = notesData?.map(note => ({
          ...note,
          client_name: note.profiles?.full_name || 'Unknown Client',
          appointment_date: note.appointments ? new Date(note.appointments.start_time).toLocaleDateString() : 'N/A'
        })) || [];

        setNotes(formattedNotes);

        // Fetch completed appointments for this therapist (for creating new notes)
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            id, 
            start_time,
            client_id,
            profiles:client_id (full_name)
          `)
          .eq('therapist_id', user.id)
          .eq('status', 'completed')
          .order('start_time', { ascending: false });

        if (appointmentsError) throw appointmentsError;
        
        setAppointments(appointmentsData || []);
      } catch (error) {
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

    fetchNotes();
  }, [user, toast]);

  const handleCreateNote = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      // Get the appointment details
      const appointment = appointments.find(app => app.id === values.appointment_id);
      if (!appointment) {
        toast({
          title: 'Error',
          description: 'Selected appointment not found',
          variant: 'destructive',
        });
        return;
      }

      // Create the new note
      const { data, error } = await supabase
        .from('session_notes')
        .insert({
          appointment_id: values.appointment_id,
          therapist_id: user.id,
          client_id: appointment.client_id,
          title: values.title,
          content: values.content,
        })
        .select(`
          *,
          profiles:client_id (full_name),
          appointments:appointment_id (start_time)
        `)
        .single();

      if (error) throw error;

      // Add the new note to the state
      const newNote = {
        ...data,
        client_name: data.profiles?.full_name || 'Unknown Client',
        appointment_date: data.appointments ? new Date(data.appointments.start_time).toLocaleDateString() : 'N/A'
      };
      
      setNotes(prev => [newNote, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Session note created successfully',
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error creating session note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create session note',
        variant: 'destructive',
      });
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading session notes...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Session Notes</h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create Session Note</SheetTitle>
              <SheetDescription>
                Add notes for a completed session with a client.
              </SheetDescription>
            </SheetHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateNote)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="appointment_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Appointment</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select an appointment</option>
                          {appointments.map(appointment => (
                            <option key={appointment.id} value={appointment.id}>
                              {new Date(appointment.start_time).toLocaleString()} - {appointment.profiles?.full_name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Session summary title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed session notes here"
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button type="submit">Save Note</Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-10"
          placeholder="Search notes by title, content or client" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-lg text-muted-foreground">No session notes found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{note.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>Client: {note.client_name}</span>
                <span>Session Date: {note.appointment_date}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionNotes;
