import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { JobOpening, InsertJobOpening, JobApplication, JobRequest, Client } from '@shared/schema';
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
import { FormDescription } from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Eye, 
  PenSquare, 
  Loader2, 
  Plus, 
  Search, 
  Briefcase, 
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  ClipboardCheck,
  FileText,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Dashboard from '@/components/layout/Dashboard';

// Form schema for job posting with validation
const jobOpeningSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  requirements: z.string().min(20, { message: 'Requirements must be at least 20 characters' }),
  location: z.string().min(2, { message: 'Location is required' }),
  jobType: z.enum(["full_time", "part_time", "contract", "remote"], { 
    errorMap: () => ({ message: 'Please select a valid job type' })
  }),
  salary: z.string().optional(),
  isActive: z.boolean().default(true),
  clientId: z.number().nullable().optional(),
  companyId: z.number().nullable().optional()
});

// Form schema for application status update
const applicationStatusSchema = z.object({
  status: z.enum(["rejected", "converted"]),
  notes: z.string().optional()
});



// Component to display job requests from clients
function JobRequestsContent({ searchTerm }: { searchTerm: string }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Fetch all job requests
  const { data: jobRequests, isLoading } = useQuery<JobRequest[]>({
    queryKey: ['/api/job-requests'],
    enabled: true
  });

  // Fetch all clients for detailed information
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: true
  });

  // Filter job requests based on search term
  const filteredRequests = jobRequests?.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.clientName && request.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (request.companyName && request.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Find client details by clientId
  const getClientDetails = (clientId: number) => {
    return clients?.find(client => client.id === clientId);
  };

  // Toggle row expansion
  const toggleRowExpansion = (requestId: number) => {
    if (expandedRow === requestId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(requestId);
    }
  };

  // Mutation to approve a job request
  const approveRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/job-requests/${id}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: "Job Request Approved",
        description: "The job request has been approved successfully.",
      });
    }
  });

  // Mutation to reject a job request
  const rejectRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/job-requests/${id}/reject`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      toast({
        title: "Job Request Rejected",
        description: "The job request has been rejected.",
      });
    }
  });

  // Mutation to publish a job request as a job opening
  const publishRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/job-requests/${id}/publish`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/job-openings'] });
      toast({
        title: "Job Published",
        description: "The job has been published and is now visible to applicants.",
      });
    }
  });

  // Get badge color based on request status
  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'published':
        return <Badge variant="default">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle approve button click
  const handleApprove = (id: number) => {
    approveRequestMutation.mutate(id);
  };

  // Handle reject button click
  const handleReject = (id: number) => {
    rejectRequestMutation.mutate(id);
  };

  // Handle publish button click
  const handlePublish = (id: number) => {
    publishRequestMutation.mutate(id);
  };

  return (
    <>
      {isLoading ? (
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
                <TableHead>Company</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <TableRow className={expandedRow === request.id ? "border-b-0" : ""}>
                    <TableCell className="font-medium">{request.title}</TableCell>
                    <TableCell>
                      {request.clientName || (request.clientId ? getClientDetails(request.clientId)?.name : 'Unknown Client')}
                    </TableCell>
                    <TableCell>{request.companyName || 'Unknown Company'}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleRowExpansion(request.id)}
                          className="text-muted-foreground"
                          title="View Details"
                        >
                          {expandedRow === request.id ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              disabled={approveRequestMutation.isPending}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              disabled={rejectRequestMutation.isPending}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePublish(request.id)}
                            disabled={publishRequestMutation.isPending}
                            className="text-primary"
                          >
                            <Briefcase className="h-4 w-4 mr-1" /> Publish
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row with Details */}
                  {expandedRow === request.id && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Job Description</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {request.description || "No description provided."}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Requirements</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {request.requirements || "No requirements specified."}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Location</h4>
                            <p className="text-sm text-muted-foreground">
                              {request.location || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Job Type</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {request.jobType?.replace('_', ' ') || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Salary Range</h4>
                            <p className="text-sm text-muted-foreground">
                              {request.salary || "Not specified"}
                            </p>
                          </div>
                        </div>
                        
                        {request.notes && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Additional Notes</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {request.notes}
                            </p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No job requests found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search." : "When clients submit job requests, they'll appear here."}
          </p>
        </div>
      )}
    </>
  );
}

// Component to display all applications across all job openings
function AllApplicationsContent({ 
  handleViewApplication, 
  getStatusBadge,
  searchTerm
}: { 
  handleViewApplication: (application: JobApplication) => void;
  getStatusBadge: (status: string) => JSX.Element;
  searchTerm: string;
}) {
  // Fetch all job applications
  const { data: allApplications, isLoading } = useQuery<JobApplication[]>({
    queryKey: ['/api/job-applications'],
    enabled: true
  });
  
  // Fetch job openings to display job titles
  const { data: jobOpenings } = useQuery<JobOpening[]>({
    queryKey: ['/api/job-openings'],
    enabled: true
  });
  
  // Filter applications based on search
  const filteredApplications = allApplications?.filter(app => 
    app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get job title for an application
  const getJobTitle = (jobOpeningId: number) => {
    const job = jobOpenings?.find(j => j.id === jobOpeningId);
    return job ? job.title : 'Unknown Job';
  };
  
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredApplications && filteredApplications.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Job Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.firstName} {app.lastName}</TableCell>
                  <TableCell>{getJobTitle(app.jobOpeningId)}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewApplication(app)}
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
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No applications found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search." : "When candidates apply to any job, they will appear here."}
          </p>
        </div>
      )}
    </>
  );
}

