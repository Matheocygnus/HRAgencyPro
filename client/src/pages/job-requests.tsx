import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { JobRequest, InsertJobRequest } from '@shared/schema';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  PenSquare, 
  Loader2, 
  Plus, 
  Search, 
  Briefcase, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Form schema for job request with validation
const jobRequestSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  requirements: z.string().min(20, { message: 'Requirements must be at least 20 characters' }),
  location: z.string().min(2, { message: 'Location is required' }),
  jobType: z.enum(["full_time", "part_time", "contract", "remote"], { 
    errorMap: () => ({ message: 'Please select a valid job type' })
  }),
  salary: z.string().optional(),
  clientId: z.number(),
  companyId: z.number(),
  notes: z.string().optional(),
});

export default function JobRequestsPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useMockAuth();

  // Set up form for job request
  const requestForm = useForm<z.infer<typeof jobRequestSchema>>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'full_time',
      salary: '',
      clientId: 1, // Mock client ID for development
      companyId: 1, // Mock company ID for development
      notes: ''
    }
  });

  // Fetch client's job requests
  const { data: jobRequests, isLoading: isLoadingRequests } = useQuery<JobRequest[]>({
    queryKey: ['/api/job-requests'],
    enabled: true
  });

  // Mutation to create a new job request
  const createRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobRequestSchema>) => {
      const res = await apiRequest('POST', '/api/job-requests', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: 'Request Submitted',
        description: 'Your job request has been successfully submitted for review.',
      });
      requestForm.reset();
      setIsRequestFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to update an existing job request
  const updateRequestMutation = useMutation({
    mutationFn: async (data: { id: number; requestData: Partial<InsertJobRequest> }) => {
      const res = await apiRequest('PUT', `/api/job-requests/${data.id}`, data.requestData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: 'Request Updated',
        description: 'Your job request has been successfully updated.',
      });
      requestForm.reset();
      setIsRequestFormOpen(false);
      setIsEditMode(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating your request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Handle form submission for creating/updating job requests
  const handleRequestFormSubmit = (data: z.infer<typeof jobRequestSchema>) => {
    if (isEditMode && selectedRequestId) {
      updateRequestMutation.mutate({ id: selectedRequestId, requestData: data });
    } else {
      createRequestMutation.mutate(data);
    }
  };

  // Handle edit request button click
  const handleEditRequest = (request: JobRequest) => {
    setSelectedRequestId(request.id);
    setIsEditMode(true);
    
    // Set form values
    requestForm.reset({
      title: request.title,
      description: request.description,
      requirements: request.requirements,
      location: request.location,
      jobType: request.jobType,
      salary: request.salary || '',
      clientId: request.clientId,
      companyId: request.companyId,
      notes: request.notes || ''
    });
    
    setIsRequestFormOpen(true);
  };

  // Filter requests based on search term
  const filteredRequests = jobRequests?.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.jobType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Requests</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requests..."
              className="pl-10 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setIsEditMode(false);
            requestForm.reset({
              title: '',
              description: '',
              requirements: '',
              location: '',
              jobType: 'full_time',
              salary: '',
              clientId: 1, // Mock client ID for development
              companyId: 1, // Mock company ID for development
              notes: ''
            });
            setIsRequestFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> New Job Request
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-requests">
            <Briefcase className="mr-2 h-4 w-4" /> My Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-requests">
          {isLoadingRequests ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>{request.jobType}</TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditRequest(request)}
                            disabled={request.status !== 'pending'}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No job requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new job request.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Request Form Dialog */}
      <Dialog open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Job Request' : 'New Job Request'}</DialogTitle>
            <DialogDescription>
              Submit your job position request for approval. Once approved, it will be published to the careers page.
            </DialogDescription>
          </DialogHeader>
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleRequestFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={requestForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Remote, New York, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestForm.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={requestForm.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  {/* Empty space for alignment */}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={requestForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the role, responsibilities, and what you're looking for in a candidate." 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={requestForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the skills, qualifications, and experience required for this position." 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={requestForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about the position or hiring process." 
                        className="min-h-[60px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsRequestFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createRequestMutation.isPending || updateRequestMutation.isPending}
                >
                  {(createRequestMutation.isPending || updateRequestMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditMode ? 'Update Request' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}