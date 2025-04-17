import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Calendar as CalendarIcon2, Plus, Search, MoreHorizontal, Video, UserCheck, ClipboardCheck, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Dashboard from '@/components/layout/Dashboard';
import { Interview, Prospect, User } from '@shared/schema';
import VideoConference from '@/components/video/VideoConference';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2 } from 'lucide-react';

// Define the interview form schema
const interviewFormSchema = z.object({
  prospectId: z.number({
    required_error: "Please select a prospect.",
  }),
  title: z.string({
    required_error: "Please enter an interview title.",
  }).min(3, {
    message: "Title must be at least 3 characters.",
  }),
  scheduledDate: z.date({
    required_error: "Please select a date and time.",
  }),
  duration: z.number({
    required_error: "Please enter duration in minutes.",
  }).min(15, {
    message: "Duration must be at least 15 minutes.",
  }),
  meetingLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  interviewerIds: z.array(z.number()).min(1, {
    message: "Please select at least one interviewer.",
  }),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"], {
    required_error: "Please select a status.",
  }),
});

type InterviewFormValues = z.infer<typeof interviewFormSchema>;

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

interface InterviewFormProps {
  interview?: Interview;
  onSuccess?: () => void;
}

function InterviewForm({ interview, onSuccess }: InterviewFormProps) {
  const { toast } = useToast();
  const [isGeneratingMeetLink, setIsGeneratingMeetLink] = useState(false);
  
  // Fetch prospects for dropdown
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ['/api/prospects'],
  });
  
  // Fetch users for interviewers dropdown
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Default values when editing an existing interview
  const defaultValues: Partial<InterviewFormValues> = interview
    ? {
        prospectId: interview.prospectId,
        title: interview.title,
        scheduledDate: new Date(interview.scheduledDate),
        duration: interview.duration,
        meetingLink: interview.meetingLink || undefined,
        interviewerIds: Array.isArray(interview.interviewerIds) 
          ? interview.interviewerIds.map(id => typeof id === 'string' ? parseInt(id) : id)
          : [],
        notes: interview.notes || undefined,
        status: interview.status as "scheduled" | "completed" | "cancelled",
      }
    : {
        title: '',
        duration: 30,
        status: 'scheduled' as const,
        interviewerIds: [],
      };
  
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues,
  });
  
  // Create or update interview
  const mutation = useMutation({
    mutationFn: async (data: InterviewFormValues) => {
      // Convert date to ISO string to ensure proper serialization
      const formattedData = {
        ...data,
        scheduledDate: data.scheduledDate.toISOString(),
      };
      
      if (interview) {
        // Update existing interview
        const res = await apiRequest('PUT', `/api/interviews/${interview.id}`, formattedData);
        return await res.json();
      } else {
        // Create new interview
        const res = await apiRequest('POST', '/api/interviews', formattedData);
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: interview ? "Interview updated" : "Interview scheduled",
        description: interview 
          ? "The interview has been updated successfully." 
          : "The interview has been scheduled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/interviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/interviews/upcoming'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${interview ? 'update' : 'schedule'} interview: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: InterviewFormValues) => {
    mutation.mutate(data);
  };
  
  // Generate a mock Google Meet link
  const generateMeetLink = () => {
    setIsGeneratingMeetLink(true);
    
    // Simulate API call to generate a meet link
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 10);
      form.setValue('meetingLink', `https://meet.google.com/${randomId}`);
      setIsGeneratingMeetLink(false);
      
      toast({
        title: "Meeting link generated",
        description: "A Google Meet link has been generated for this interview.",
      });
    }, 1000);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="prospectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prospect</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={interview !== undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a prospect" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prospects.map((prospect) => (
                      <SelectItem key={prospect.id} value={prospect.id.toString()}>
                        {prospect.firstName} {prospect.lastName} - {prospect.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Technical Interview" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date and Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP p")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = new Date(field.value || new Date());
                          date.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(date);
                        }}
                        defaultValue={field.value ? format(field.value, "HH:mm") : "09:00"}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interviewerIds"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Interviewers</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {users
                      .filter(user => (user.roleId === 1 || user.roleId === 2))
                      .map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
                            field.value?.includes(user.id)
                              ? "bg-primary/20 border border-primary/30"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => {
                            const currentIds = field.value || [];
                            const newIds = currentIds.includes(user.id)
                              ? currentIds.filter(id => id !== user.id)
                              : [...currentIds, user.id];
                            field.onChange(newIds);
                          }}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>
                              {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="meetingLink"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Meeting Link</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="Google Meet URL" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateMeetLink}
                    disabled={isGeneratingMeetLink}
                  >
                    {isGeneratingMeetLink ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Video className="h-4 w-4 mr-2" />
                    )}
                    {isGeneratingMeetLink ? "Generating..." : "Generate"}
                  </Button>
                </div>
                <FormDescription>
                  Generate a Google Meet link or enter a custom meeting URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes or preparation instructions for the interview"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {interview ? "Update Interview" : "Schedule Interview"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function InterviewsPage() {
  const { toast } = useToast();
  const [isVideoConferenceOpen, setVideoConferenceOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch interviews
  const { data: interviews = [], isLoading } = useQuery<Interview[]>({
    queryKey: ['/api/interviews'],
  });
  
  // Fetch prospects for reference
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ['/api/prospects'],
  });
  
  // Fetch users for reference
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Update interview status mutation
  const updateInterviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // For status-only updates, we don't need to worry about the date conversion
      const res = await apiRequest('PUT', `/api/interviews/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The interview status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/interviews'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update interview status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const getProspectName = (prospectId: number) => {
    const prospect = prospects.find(p => p.id === prospectId);
    return prospect ? `${prospect.firstName} ${prospect.lastName}` : "Unknown";
  };
  
  const getInterviewers = (interviewerIds: number[] | string[] | null) => {
    if (!interviewerIds) return "None";
    
    return (interviewerIds as number[]).map(id => {
      const user = users.find(u => u.id === id);
      return user ? `${user.firstName} ${user.lastName}` : "Unknown";
    }).join(", ");
  };
  
  // Filter interviews based on search query and active tab
  const filteredInterviews = interviews
    .filter(interview => {
      const prospectName = getProspectName(interview.prospectId);
      const interviewerNames = getInterviewers(interview.interviewerIds);
      
      // Search matching
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        prospectName.toLowerCase().includes(searchLower) ||
        interview.title.toLowerCase().includes(searchLower) ||
        interviewerNames.toLowerCase().includes(searchLower);
        
      // Tab filtering
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'upcoming') {
        const now = new Date();
        return matchesSearch && new Date(interview.scheduledDate) > now && interview.status === 'scheduled';
      }
      if (activeTab === 'completed') return matchesSearch && interview.status === 'completed';
      if (activeTab === 'cancelled') return matchesSearch && interview.status === 'cancelled';
      
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  
  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Interviews</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Interview Management</CardTitle>
            <CardDescription>
              Schedule, track, and manage all candidate interviews in one place.
            </CardDescription>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search interviews by name, title, etc..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No interviews found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : "Schedule your first interview by clicking the button above"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <Card key={interview.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <div className="flex items-center">
                            <div>
                              <h3 className="text-lg font-medium">{interview.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                with <span className="font-medium">{getProspectName(interview.prospectId)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={statusColors[interview.status as keyof typeof statusColors]}
                            >
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  Edit Interview
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {interview.status !== 'completed' && (
                                  <DropdownMenuItem
                                    onClick={() => updateInterviewMutation.mutate({ id: interview.id, status: 'completed' })}
                                  >
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {interview.status !== 'cancelled' && (
                                  <DropdownMenuItem
                                    onClick={() => updateInterviewMutation.mutate({ id: interview.id, status: 'cancelled' })}
                                  >
                                    Cancel Interview
                                  </DropdownMenuItem>
                                )}
                                {interview.status !== 'scheduled' && (
                                  <DropdownMenuItem
                                    onClick={() => updateInterviewMutation.mutate({ id: interview.id, status: 'scheduled' })}
                                  >
                                    Reschedule
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start mt-4">
                          <div className="flex items-start space-x-2">
                            <CalendarIcon2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Date & Time</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(interview.scheduledDate), "PPP")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(interview.scheduledDate), "p")} ({interview.duration} mins)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Interviewers</p>
                              <p className="text-sm text-muted-foreground">
                                {getInterviewers(interview.interviewerIds)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Meeting Link</p>
                              {interview.meetingLink ? (
                                <Button 
                                  variant="link" 
                                  className="text-sm p-0 h-auto text-primary hover:underline"
                                  onClick={() => {
                                    // Get the current user
                                    const currentUser = {
                                      id: 1, // This would be the actual user ID
                                      firstName: "Admin", // This would be the actual user's first name
                                      lastName: "User", // This would be the actual user's last name
                                      username: "admin" // This would be the actual username
                                    };
                                    
                                    // Open the VideoConference component as a modal
                                    setVideoConferenceOpen(true);
                                    setSelectedInterviewId(interview.id);
                                  }}
                                >
                                  Join Meeting
                                </Button>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No link provided</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {interview.notes && (
                          <div className="mt-4">
                            <Separator className="my-2" />
                            <div className="flex items-start space-x-2 mt-2">
                              <ClipboardCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {interview.notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add New Interview Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <DialogDescription>
              Schedule an interview with a prospect. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <InterviewForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Interview Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Interview</DialogTitle>
            <DialogDescription>
              Update the interview details below.
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <InterviewForm
              interview={selectedInterview}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Video Conference Modal */}
      {isVideoConferenceOpen && selectedInterviewId && (
        <VideoConference
          currentUser={{
            id: 1, // This would be the actual user ID
            firstName: "Admin", // This would be the actual user's first name
            lastName: "User", // This would be the actual user's last name
            username: "admin" // This would be the actual username
          }}
          interviewId={selectedInterviewId}
          onClose={() => {
            setVideoConferenceOpen(false);
            setSelectedInterviewId(null);
          }}
        />
      )}
    </Dashboard>
  );
}