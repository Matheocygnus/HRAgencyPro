import { useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Client, Company, JobRequest, InsertJobRequest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Dashboard from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Job Request Form Schema
const jobRequestSchema = z.object({
  companyId: z.string().min(1, { message: "Company is required" }),
  title: z.string().min(3, { message: "Role title is required" }),
  numberOfPositions: z.string().min(1, { message: "Number of positions is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  description: z.string().min(10, { message: "Overall responsibilities is required" }),
  mustHaveSkills: z.array(z.object({
    skill: z.string().min(1, { message: "Skill is required" }),
    proficiency: z.string().min(1, { message: "Proficiency is required" }),
  })).min(1, { message: "At least one must-have skill is required" }),
  goodToHaveSkills: z.array(z.object({
    skill: z.string(),
    proficiency: z.string(),
  })),
  jobType: z.string().min(1, { message: "Work shift is required" }),
  reportsTo: z.string().min(1, { message: "Reports to information is required" }),
  languages: z.array(z.string()).min(1, { message: "At least one language is required" }),
  requiresTesting: z.boolean(),
  salary: z.string().min(1, { message: "Salary range is required" }),
  notes: z.string(),
  location: z.string().default("Remote"),
  requirements: z.string().default(""),
});

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id);
  const { toast } = useToast();
  const { user, isClient } = useAuth();
  const [isJobRequestDialogOpen, setIsJobRequestDialogOpen] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  
  // Check if the current user is authorized to view this client
  const isAuthorized = isClient ? user?.clientId === clientId : true;
  
  // Fetch client data
  const { data: client, isLoading: isClientLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
    enabled: !!clientId && isAuthorized,
  });

  // Fetch client companies
  const { data: companies = [], isLoading: isCompaniesLoading } = useQuery<Company[]>({
    queryKey: [`/api/clients/${clientId}/companies`],
    enabled: !!clientId && isAuthorized,
  });

  // Fetch client job requests
  const { data: jobRequests = [], isLoading: isJobRequestsLoading } = useQuery<JobRequest[]>({
    queryKey: [`/api/clients/${clientId}/job-requests`],
    enabled: !!clientId && isAuthorized,
  });

  // Job request form with the required fields
  const form = useForm<JobRequestFormValues>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      companyId: "",
      title: "",
      numberOfPositions: "1",
      startDate: "",
      description: "",
      mustHaveSkills: [{ skill: "", proficiency: "intermediate" }],
      goodToHaveSkills: [{ skill: "", proficiency: "basic" }],
      jobType: "full_time",
      reportsTo: "",
      languages: ["English"],
      requiresTesting: false,
      salary: "",
      notes: "",
      location: "Remote",
      requirements: "",
    },
  });

  // Add/remove skill fields
  const addMustHaveSkill = () => {
    const currentSkills = form.getValues("mustHaveSkills");
    form.setValue("mustHaveSkills", [
      ...currentSkills,
      { skill: "", proficiency: "intermediate" },
    ]);
  };

  const removeMustHaveSkill = (index: number) => {
    const currentSkills = form.getValues("mustHaveSkills");
    if (currentSkills.length > 1) {
      form.setValue(
        "mustHaveSkills",
        currentSkills.filter((_, i) => i !== index)
      );
    }
  };

  const addGoodToHaveSkill = () => {
    const currentSkills = form.getValues("goodToHaveSkills");
    form.setValue("goodToHaveSkills", [
      ...currentSkills,
      { skill: "", proficiency: "basic" },
    ]);
  };

  const removeGoodToHaveSkill = (index: number) => {
    const currentSkills = form.getValues("goodToHaveSkills");
    if (currentSkills.length > 1) {
      form.setValue(
        "goodToHaveSkills",
        currentSkills.filter((_, i) => i !== index)
      );
    }
  };

  // Create job request mutation
  const createJobRequestMutation = useMutation({
    mutationFn: async (data: JobRequestFormValues) => {
      // Format the request data for API
      const formattedSkills = {
        mustHave: data.mustHaveSkills.map(s => `${s.skill} (${s.proficiency})`).join(", "),
        goodToHave: data.goodToHaveSkills.filter(s => s.skill).map(s => `${s.skill} (${s.proficiency})`).join(", ")
      };
      
      const languagesStr = data.languages.join(", ");
      
      // Create a detailed requirements string from the form data
      const detailedRequirements = `
Number of Positions: ${data.numberOfPositions}
Starting Date: ${data.startDate}
Must-Have Skills: ${formattedSkills.mustHave}
Good-to-Have Skills: ${formattedSkills.goodToHave}
Reports To: ${data.reportsTo}
Languages: ${languagesStr}
Testing Required: ${data.requiresTesting ? 'Yes' : 'No'}
Salary Range: ${data.salary}
${data.notes ? `Additional Notes: ${data.notes}` : ''}
      `.trim();
      
      const jobRequestData: InsertJobRequest = {
        clientId,
        companyId: parseInt(data.companyId),
        title: data.title,
        description: data.description,
        requirements: detailedRequirements,
        location: data.location,
        jobType: data.jobType as any,
        salary: data.salary,
        notes: data.notes,
      };
      
      const res = await apiRequest("POST", `/api/clients/${clientId}/job-requests`, jobRequestData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job request submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/job-requests`] });
      setIsJobRequestDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: JobRequestFormValues) => {
    createJobRequestMutation.mutate(data);
  };

  // Toggle request details expansion
  const toggleRequestDetails = (requestId: number) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  // Handle loading states
  if (isClientLoading) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  // Handle not found
  if (!client) {
    return (
      <Dashboard>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground">
            The client you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Client Profile: {client.name}</h1>
        <Button onClick={() => setIsJobRequestDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                <p>{client.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{client.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={client.status === "active" ? "default" : "secondary"}>
                  {client.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent>
            {isCompaniesLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : companies.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No companies found for this client.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((company) => (
                  <Card key={company.id} className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>{company.industry || "N/A"}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        <span className="font-medium">Size:</span> {company.size || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {company.location || "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Requests</CardTitle>
          <CardDescription>
            Create and manage your job position requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isJobRequestsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : jobRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No job requests found.</p>
              <Button variant="outline" onClick={() => setIsJobRequestDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Job Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobRequests.map((request) => (
                <Card key={request.id} className="border border-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription>
                          {request.companyName || "Unknown Company"} • 
                          {request.jobType === "full_time" ? " Full-time" : " Part-time"}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          request.status === "approved" ? "default" : 
                          request.status === "rejected" ? "destructive" : 
                          request.status === "published" ? "default" : 
                          "secondary"
                        } 
                        className={request.status === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm mb-2">{request.description.substring(0, 120)}...</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center mt-1 px-0"
                      onClick={() => toggleRequestDetails(request.id)}
                    >
                      {expandedRequestId === request.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" /> 
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" /> 
                          View Details
                        </>
                      )}
                    </Button>
                    
                    {expandedRequestId === request.id && (
                      <div className="mt-4 pl-4 border-l-2 border-border">
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <div className="whitespace-pre-line text-sm mb-4">
                          {request.requirements}
                        </div>
                        
                        {request.notes && (
                          <>
                            <h4 className="font-medium mb-2">Additional Notes</h4>
                            <p className="text-sm mb-4">{request.notes}</p>
                          </>
                        )}
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Created on {new Date(request.createdAt).toLocaleDateString()}</p>
                          <p>Last updated on {new Date(request.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Request Form Dialog */}
      <Dialog open={isJobRequestDialogOpen} onOpenChange={setIsJobRequestDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Request</DialogTitle>
            <DialogDescription>
              Fill in the details to submit a new job position request.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Selection */}
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Positions */}
                <FormField
                  control={form.control}
                  name="numberOfPositions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many roles do you need for this position?</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Overall Responsibilities */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the main responsibilities for this role"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Must-Have Skills */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Must-Have Skills and Proficiency</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMustHaveSkill}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Skill
                  </Button>
                </div>
                {form.getValues("mustHaveSkills").map((_, index) => (
                  <div key={`must-have-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <FormField
                      control={form.control}
                      name={`mustHaveSkills.${index}.skill`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Skill name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`mustHaveSkills.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Proficiency level" />
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
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMustHaveSkill(index)}
                        disabled={form.getValues("mustHaveSkills").length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Good-to-Have Skills */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Good-to-Have Skills and Proficiency</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGoodToHaveSkill}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Skill
                  </Button>
                </div>
                {form.getValues("goodToHaveSkills").map((_, index) => (
                  <div key={`good-to-have-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <FormField
                      control={form.control}
                      name={`goodToHaveSkills.${index}.skill`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Skill name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`goodToHaveSkills.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Proficiency level" />
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
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGoodToHaveSkill(index)}
                        disabled={form.getValues("goodToHaveSkills").length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Shift */}
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Shift</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work shift" />
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

                {/* Role Reports To */}
                <FormField
                  control={form.control}
                  name="reportsTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role reports to (Name and position)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Smith, CTO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Languages */}
              <FormField
                control={form.control}
                name="languages"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Languages needed</FormLabel>
                      <FormDescription>
                        Select all languages required for this role
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("English")}
                                onCheckedChange={(checked) => {
                                  const currentVal = field.value || [];
                                  return checked
                                    ? field.onChange([...currentVal, "English"])
                                    : field.onChange(
                                        currentVal.filter((v) => v !== "English")
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">English</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("Spanish")}
                                onCheckedChange={(checked) => {
                                  const currentVal = field.value || [];
                                  return checked
                                    ? field.onChange([...currentVal, "Spanish"])
                                    : field.onChange(
                                        currentVal.filter((v) => v !== "Spanish")
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Spanish</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("French")}
                                onCheckedChange={(checked) => {
                                  const currentVal = field.value || [];
                                  return checked
                                    ? field.onChange([...currentVal, "French"])
                                    : field.onChange(
                                        currentVal.filter((v) => v !== "French")
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">French</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Testing Preference */}
                <FormField
                  control={form.control}
                  name="requiresTesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Would you do a test to the candidates?</FormLabel>
                        <FormDescription>
                          Check this if you want candidates to complete a technical test
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Salary Range */}
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormDescription>
                      Any additional information to take into consideration during the search
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional requirements or preferences"
                        className="min-h-[100px]"
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
                  onClick={() => setIsJobRequestDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createJobRequestMutation.isPending}>
                  {createJobRequestMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}