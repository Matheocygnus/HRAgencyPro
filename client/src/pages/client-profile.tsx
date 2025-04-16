import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InsertJobRequest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Remove SkillLevel import since it's not being used
import { Badge } from "@/components/ui/badge";

// Define job request form schema
const jobRequestSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  numberOfPositions: z.coerce.number().min(1, { message: "At least one position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  responsibilities: z.string().min(1, { message: "Responsibilities are required" }),
  mustHaveSkills: z.string().min(1, { message: "Must-have skills are required" }),
  goodToHaveSkills: z.string(),
  workSchedule: z.string().min(1, { message: "Work schedule is required" }),
  reportingStructure: z.string().min(1, { message: "Reporting structure is required" }),
  requiredLanguages: z.string().min(1, { message: "Required languages are required" }),
  testingProcess: z.string(),
  salaryRangeMin: z.coerce.number().min(1, { message: "Minimum salary is required" }),
  salaryRangeMax: z.coerce.number().min(1, { message: "Maximum salary is required" }),
  notes: z.string(),
});

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

export default function ClientProfile() {
  const { id } = useParams();
  const clientId = id ? parseInt(id, 10) : undefined;
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [jobRequestDialogOpen, setJobRequestDialogOpen] = useState(false);

  // Verify access rights - user must be admin or the client themselves
  const hasAccess = () => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    return user.role === 'client' && user.clientId === clientId;
  };

  // Redirect if no access
  useEffect(() => {
    if (user && !hasAccess()) {
      toast({
        title: "Access denied",
        description: "You don't have permission to view this client profile",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, clientId, setLocation]);

  // Fetch client data
  const { 
    data: client, 
    isLoading: isLoadingClient,
    error: clientError
  } = useQuery({
    queryKey: ['/api/clients', clientId],
    queryFn: () => {
      if (!clientId) return Promise.reject("No client ID provided");
      return apiRequest('GET', `/api/clients/${clientId}`)
        .then(res => res.json());
    },
    enabled: !!clientId && !!user
  });

  // Fetch client's job requests
  const { 
    data: jobRequests, 
    isLoading: isLoadingJobRequests 
  } = useQuery({
    queryKey: ['/api/clients', clientId, 'job-requests'],
    queryFn: () => {
      if (!clientId) return Promise.reject("No client ID provided");
      return apiRequest('GET', `/api/clients/${clientId}/job-requests`)
        .then(res => res.json());
    },
    enabled: !!clientId && !!user
  });

  // Create job request form
  const jobRequestForm = useForm<JobRequestFormValues>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      numberOfPositions: 1,
      startDate: "",
      responsibilities: "",
      mustHaveSkills: "",
      goodToHaveSkills: "",
      workSchedule: "",
      reportingStructure: "",
      requiredLanguages: "",
      testingProcess: "",
      salaryRangeMin: 0,
      salaryRangeMax: 0,
      notes: "",
    }
  });

  // Create job request mutation
  const createJobRequestMutation = useMutation({
    mutationFn: async (data: JobRequestFormValues) => {
      if (!clientId) throw new Error("No client ID provided");
      
      // Convert our form data to match the schema
      const jobRequestData: InsertJobRequest = {
        title: data.title,
        description: data.description,
        clientId: clientId,
        // Company ID is required, use 1 as a temporary value (will be set by admin)
        companyId: 1,
        // Combine the form fields into a structured requirements field
        requirements: JSON.stringify({
          numberOfPositions: data.numberOfPositions,
          startDate: data.startDate,
          responsibilities: data.responsibilities,
          mustHaveSkills: data.mustHaveSkills,
          goodToHaveSkills: data.goodToHaveSkills,
          reportingStructure: data.reportingStructure,
          requiredLanguages: data.requiredLanguages,
          testingProcess: data.testingProcess || null,
          salaryRange: {
            min: data.salaryRangeMin,
            max: data.salaryRangeMax
          }
        }),
        // Use work schedule as location temporarily
        location: data.workSchedule,
        // Default to full_time but can be adjusted
        jobType: "full_time" as const,
        // Store any additional notes
        notes: data.notes || null,
        // Salary range as string
        salary: `$${data.salaryRangeMin} - $${data.salaryRangeMax}`,
      };
      
      const response = await apiRequest('POST', '/api/job-requests', jobRequestData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job request created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'job-requests'] });
      setJobRequestDialogOpen(false);
      jobRequestForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create job request: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: JobRequestFormValues) => {
    createJobRequestMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            Please log in to view this client profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingClient) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load client data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">Client Profile</p>
        </div>
        <Button 
          onClick={() => setJobRequestDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Job Request
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="job-requests">Job Requests</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                View and manage client details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Client Name</Label>
                  <div className="text-lg">{client.name}</div>
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <div className="text-lg">{client.contactPerson}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="text-lg">{client.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="text-lg">{client.phone || "Not provided"}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="text-lg">
                    <Badge 
                      variant={client.status === "active" ? "default" : "secondary"}
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Requests</CardTitle>
              <CardDescription>
                View and manage job requests for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingJobRequests ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !jobRequests || jobRequests.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No job requests found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setJobRequestDialogOpen(true)}
                  >
                    Create a job request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobRequests.map((request: any) => (
                    <Card key={request.id} className="hover:bg-accent/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{request.title}</CardTitle>
                            <CardDescription>Positions: {request.numberOfPositions}</CardDescription>
                          </div>
                          <Badge 
                            variant={
                              request.status === "approved" ? "default" :
                              request.status === "pending" ? "secondary" :
                              request.status === "rejected" ? "destructive" :
                              "outline"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.description.substring(0, 150)}
                          {request.description.length > 150 ? "..." : ""}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            Salary: ${request.salaryRangeMin} - ${request.salaryRangeMax}
                          </Badge>
                          <Badge variant="outline">
                            Start: {new Date(request.startDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>
                View and manage contracts for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={jobRequestDialogOpen} onOpenChange={setJobRequestDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Job Request</DialogTitle>
            <DialogDescription>
              Fill in the form to create a new job request
            </DialogDescription>
          </DialogHeader>
          
          <Form {...jobRequestForm}>
            <form onSubmit={jobRequestForm.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobRequestForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobRequestForm.control}
                    name="numberOfPositions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Positions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobRequestForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief overview of the position..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobRequestForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobRequestForm.control}
                    name="workSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Schedule/Shift</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="flexible">Flexible hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobRequestForm.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the main duties and responsibilities..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobRequestForm.control}
                    name="mustHaveSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Must-have Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List required skills, separated by commas..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobRequestForm.control}
                    name="goodToHaveSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Good-to-have Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List preferred skills, separated by commas..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobRequestForm.control}
                  name="reportingStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Structure</FormLabel>
                      <FormControl>
                        <Input placeholder="Reports to..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobRequestForm.control}
                  name="requiredLanguages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Languages</FormLabel>
                      <FormControl>
                        <Input placeholder="English, Spanish..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobRequestForm.control}
                  name="testingProcess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Process Preferences</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your preferred testing/interview process..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={jobRequestForm.control}
                    name="salaryRangeMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Minimum)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobRequestForm.control}
                    name="salaryRangeMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Maximum)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={jobRequestForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other requirements or notes..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setJobRequestDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createJobRequestMutation.isPending}
                >
                  {createJobRequestMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Job Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}