import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Client, JobRequest, Company, JobOpening } from '@shared/schema';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  CalendarIcon,
  Loader2,
  Plus,
  Building,
  FileText,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  EyeIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import Dashboard from '@/components/layout/Dashboard';

// Form schema for job request with validation
const jobRequestSchema = z.object({
  title: z.string().min(5, { message: 'Role title must be at least 5 characters' }),
  numRoles: z.string().min(1, { message: 'Number of roles is required' }),
  startDate: z.date({ required_error: 'Estimated start date is required' }),
  responsibilities: z.string().min(20, { message: 'Responsibilities must be at least 20 characters' }),
  mustHaveSkills: z.string().min(5, { message: 'Must-have skills are required' }),
  mustHaveProficiency: z.enum(['basic', 'intermediate', 'advanced']),
  goodToHaveSkills: z.string().optional(),
  goodToHaveProficiency: z.enum(['basic', 'intermediate', 'advanced']).optional(),
  workShift: z.enum(['full_time', 'part_time']),
  reportsTo: z.string().min(5, { message: 'Reports to field is required' }),
  languages: z.array(z.string()).min(1, { message: 'At least one language is required' }),
  testRequired: z.boolean().default(false),
  salary: z.string().min(1, { message: 'Salary range is required' }),
  notes: z.string().optional(),
  companyId: z.number().optional(),
});

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

// Component to display status badge
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

export default function ClientProfilePage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useMockAuth();

  // In a real implementation, we would get the client ID from the authenticated user
  // For this demo, we'll use a mock client ID
  const clientId = 1;

  // Fetch client data
  const { data: client, isLoading: isLoadingClient } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/clients/${clientId}`);
      return await res.json();
    },
    enabled: !!clientId,
  });

  // Fetch companies for this client
  const { data: companies } = useQuery<Company[]>({
    queryKey: ['/api/clients', clientId, 'companies'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/clients/${clientId}/companies`);
      return await res.json();
    },
    enabled: !!clientId,
  });

  // Fetch job requests for this client
  const { data: jobRequests, isLoading: isLoadingRequests } = useQuery<JobRequest[]>({
    queryKey: ['/api/clients', clientId, 'job-requests'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/clients/${clientId}/job-requests`);
      return await res.json();
    },
    enabled: !!clientId,
  });

  // Initialize form for job request
  const form = useForm<JobRequestFormValues>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      title: '',
      numRoles: '1',
      startDate: new Date(),
      responsibilities: '',
      mustHaveSkills: '',
      mustHaveProficiency: 'intermediate',
      goodToHaveSkills: '',
      goodToHaveProficiency: 'basic',
      workShift: 'full_time',
      reportsTo: '',
      languages: ['english'],
      testRequired: false,
      salary: '',
      notes: '',
      companyId: companies?.[0]?.id,
    },
  });

  // Create job request mutation
  const createJobRequestMutation = useMutation({
    mutationFn: async (data: JobRequestFormValues) => {
      // Transform form values to match API expectations
      const requestData = {
        clientId,
        companyId: data.companyId || companies?.[0]?.id,
        title: data.title,
        description: `Number of roles: ${data.numRoles}\nStart Date: ${format(data.startDate, 'PPP')}\nResponsibilities: ${data.responsibilities}`,
        requirements: `Must-have Skills (${data.mustHaveProficiency}): ${data.mustHaveSkills}\nGood-to-have Skills (${data.goodToHaveProficiency || 'N/A'}): ${data.goodToHaveSkills || 'N/A'}\nLanguages: ${data.languages.join(', ')}\nTest Required: ${data.testRequired ? 'Yes' : 'No'}`,
        location: 'Remote', // Default location
        jobType: data.workShift,
        salary: data.salary,
        notes: `Reports to: ${data.reportsTo}\nAdditional Notes: ${data.notes || 'N/A'}`,
        // API will set status to 'pending' by default
      };

      const res = await apiRequest('POST', '/api/job-requests', requestData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'job-requests'] });
      toast({
        title: 'Job Request Submitted',
        description: 'Your job request has been submitted successfully and is pending approval.',
      });
      setIsRequestFormOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your job request. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle job request form submission
  const onSubmit = (data: JobRequestFormValues) => {
    createJobRequestMutation.mutate(data);
  };

  // Toggle request expansion
  const toggleRequestExpansion = (requestId: number) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  // If loading client data
  if (isLoadingClient) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{client?.name || 'Client'} Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job requests and view their status.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Client Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{client?.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{client?.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{client?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {companies && companies.length > 0 ? (
                  companies.map((company) => (
                    <div key={company.id} className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{company.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground">No companies found</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Active Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {jobRequests && jobRequests.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total:</span>
                      <span>{jobRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pending:</span>
                      <span>{jobRequests.filter(req => req.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Approved:</span>
                      <span>{jobRequests.filter(req => req.status === 'approved').length}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No requests found</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Job Requests</h2>
          <Button onClick={() => setIsRequestFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Request
          </Button>
        </div>

        {isLoadingRequests ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobRequests && jobRequests.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <TableRow className={expandedRequest === request.id ? "border-b-0" : ""}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.companyName || companies?.find(c => c.id === request.companyId)?.name || 'Unknown'}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleRequestExpansion(request.id)}
                            className="text-muted-foreground"
                            title="View Details"
                          >
                            {expandedRequest === request.id ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row with Details */}
                    {expandedRequest === request.id && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="px-4 py-3">
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
                          
                          {request.status === 'rejected' && (
                            <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                              <h4 className="text-sm font-semibold mb-1 text-destructive">Request Rejected</h4>
                              <p className="text-sm text-muted-foreground">
                                This request was rejected. Please create a new request with updated information.
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
          <div className="flex flex-col items-center justify-center h-64 text-center border rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No job requests yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first job request.</p>
            <Button onClick={() => setIsRequestFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Request
            </Button>
          </div>
        )}

        {/* Job Request Form Dialog */}
        <Dialog open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new job request. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior React Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numRoles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Roles *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Estimated Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
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
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Responsibilities *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the main responsibilities for this role..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="mustHaveSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Must-have Skills *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List skills that are required for this position..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mustHaveProficiency"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Proficiency Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select proficiency level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="goodToHaveSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Good-to-have Skills</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List skills that are nice to have but not required..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goodToHaveProficiency"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Proficiency Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select proficiency level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="workShift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Shift *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select work shift" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full_time">Full Time</SelectItem>
                              <SelectItem value="part_time">Part Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="reportsTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Reports To *</FormLabel>
                          <FormControl>
                            <Input placeholder="Name and position" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Who will this role report to? (Name and position)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Languages Needed *</FormLabel>
                        <FormDescription className="text-xs">
                          Select all languages required for this position
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['english', 'spanish', 'french'].map((language) => (
                          <FormField
                            key={language}
                            control={form.control}
                            name="languages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={language}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(language)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, language])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== language
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize">
                                    {language}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="testRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Test Required?</FormLabel>
                          <FormDescription className="text-xs">
                            Would you like candidates to take a test?
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

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {companies && companies.length > 0 && (
                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString() || companies[0].id.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Select the company this role is for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes or considerations for this position..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Any additional information that should be considered during the search
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRequestFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createJobRequestMutation.isPending}
                  >
                    {createJobRequestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Dashboard>
  );
}