
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bell, BellOff, Clock, AlertTriangle, Info, CheckCircle, Users, Link, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    action_url: "",
    recipient: "all"
  });
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*, profiles:profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      if (userError) throw userError;

      setUsers(userData || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const filterNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter(notification => !notification.is_read);
    return notifications;
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      await fetchNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read).map(n => n.id);
      
      if (unreadNotifications.length === 0) {
        toast.info("No unread notifications");
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadNotifications);

      if (error) throw error;
      
      await fetchNotifications();
      toast.success(`${unreadNotifications.length} notifications marked as read`);
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({
      ...newNotification,
      [name]: value
    });
  };

  const handleTypeChange = (value) => {
    setNewNotification({
      ...newNotification,
      type: value
    });
  };

  const handleRecipientChange = (value) => {
    setNewNotification({
      ...newNotification,
      recipient: value
    });
    
    if (value !== "specific") {
      setSelectedUserId("");
    }
  };

  const handleUserChange = (value) => {
    setSelectedUserId(value);
  };

  const createNotification = async (e) => {
    e.preventDefault();
    
    try {
      const { title, message, type, action_url, recipient } = newNotification;
      
      if (!title || !message) {
        toast.error("Title and message are required");
        return;
      }
      
      if (recipient === "specific" && !selectedUserId) {
        toast.error("Please select a user");
        return;
      }
      
      if (recipient === "all") {
        // Bulk create for all users
        const bulkNotifications = users.map(user => ({
          id: crypto.randomUUID(), // Generate a UUID for each notification
          title,
          message,
          type,
          user_id: user.id,
          action_url: action_url || null,
          is_read: false
        }));
        
        const { error } = await supabase
          .from('notifications')
          .insert(bulkNotifications);

        if (error) throw error;
        
        toast.success(`Created notifications for ${users.length} users`);
      } else if (recipient === "specific") {
        // Create for one specific user
        const { error } = await supabase
          .from('notifications')
          .insert({
            id: crypto.randomUUID(), // Generate a UUID for the notification
            title,
            message,
            type,
            user_id: selectedUserId,
            action_url: action_url || null,
            is_read: false
          });

        if (error) throw error;
        
        toast.success("Notification created successfully");
      }
      
      // Reset form
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        action_url: "",
        recipient: "all"
      });
      setSelectedUserId("");
      
      // Close dialog and refresh
      document.querySelector('[data-state="open"] button[data-state="open"]')?.click();
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "error":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Notifications Management</CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} />
                  New Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Notification</DialogTitle>
                </DialogHeader>
                <form onSubmit={createNotification} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={newNotification.title} 
                      onChange={handleInputChange} 
                      placeholder="Notification title" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={newNotification.message} 
                      onChange={handleInputChange} 
                      placeholder="Notification message" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="action_url">Action URL (Optional)</Label>
                    <Input 
                      id="action_url" 
                      name="action_url" 
                      value={newNotification.action_url} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com/action" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipients</Label>
                    <Select 
                      value={newNotification.recipient} 
                      onValueChange={handleRecipientChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="specific">Specific User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newNotification.recipient === "specific" && (
                    <div className="space-y-2">
                      <Label htmlFor="user">Select User</Label>
                      <Select value={selectedUserId} onValueChange={handleUserChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button type="submit">Create Notification</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Mark All Read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterNotifications().length > 0 ? (
                  filterNotifications().map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {getTypeIcon(notification.type)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-left justify-start">
                              {notification.title}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getTypeIcon(notification.type)}
                                {notification.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="whitespace-pre-wrap">{notification.message}</p>
                              </div>
                              
                              {notification.action_url && (
                                <div className="flex items-center gap-2">
                                  <Link size={14} className="text-muted-foreground" />
                                  <a 
                                    href={notification.action_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    {notification.action_url}
                                  </a>
                                </div>
                              )}
                              
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock size={14} />
                                  {notification.created_at && format(new Date(notification.created_at), 'PPpp')}
                                </div>
                                <Badge variant={notification.is_read ? "outline" : "default"}>
                                  {notification.is_read ? "Read" : "Unread"}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-muted-foreground" />
                          <span>{notification.profiles?.full_name || 'Unknown User'}</span>
                          <span className="text-xs text-muted-foreground">
                            ({notification.profiles?.email || 'No email'})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          {notification.created_at && format(new Date(notification.created_at), 'PP')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.is_read ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <BellOff size={12} />
                            Read
                          </Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Bell size={12} />
                            Unread
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!notification.is_read && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No notifications found
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

export default AdminNotifications;