export default function JobManagementPage() {
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isApplicationSheetOpen, setIsApplicationSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useMockAuth();

  // Set up form for job posting
  const jobForm = useForm<z.infer<typeof jobOpeningSchema>>({
    resolver: zodResolver(jobOpeningSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'full_time',
      salary: '',
      isActive: true,
      clientId: null,
      companyId: null
    }
  });

  // Set up form for application status update
  const statusForm = useForm<z.infer<typeof applicationStatusSchema>>({
    resolver: zodResolver(applicationStatusSchema),
    defaultValues: {
      status: 'rejected',
      notes: ''
    }
  });

  // Fetch all job openings
  const { data: jobOpenings, isLoading: isLoadingJobs } = useQuery<JobOpening[]>({
    queryKey: ['/api/job-openings'],
    enabled: true
  });

  // Fetch applications for the selected job opening
  const { data: applications, isLoading: isLoadingApplications } = useQuery<JobApplication[]>({
    queryKey: ['/api/job-openings', selectedJobId, 'applications'],
    queryFn: async () => {
      if (!selectedJobId) return [];
      const res = await apiRequest('GET', `/api/job-openings/${selectedJobId}/applications`);
      return await res.json();
    },
    enabled: selectedJobId !== null
  });

  // Mutation to create a new job opening
  const createJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobOpeningSchema>) => {
      const res = await apiRequest('POST', '/api/job-openings', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-openings'] });
      toast({
        title: 'Job Posted',
        description: 'The job opening has been successfully posted.',
      });
      jobForm.reset();
      setIsJobFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Post Failed',
        description: error.message || 'There was an error posting the job. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to update an existing job opening
  const updateJobMutation = useMutation({
    mutationFn: async (data: { id: number; jobData: Partial<InsertJobOpening> }) => {
      const res = await apiRequest('PUT', `/api/job-openings/${data.id}`, data.jobData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-openings'] });
      toast({
        title: 'Job Updated',
        description: 'The job opening has been successfully updated.',
      });
      jobForm.reset();
      setIsJobFormOpen(false);
      setIsEditMode(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating the job. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to update application status
  // Function to get job title for an application
  const getJobTitle = (jobOpeningId: number): string => {
    const job = jobOpenings?.find(j => j.id === jobOpeningId);
    return job ? job.title : 'Unknown Position';
  };

  // Create prospect mutation
  const createProspectMutation = useMutation({
    mutationFn: async (application: JobApplication) => {
      // Create new prospect from job application
      const prospectData = {
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        position: getJobTitle(application.jobOpeningId),
        skills: "",
        status: "sourcing", // Start in sourcing column in the Kanban board
        notes: `Converted from job application. Original application notes: ${application.notes || ''}`,
        resume: application.resumeUrl
      };
      
      const res = await apiRequest('POST', '/api/prospects', prospectData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prospects'] });
      toast({
        title: 'Application Converted',
        description: 'The application has been successfully converted to a prospect.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Conversion Failed',
        description: error.message || 'There was an error converting the application to a prospect. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const updateApplicationStatusMutation = useMutation({
    mutationFn: async (data: { id: number; statusData: z.infer<typeof applicationStatusSchema> }) => {
      const res = await apiRequest('PUT', `/api/job-applications/${data.id}`, data.statusData);
      return await res.json();
    },
    onSuccess: (updatedApplication, variables) => {
      if (selectedJobId) {
        queryClient.invalidateQueries({ queryKey: ['/api/job-openings', selectedJobId, 'applications'] });
      }
      
      // If status is "converted", create a prospect
      if (variables.statusData.status === "converted" && selectedApplication) {
        createProspectMutation.mutate(selectedApplication);
      } else {
        toast({
          title: 'Status Updated',
          description: 'The application status has been successfully updated.',
        });
      }
      
      setSelectedApplication(null);
      statusForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating the application status. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Handle form submission for creating/updating job openings
  const handleJobFormSubmit = (data: z.infer<typeof jobOpeningSchema>) => {
    if (isEditMode && selectedJobId) {
      updateJobMutation.mutate({ id: selectedJobId, jobData: data });
    } else {
      createJobMutation.mutate(data);
    }
  };

  // Handle form submission for updating application status
  const handleStatusFormSubmit = (data: z.infer<typeof applicationStatusSchema>) => {
    if (selectedApplication) {
      updateApplicationStatusMutation.mutate({ 
        id: selectedApplication.id, 
        statusData: data 
      });
    }
  };

  // Handle edit job button click
  const handleEditJob = (job: JobOpening) => {
    setSelectedJobId(job.id);
    setIsEditMode(true);
    
    // Set form values
    jobForm.reset({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      jobType: job.jobType,
      salary: job.salary || '',
      isActive: job.isActive,
      clientId: job.clientId,
      companyId: job.companyId
    });
    
    setIsJobFormOpen(true);
  };

  // Handle view applications button click
  const handleViewApplications = (jobId: number) => {
    setSelectedJobId(jobId);
  };

  // Handle view application details
  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    statusForm.reset({
      // Set default status to rejected if existing status is not one of our allowed values
      status: application.status === "rejected" || application.status === "converted" 
        ? application.status 
        : "rejected",
      notes: application.notes || ''
    });
    setIsApplicationSheetOpen(true);
  };

  // Filter jobs based on search term
  const filteredJobs = jobOpenings?.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'in_review':
        return <Badge variant="default">In Review</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Interview</Badge>;
      case 'offered':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Offered</Badge>;
      case 'hired':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Hired</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Converted to Prospect</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dashboard>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              className="pl-10 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            setIsEditMode(false);
            jobForm.reset({
              title: '',
              description: '',
              requirements: '',
              location: '',
              jobType: 'full_time',
              salary: '',
              isActive: true,
              clientId: null,
              companyId: null
            });
            setIsJobFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">
            <Briefcase className="mr-2 h-4 w-4" /> Job Openings
          </TabsTrigger>
          <TabsTrigger value="applications">
            <ClipboardCheck className="mr-2 h-4 w-4" /> Applications
          </TabsTrigger>
          <TabsTrigger value="requests">
            <FileText className="mr-2 h-4 w-4" /> Job Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          {isLoadingJobs ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>
                        {job.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewApplications(job.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditJob(job)}
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
              <h3 className="text-lg font-medium">No job openings found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new job posting.'}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications">
          {/* Unified Applications Tab */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">
                {selectedJobId 
                  ? `Applications for: ${jobOpenings?.find(j => j.id === selectedJobId)?.title}` 
                  : 'All Applications'}
              </h2>
              {selectedJobId && (
                <Button 
                  variant="ghost"
                  className="ml-4" 
                  onClick={() => setSelectedJobId(null)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> View All
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!selectedJobId && (
                <Select 
                  onValueChange={(value) => value !== "all" ? setSelectedJobId(parseInt(value)) : setSelectedJobId(null)}
                >
                  <SelectTrigger className="w-[230px]">
                    <SelectValue placeholder="Filter by Job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobOpenings?.map(job => (
                      <SelectItem key={job.id} value={job.id.toString()}>{job.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {selectedJobId ? (
            // Specific job applications view
            <>
              {isLoadingApplications ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.firstName} {app.lastName}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewApplication(app)}
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
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No applications yet</h3>
                  <p className="text-muted-foreground">
                    When candidates apply, they'll appear here.
                  </p>
                </div>
              )}
            </>
          ) : (
            // All applications view
            <AllApplicationsContent 
              handleViewApplication={handleViewApplication}
              getStatusBadge={getStatusBadge}
              searchTerm={searchTerm}
            />
          )}
        </TabsContent>

        <TabsContent value="requests">
          {/* Job Requests Tab */}
          <JobRequestsContent searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>

      {/* Job Form Dialog */}
      <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Make changes to the job posting below.' 
                : 'Fill out the form below to create a new job posting.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...jobForm}>
            <form onSubmit={jobForm.handleSubmit(handleJobFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={jobForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior React Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Remote, New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobForm.control}
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
                  control={jobForm.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">Full-time</SelectItem>
                          <SelectItem value="part_time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Job Status</FormLabel>
                        <FormDescription className="text-xs">
                          {field.value ? "Visible on careers page" : "Not visible to applicants"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div>
                  {/* Empty space for alignment */}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the role, responsibilities, and qualifications..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the required skills, experience, and qualifications..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsJobFormOpen(false);
                    setIsEditMode(false);
                    jobForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createJobMutation.isPending || updateJobMutation.isPending}
                >
                  {(createJobMutation.isPending || updateJobMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Posting...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Job' : 'Post Job'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Application Details Sheet */}
      <Sheet open={isApplicationSheetOpen} onOpenChange={setIsApplicationSheetOpen}>
        <SheetContent className="max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
            <SheetDescription>
              Review and manage application from {selectedApplication?.firstName} {selectedApplication?.lastName}
            </SheetDescription>
          </SheetHeader>
          
          {selectedApplication && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date Applied</h3>
                  <p>{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p>{selectedApplication.firstName} {selectedApplication.lastName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                    <p>{selectedApplication.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{selectedApplication.email}</p>
                </div>
              </div>
              
              {selectedApplication.resumeUrl && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Resume</h3>
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    View Resume
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              )}
              
              {selectedApplication.voiceMessageUrl && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Voice Message</h3>
                  <a 
                    href={selectedApplication.voiceMessageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    Listen to Voice Message
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              )}
              
              {selectedApplication.coverLetter && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Cover Letter</h3>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Update Status</h3>
                <Form {...statusForm}>
                  <form onSubmit={statusForm.handleSubmit(handleStatusFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={statusForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rejected">
                                  <div className="flex items-center">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </div>
                                </SelectItem>
                                <SelectItem value="converted">
                                  <div className="flex items-center">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Convert to Prospect
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-7">
                        <div className="flex items-center space-x-2">
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => setIsApplicationSheetOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            size="sm"
                            disabled={updateApplicationStatusMutation.isPending}
                          >
                            {updateApplicationStatusMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              'Update Status'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <FormField
                      control={statusForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add notes about this candidate (internal only)..."
                              className="min-h-[80px]"
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
        </SheetContent>
      </Sheet>
    </div>
    </Dashboard>
  );
}