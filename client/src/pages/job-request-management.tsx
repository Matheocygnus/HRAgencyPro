import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { JobRequest, JobOpening } from '@shared/schema';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Loader2, 
  Filter, 
  Search, 
  Briefcase, 
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

// Form schema for request review
const reviewSchema = z.object({
  notes: z.string().optional(),
});

export default function JobRequestManagementPage() {
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JobRequest | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const { user } = useMockAuth();

  // Set up form for review notes
  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      notes: '',
    }
  });

  // Fetch all job requests
  const { data: jobRequests, isLoading: isLoadingRequests } = useQuery<JobRequest[]>({
    queryKey: ['/api/job-requests'],
    enabled: true
  });

  // Mutation to approve a job request
  const approveRequestMutation = useMutation({
    mutationFn: async (data: { id: number; notes?: string }) => {
      const res = await apiRequest('POST', `/api/job-requests/${data.id}/approve`, { notes: data.notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: 'Request Approved',
        description: 'The job request has been approved successfully.',
      });
      setSelectedRequest(null);
      setIsApproveDialogOpen(false);
      setIsDetailSheetOpen(false);
      reviewForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message || 'There was an error approving the request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to reject a job request
  const rejectRequestMutation = useMutation({
    mutationFn: async (data: { id: number; notes?: string }) => {
      const res = await apiRequest('POST', `/api/job-requests/${data.id}/reject`, { notes: data.notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: 'Request Rejected',
        description: 'The job request has been rejected.',
      });
      setSelectedRequest(null);
      setIsRejectDialogOpen(false);
      setIsDetailSheetOpen(false);
      reviewForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection Failed',
        description: error.message || 'There was an error rejecting the request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to publish a job request to careers page
  const publishRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/job-requests/${id}/publish`, {});
      return await res.json();
    },
    onSuccess: (data: JobOpening) => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/job-openings'] });
      toast({
        title: 'Request Published',
        description: `The job request has been published to the careers page as Job #${data.id}.`,
      });
      setSelectedRequest(null);
      setIsPublishDialogOpen(false);
      setIsDetailSheetOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Publication Failed',
        description: error.message || 'There was an error publishing the request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Handle approving a request
  const handleApproveRequest = (formData: z.infer<typeof reviewSchema>) => {
    if (!selectedRequest) return;
    approveRequestMutation.mutate({ 
      id: selectedRequest.id, 
      notes: formData.notes 
    });
  };

  // Handle rejecting a request
  const handleRejectRequest = (formData: z.infer<typeof reviewSchema>) => {
    if (!selectedRequest) return;
    rejectRequestMutation.mutate({ 
      id: selectedRequest.id, 
      notes: formData.notes 
    });
  };

  // Handle publishing a request
  const handlePublishRequest = () => {
    if (!selectedRequest) return;
    publishRequestMutation.mutate(selectedRequest.id);
  };

  // Handle view request details
  const handleViewRequest = (request: JobRequest) => {
    setSelectedRequest(request);
    reviewForm.reset({
      notes: request.notes || '',
    });
    setIsDetailSheetOpen(true);
  };

  // Filter and sort requests
  const filteredRequests = jobRequests?.filter(request => {
    // First apply text search
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.jobType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply status filter
    if (statusFilter === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && request.status === statusFilter;
  }).sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300"><ExternalLink className="h-3 w-3 mr-1" /> Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Request Management</h1>
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
          <div className="bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-transparent border-none text-sm font-medium focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all-requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all-requests">
            <Briefcase className="mr-2 h-4 w-4" /> All Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-requests">
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
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>Client #{request.clientId}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>{request.jobType}</TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No job requests have been submitted yet.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Request Detail Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Job Request Details</SheetTitle>
            <SheetDescription>
              Review the job request and take appropriate action.
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedRequest.title}</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p>{selectedRequest.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Job Type</h4>
                  <p>{selectedRequest.jobType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Salary Range</h4>
                  <p>{selectedRequest.salary || "Not specified"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Job Description</h4>
                  <div className="max-h-[160px] overflow-y-auto border rounded-md p-3 bg-gray-50">
                    <p className="whitespace-pre-line text-sm">{selectedRequest.description}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Requirements</h4>
                  <div className="max-h-[160px] overflow-y-auto border rounded-md p-3 bg-gray-50">
                    <p className="whitespace-pre-line text-sm">{selectedRequest.requirements}</p>
                  </div>
                </div>
              </div>
              
              {selectedRequest.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Additional Notes</h4>
                  <div className="max-h-[100px] overflow-y-auto border rounded-md p-3 bg-gray-50">
                    <p className="whitespace-pre-line text-sm">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Feedback Notes</h4>
                <Form {...reviewForm}>
                  <form>
                    <FormField
                      control={reviewForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Add your feedback or notes about this request" 
                              className="min-h-[60px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>
          )}
          
          <SheetFooter className="mt-6 flex space-x-2">
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsApproveDialogOpen(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            
            {selectedRequest?.status === 'approved' && (
              <Button
                onClick={() => setIsPublishDialogOpen(true)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Publish to Careers
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Approve Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Job Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this job request? 
              After approval, the request can be published to the careers page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={reviewForm.handleSubmit(handleApproveRequest)}
              disabled={approveRequestMutation.isPending}
            >
              {approveRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Job Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this job request? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={reviewForm.handleSubmit(handleRejectRequest)}
              disabled={rejectRequestMutation.isPending}
            >
              {rejectRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish Dialog */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish to Careers Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this job request to the careers page? 
              This will create a public job listing based on the request details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishRequest}
              disabled={publishRequestMutation.isPending}
            >
              {publishRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}