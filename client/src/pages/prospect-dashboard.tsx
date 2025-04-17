import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { MODULES } from "@/hooks/use-mock-auth";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Interview, Prospect } from "@shared/schema";
import { 
  Calendar, 
  FileCheck, 
  Building2, 
  Video, 
  Clock, 
  ArrowUpRight, 
  CheckSquare 
} from "lucide-react";
import { Link } from "wouter";
import VideoConference from "@/components/video/VideoConference";

export default function ProspectDashboard() {
  const { hasPermission, user } = useMockAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [activeInterviewId, setActiveInterviewId] = useState<number | undefined>(undefined);

  // Check if user has permission to access this page
  if (!hasPermission(MODULES.PROSPECT_DASHBOARD)) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                You do not have permission to access the prospect dashboard. You need the "prospect_dashboard" permission to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  // In a real app, you would only fetch the current user's prospect data
  // This is a mock implementation that fetches all prospects
  const { data: prospects = [], isLoading: isLoadingProspects } = useQuery<Prospect[]>({
    queryKey: ['/api/prospects'],
  });

  // Get interview data
  const { data: interviews = [], isLoading: isLoadingInterviews } = useQuery<Interview[]>({
    queryKey: ['/api/interviews'],
  });

  // For the mock implementation, we'll just use the first prospect as the current user
  const currentProspect = prospects[0];

  // Get upcoming interviews for the current prospect
  const upcomingInterviews = interviews
    .filter(interview => interview.prospectId === currentProspect?.id && new Date(interview.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  // Get completed interviews for the current prospect
  const completedInterviews = interviews
    .filter(interview => interview.prospectId === currentProspect?.id && interview.status === 'completed')
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  // Loading state
  if (isLoadingProspects || isLoadingInterviews) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Dashboard>
    );
  }

  // No prospect found
  if (!currentProspect) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[500px] text-center">
            <CardHeader>
              <CardTitle>No Prospect Profile Found</CardTitle>
              <CardDescription>You do not have an associated prospect profile in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Contact your RemoteHero representative for assistance.</p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prospect Dashboard</h1>
        <Badge
          variant={
            currentProspect.status === "active" ? "default" :
            currentProspect.status === "contacted" ? "secondary" :
            currentProspect.status === "interviewing" ? "outline" :
            currentProspect.status === "hired" ? "default" :
            "outline"
          }
          className="px-3 py-1 text-sm capitalize"
        >
          {currentProspect.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {upcomingInterviews.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Scheduled interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <FileCheck className="w-5 h-5 mr-2 text-primary" />
              Completed Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {completedInterviews.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Finished interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary" />
              Target Company
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold truncate">
              {currentProspect.companyId ? `Company #${currentProspect.companyId}` : "Not Assigned"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Your potential employer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Application Status</CardTitle>
                <CardDescription>Track your progress in the hiring pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground block">Name</span>
                        <span className="font-medium">{`${currentProspect.firstName} ${currentProspect.lastName}`}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Email</span>
                        <span className="font-medium">{currentProspect.email}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Phone</span>
                        <span className="font-medium">{currentProspect.phone || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Status</span>
                        <Badge
                          variant={
                            currentProspect.status === "sourcing" ? "default" :
                            currentProspect.status === "contacted" ? "secondary" :
                            currentProspect.status === "interview" ? "outline" :
                            currentProspect.status === "hired" ? "default" :
                            "outline"
                          }
                          className="mt-1"
                        >
                          {currentProspect.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Application Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground block">Source</span>
                        <span className="font-medium">{currentProspect.source || "Direct Application"}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Applied On</span>
                        <span className="font-medium">{new Date(currentProspect.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Position</span>
                        <span className="font-medium">
                          {currentProspect.position || "Remote Professional"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Budget Agreed</span>
                        <span className="font-medium">{currentProspect.isBudgetAgreed ? "Yes" : "Not yet determined"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Hiring Process Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>
                    <ul className="space-y-6">
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 rounded-full bg-green-500 p-1.5">
                          <CheckSquare className="h-4 w-4 text-white" />
                        </div>
                        <div className="font-medium">Application Received</div>
                        <div className="text-sm text-muted-foreground">{new Date(currentProspect.createdAt).toLocaleDateString()}</div>
                      </li>
                      
                      <li className="relative pl-10">
                        <div className={`absolute left-0 top-1 rounded-full p-1.5 ${currentProspect.status === "contacted" || currentProspect.status === "interview" || currentProspect.status === "hired" ? "bg-green-500" : "bg-gray-300"}`}>
                          <CheckSquare className={`h-4 w-4 ${currentProspect.status === "contacted" || currentProspect.status === "interview" || currentProspect.status === "hired" ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div className="font-medium">Initial Contact</div>
                        <div className="text-sm text-muted-foreground">
                          {currentProspect.status === "contacted" || currentProspect.status === "interview" || currentProspect.status === "hired" 
                            ? "Your application has been reviewed" 
                            : "Pending review"}
                        </div>
                      </li>
                      
                      <li className="relative pl-10">
                        <div className={`absolute left-0 top-1 rounded-full p-1.5 ${currentProspect.status === "interview" || currentProspect.status === "hired" ? "bg-green-500" : "bg-gray-300"}`}>
                          <CheckSquare className={`h-4 w-4 ${currentProspect.status === "interview" || currentProspect.status === "hired" ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div className="font-medium">Interviews</div>
                        <div className="text-sm text-muted-foreground">
                          {currentProspect.status === "interview" || currentProspect.status === "hired"
                            ? `${completedInterviews.length} completed, ${upcomingInterviews.length} upcoming`
                            : "Not yet scheduled"}
                        </div>
                      </li>
                      
                      <li className="relative pl-10">
                        <div className={`absolute left-0 top-1 rounded-full p-1.5 ${currentProspect.status === "hired" ? "bg-green-500" : "bg-gray-300"}`}>
                          <CheckSquare className={`h-4 w-4 ${currentProspect.status === "hired" ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div className="font-medium">Contract Setup</div>
                        <div className="text-sm text-muted-foreground">
                          {currentProspect.status === "hired" ? "Contract sent for signing" : "Pending interview completion"}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="interviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2 text-primary" />
                Your Interviews
              </CardTitle>
              <CardDescription>
                Upcoming and past interview sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingInterviews.length === 0 && completedInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No interviews scheduled yet</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will contact you to schedule interviews after your application is reviewed
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {upcomingInterviews.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        Upcoming Interviews
                      </h3>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Interviewer</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingInterviews.map(interview => (
                              <TableRow key={interview.id}>
                                <TableCell>
                                  <div className="font-medium">
                                    {new Date(interview.scheduledDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(interview.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </TableCell>
                                <TableCell>{interview.title || "Technical"}</TableCell>
                                <TableCell>{interview.interviewerIds?.[0] ? "RemoteHero Interviewer" : "RemoteHero Team"}</TableCell>
                                <TableCell className="text-right">
                                  {interview.meetingLink ? (
                                    <Button 
                                      size="sm" 
                                      onClick={() => {
                                        setActiveInterviewId(interview.id);
                                        setShowVideoConference(true);
                                      }}
                                    >
                                      <Video className="mr-1 h-4 w-4" />
                                      Join Meeting
                                    </Button>
                                  ) : (
                                    <Badge variant="outline">No Link Yet</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
                  {completedInterviews.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <CheckSquare className="w-4 h-4 mr-2 text-primary" />
                        Completed Interviews
                      </h3>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Interviewer</TableHead>
                              <TableHead>Outcome</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedInterviews.map(interview => (
                              <TableRow key={interview.id}>
                                <TableCell>
                                  {new Date(interview.scheduledDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{interview.title || "Technical"}</TableCell>
                                <TableCell>{interview.interviewerIds?.[0] ? "RemoteHero Interviewer" : "RemoteHero Team"}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">Completed</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Important documents related to your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No documents available yet</p>
                <p className="text-sm text-muted-foreground">
                  Documents such as offer letters and contracts will appear here after the interview process
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
}