import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Dashboard from '@/components/layout/Dashboard';
import { useToast } from '@/hooks/use-toast';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { JobRequest, Hero, Contract, Company, Client } from '@shared/schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// UI Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Icons
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Plus,
  RefreshCcw,
  User,
  FileCheck,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';

// Request form schema with validation
const jobRequestSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  requirements: z.string().min(20, { message: 'Requirements must be at least 20 characters' }),
  location: z.string().min(2, { message: 'Location is required' }),
  jobType: z.enum(['full_time', 'part_time', 'contract', 'remote'], {
    errorMap: () => ({ message: 'Please select a valid job type' }),
  }),
  salary: z.string().optional(),
  companyId: z.number().nullable().optional(),
  notes: z.string().optional(),
});

export default function ClientDashboardPage() {
  const { user } = useMockAuth();
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const { toast } = useToast();
  
  // Client information fetch
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: true,
  });
  
  // Using a mock client ID for now. In a real application, this would come from the authenticated user
  const clientId = 1; // Mock client ID for development
  
  const { data: client } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const res = await apiRequest('GET', `/api/clients/${clientId}`);
      return await res.json();
    },
    enabled: !!clientId,
  });
  
  // Get all companies for this client
  const { data: companies } = useQuery<Company[]>({
    queryKey: ['/api/clients', clientId, 'companies'],
    queryFn: async () => {
      if (!clientId) return [];
      const res = await apiRequest('GET', `/api/clients/${clientId}/companies`);
      return await res.json();
    },
    enabled: !!clientId,
  });
  
  // Get all job requests for this client
  const { data: jobRequests, isLoading: isLoadingRequests } = useQuery<JobRequest[]>({
    queryKey: ['/api/clients', clientId, 'job-requests'],
    queryFn: async () => {
      if (!clientId) return [];
      const res = await apiRequest('GET', `/api/job-requests?clientId=${clientId}`);
      return await res.json();
    },
    enabled: !!clientId,
  });
  
  // Get all heroes for this client
  const { data: heroes, isLoading: isLoadingHeroes } = useQuery<Hero[]>({
    queryKey: ['/api/clients', clientId, 'heroes'],
    queryFn: async () => {
      if (!clientId) return [];
      const res = await apiRequest('GET', `/api/clients/${clientId}/heroes`);
      return await res.json();
    },
    enabled: !!clientId,
  });
  
  // Get all contracts for this client
  const { data: contracts, isLoading: isLoadingContracts } = useQuery<Contract[]>({
    queryKey: ['/api/clients', clientId, 'contracts'],
    queryFn: async () => {
      if (!clientId) return [];
      const res = await apiRequest('GET', `/api/clients/${clientId}/contracts`);
      return await res.json();
    },
    enabled: !!clientId,
  });
  
  // Set up form for job request submission
  const requestForm = useForm<z.infer<typeof jobRequestSchema>>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'full_time',
      salary: '',
      companyId: companies && companies.length > 0 ? companies[0].id : null,
      notes: '',
    },
  });
  
  // Mutation to create a job request
  const createRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobRequestSchema>) => {
      // Include the clientId with the request data
      const requestData = {
        ...data,
        clientId,
        status: 'pending', // All new requests start as pending
      };
      const res = await apiRequest('POST', '/api/job-requests', requestData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'job-requests'] });
      toast({
        title: 'Request Submitted',
        description: 'Your job request has been submitted successfully and is pending approval.',
      });
      setIsRequestFormOpen(false);
      requestForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const handleSubmitRequest = (data: z.infer<typeof jobRequestSchema>) => {
    createRequestMutation.mutate(data);
  };
  
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
  
  // Format date helper
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Client Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {client?.contactPerson || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsRequestFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Job Request
            </Button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Job Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {jobRequests ? jobRequests.length : 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {jobRequests?.filter(req => req.status === 'published').length || 0} published
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Heroes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {heroes ? heroes.length : 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Across {contracts ? new Set(contracts.map(c => c.companyId)).size : 0} companies
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {contracts ? contracts.length : 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total monthly value: {
                  contracts
                    ? `$${contracts.reduce((sum, contract) => sum + (contract.compensation || 0), 0).toLocaleString()}`
                    : '$0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="requests">
              <FileText className="mr-2 h-4 w-4" /> Job Requests
            </TabsTrigger>
            <TabsTrigger value="heroes">
              <User className="mr-2 h-4 w-4" /> Contracted Heroes
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="mr-2 h-4 w-4" /> Your Companies
            </TabsTrigger>
          </TabsList>

          {/* Job Requests Tab */}
          <TabsContent value="requests">
            {isLoadingRequests ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobRequests && jobRequests.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Type</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>{request.companyName || 'Not specified'}</TableCell>
                        <TableCell className="capitalize">{request.jobType?.replace('_', ' ') || 'Not specified'}</TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No job requests found</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your first job request to start the hiring process.
                </p>
                <Button onClick={() => setIsRequestFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Job Request
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Heroes Tab */}
          <TabsContent value="heroes">
            {isLoadingHeroes ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : heroes && heroes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroes.map((hero) => {
                  const heroContract = contracts?.find(c => c.heroId === hero.id);
                  return (
                    <Card key={hero.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarFallback>{hero.firstName?.[0]}{hero.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{hero.firstName} {hero.lastName}</CardTitle>
                              <CardDescription className="text-sm">
                                {heroContract?.title || 'Remote Hero'}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-4">
                          {hero.skills || 'Specialized skills not specified'}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date:</span>
                            <span>{hero.startDate ? formatDate(hero.startDate) : 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Company:</span>
                            <span>{
                              heroContract 
                                ? companies?.find(c => c.id === heroContract.companyId)?.name || 'Unknown'
                                : 'Not assigned'
                            }</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract Value:</span>
                            <span>${heroContract?.compensation || '0'}/month</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <div className="flex justify-between items-center w-full">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View Contract
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No heroes contracted yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by submitting a job request to find the perfect heroes for your company.
                </p>
                <Button onClick={() => setIsRequestFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Job Request
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            {companies && companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => {
                  const companyContracts = contracts?.filter(c => c.companyId === company.id) || [];
                  const companyHeroes = heroes?.filter(h => 
                    companyContracts.some(c => c.heroId === h.id)
                  ) || [];
                  
                  return (
                    <Card key={company.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {company.name}
                        </CardTitle>
                        <CardDescription>
                          {company.industry || 'Industry not specified'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Heroes</span>
                              <span className="text-xl font-semibold">{companyHeroes.length}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Contracts</span>
                              <span className="text-xl font-semibold">{companyContracts.length}</span>
                            </div>
                          </div>
                          
                          {companyHeroes.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Active Heroes</h4>
                              <div className="flex -space-x-2 overflow-hidden">
                                {companyHeroes.slice(0, 5).map((hero, i) => (
                                  <Avatar key={hero.id} className="border-2 border-background">
                                    <AvatarFallback>{hero.firstName?.[0]}{hero.lastName?.[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {companyHeroes.length > 5 && (
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                                    +{companyHeroes.length - 5}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <Button variant="outline" className="w-full" size="sm">
                          <Building2 className="h-4 w-4 mr-1" /> View Company Details
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No companies registered</h3>
                <p className="text-muted-foreground">
                  Please contact your account manager to register your companies.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* New Job Request Dialog */}
        <Dialog open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Job Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new job position. 
                Your request will be reviewed by our team.
              </DialogDescription>
            </DialogHeader>

            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(handleSubmitRequest)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={requestForm.control}
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
                    control={requestForm.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies?.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={requestForm.control}
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
                </div>

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

                <FormField
                  control={requestForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, responsibilities, and qualifications..."
                          className="min-h-[100px]"
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
                          placeholder="List the required skills, experience, and qualifications..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or additional information..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
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
                    disabled={createRequestMutation.isPending}
                  >
                    {createRequestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit Request</>
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