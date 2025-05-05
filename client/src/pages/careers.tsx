import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { JobOpening, InsertJobApplication } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// Form schema for job application with validation
const applicationSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  resumeUrl: z.string().url({ message: 'Please enter a valid URL to your resume' }),
  voiceMessageUrl: z.string().url({ message: 'Please enter a valid URL to your voice message' }),
  coverLetter: z.string().optional()
});

export default function CareersPage() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Query to fetch all active job openings
  const { data: jobOpenings, isLoading } = useQuery<JobOpening[]>({
    queryKey: ['/api/job-openings/active'],
    enabled: true
  });

  // Find the selected job
  const selectedJob = selectedJobId 
    ? jobOpenings?.find(job => job.id === selectedJobId) 
    : null;

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      voiceMessageUrl: '',
      coverLetter: ''
    }
  });

  // Mutation to submit a job application
  const submitApplication = useMutation({
    mutationFn: async (data: z.infer<typeof applicationSchema>) => {
      if (!selectedJobId) throw new Error('No job selected');
      
      const applicationData: InsertJobApplication = {
        ...data,
        jobOpeningId: selectedJobId,
        status: 'new',
      };
      
      const res = await apiRequest('POST', '/api/job-applications', applicationData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof applicationSchema>) => {
    submitApplication.mutate(data);
  };

  // Handle apply button click
  const handleApply = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsDialogOpen(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group jobs by job type for tabs
  const jobTypesSet = new Set<string>();
  if (jobOpenings) {
    jobOpenings.forEach(job => {
      if (job.jobType) {
        jobTypesSet.add(job.jobType);
      }
    });
  }
  const jobTypes = Array.from(jobTypesSet);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl max-w-2xl mx-auto">
          We're looking for talented individuals to help us connect exceptional talent with innovative companies. 
          Explore our open positions below.
        </p>
      </div>

      {jobOpenings && jobOpenings.length > 0 ? (
        <Tabs defaultValue={jobTypes[0] || 'all'} className="w-full">
          <TabsList className="mb-8 flex justify-center">
            {jobTypes.map(type => (
              <TabsTrigger key={type} value={type}>
                {type === 'full_time' ? 'Full-time' : 
                 type === 'part_time' ? 'Part-time' : 
                 type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {jobTypes.map(type => (
            <TabsContent key={type} value={type} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobOpenings
                  .filter(job => job.jobType === type)
                  .map(job => (
                    <Card key={job.id} className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge>
                              {job.jobType === 'full_time' ? 'Full-time' : 
                               job.jobType === 'part_time' ? 'Part-time' : 
                               job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">{job.location}</Badge>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm">{job.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleApply(job.id)} className="w-full">
                          Apply Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No open positions at the moment</h3>
          <p className="mt-2">Please check back later for new opportunities</p>
        </div>
      )}

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Complete the form below to submit your application.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://drive.google.com/file/your-resume" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="voiceMessageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Message</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Link to your voice message recording" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a link to your recorded voice message to stand out from other candidates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us why you're interested in this position..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={submitApplication.isPending}
                >
                  {submitApplication.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
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