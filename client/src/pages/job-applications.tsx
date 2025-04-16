import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { JobApplication, JobOpening } from "@shared/schema";
import { Loader2, MoreHorizontal, Search, Filter, UserPlus, ExternalLink, File } from "lucide-react";

// Status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | null }> = {
  "new": { label: "New", variant: "default" },
  "reviewing": { label: "Reviewing", variant: "secondary" },
  "interviewing": { label: "Interviewing", variant: "outline" },
  "rejected": { label: "Rejected", variant: "destructive" },
  "hired": { label: "Hired", variant: null },
  "converted": { label: "Converted to Prospect", variant: "secondary" },
};

export default function JobApplicationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);

  // Fetch job applications
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<JobApplication[]>({
    queryKey: ["/api/job-applications"],
  });

  // Fetch job openings to display job titles
  const { data: jobOpenings = [] } = useQuery<JobOpening[]>({
    queryKey: ["/api/job-openings"],
  });

  // Mutation to update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/job-applications/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications"] });
      toast({
        title: "Status updated",
        description: "The application status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the application status.",
        variant: "destructive",
      });
    },
  });

  // Mutation to convert application to prospect
  const convertToProspectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/job-applications/${id}/convert-to-prospect`, {});
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      toast({
        title: "Application converted",
        description: `Successfully converted to prospect #${data.prospect.id}.`,
      });
      setIsConvertDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Conversion failed",
        description: error.message || "There was an error converting the application to a prospect.",
        variant: "destructive",
      });
    },
  });

  // Get job title by ID
  const getJobTitle = (jobId: number) => {
    const job = jobOpenings.find((j) => j.id === jobId);
    return job ? job.title : `Job #${jobId}`;
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getJobTitle(app.jobOpeningId).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle viewing application details
  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };

  // Handle converting to prospect
  const handleConvertToProspect = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsConvertDialogOpen(true);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Applications</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border px-3 py-2 rounded-md">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="bg-transparent border-0 outline-none text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewing">Interviewing</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
                <option value="converted">Converted to Prospect</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingApplications ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No applications found. Adjust your search or filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => {
                      const statusConfig = STATUS_BADGES[application.status] || STATUS_BADGES.new;

                      return (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.firstName} {application.lastName}
                          </TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{application.phone}</TableCell>
                          <TableCell>{getJobTitle(application.jobOpeningId)}</TableCell>
                          <TableCell>
                            {new Date(application.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(application)}
                                title="View Details"
                              >
                                <File className="h-4 w-4" />
                              </Button>
                              
                              {application.status !== "converted" && application.status !== "hired" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleConvertToProspect(application)}
                                  title="Convert to Prospect"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      if (application.resumeUrl) {
                                        window.open(application.resumeUrl, '_blank');
                                      } else {
                                        toast({
                                          title: "No Resume Available",
                                          description: "This application does not have a resume URL.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Resume
                                  </DropdownMenuItem>
                                  
                                  {application.status !== "converted" && (
                                    <>
                                      <DropdownMenuItem 
                                        onClick={() => 
                                          updateStatusMutation.mutate({ id: application.id, status: "reviewing" })
                                        }
                                      >
                                        Mark as Reviewing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => 
                                          updateStatusMutation.mutate({ id: application.id, status: "interviewing" })
                                        }
                                      >
                                        Mark as Interviewing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => 
                                          updateStatusMutation.mutate({ id: application.id, status: "rejected" })
                                        }
                                      >
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => 
                                          updateStatusMutation.mutate({ id: application.id, status: "hired" })
                                        }
                                      >
                                        Mark as Hired
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </h3>
                <Badge variant={STATUS_BADGES[selectedApplication.status]?.variant || "default"}>
                  {STATUS_BADGES[selectedApplication.status]?.label || selectedApplication.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{selectedApplication.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p>{getJobTitle(selectedApplication.jobOpeningId)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Resume</p>
                {selectedApplication.resumeUrl ? (
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resume
                  </a>
                ) : (
                  <p className="text-muted-foreground italic">No resume uploaded</p>
                )}
              </div>

              {selectedApplication.coverLetter && (
                <div>
                  <p className="text-sm text-muted-foreground">Cover Letter</p>
                  <div className="border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                    <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p>{selectedApplication.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                {selectedApplication.status !== "converted" && selectedApplication.status !== "hired" && (
                  <Button 
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setIsConvertDialogOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convert to Prospect
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Convert to Prospect Confirmation Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Prospect</DialogTitle>
            <DialogDescription>
              This will create a new prospect in the pipeline based on this application.
              The application will be marked as converted.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <p>
                Convert <span className="font-semibold">{selectedApplication.firstName} {selectedApplication.lastName}</span> into a prospect?
              </p>
              <p className="text-sm text-muted-foreground">
                The prospect will be created with information from this application and placed in the "Sourcing" status.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConvertDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => convertToProspectMutation.mutate(selectedApplication.id)}
                  disabled={convertToProspectMutation.isPending}
                >
                  {convertToProspectMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to Prospect"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}