import Dashboard from "@/components/layout/Dashboard";
import StatCard from "@/components/statistics/StatCard";
import HiringPipeline from "@/components/pipeline/HiringPipeline";
import ActivitySection from "@/components/activity/ActivitySection";
import ActionsList from "@/components/actions/ActionsList";
import { useQuery } from "@tanstack/react-query";
import { Prospect, Hero, Client, Invoice, JobRequest, JobApplication } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, UserRound, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistance } from "date-fns";
import { useState } from "react";

// Helper function to format time as "X days ago", "X hours ago", etc.
const formatTimeAgo = (date: Date): string => {
  try {
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "recently";
  }
};

export default function DashboardPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'requests' | 'postulations'>('requests');
  
  // Fetch stats data
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });
  
  const { data: heroes = [] } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
  });
  
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  
  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });
  
  // Fetch job data
  const { data: jobRequests = [] } = useQuery<JobRequest[]>({
    queryKey: ["/api/job-requests"],
  });
  
  const { data: jobApplications = [] } = useQuery<JobApplication[]>({
    queryKey: ["/api/job-applications"],
  });
  
  // Calculate all counts from actual data
  const upcomingInterviewsCount = prospects.filter(p => p.status === "interview").length;
  const matchedProspectsCount = prospects.filter(p => p.status === "client_review").length;
  const pendingTasksCount = prospects.filter(p => ["sourcing", "contacted"].includes(p.status || "")).length;
  
  // Calculate additional stats
  const activeProspectsCount = prospects.filter(p => p.status !== "hired" && p.status !== "rejected").length;
  const activeClientsCount = clients.filter(c => c.status === "active").length;
  const pendingInvoicesCount = invoices.filter(i => i.status === "pending").length;
  
  // Get most recent prospects from careers (excluding database entries)
  const recentProspects = [...prospects]
    // Exclude any prospects created from our database imports
    .filter(prospect => {
      // We know it's from DB if it has notes mentioning database import
      const notesHaveDatabase = prospect.notes && 
        (prospect.notes.includes('database') || 
         prospect.notes.includes('import') || 
         prospect.notes.includes('Database'));
      
      // We use explicit null check to avoid filtering out prospects without notes
      return notesHaveDatabase !== true;
    })
    .filter(p => p.createdAt) // Ensure we have a createdAt date
    .sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    })
    .slice(0, 5);
  
  return (
    <Dashboard>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Statistics Cards - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Upcoming Interviews" 
            value={upcomingInterviewsCount}
            subtitle="Next 7 days"
            icon={Calendar}
            iconColor="text-blue-600"
          />
          
          <StatCard 
            title="Matched Prospects" 
            value={matchedProspectsCount}
            subtitle="Awaiting client review"
            icon={Target}
            iconColor="text-green-600"
          />
          
          <StatCard 
            title="Pending Tasks" 
            value={pendingTasksCount}
            subtitle="Requires your attention"
            icon={Clock}
            iconColor="text-orange-600"
          />
        </div>
        
        <div className="border-t border-slate-200 pb-4"></div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-6 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('requests')}
              className={cn(
                "py-2 px-1 text-sm font-medium border-b-2 -mb-px",
                activeTab === 'requests' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              Job Requests
            </button>
            <button 
              onClick={() => setActiveTab('postulations')}
              className={cn(
                "py-2 px-1 text-sm font-medium border-b-2 -mb-px",
                activeTab === 'postulations' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              Job Postulations
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">
                {activeTab === 'requests' ? 'Job Requests' : 'Job Postulations'}
              </h2>
            </div>
            <div className="p-6">
              {activeTab === 'requests' ? (
                // Job Requests Content
                jobRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No job requests found. Requests from clients will appear here.
                  </div>
                ) : (
                  jobRequests.map((request) => (
                    <div key={request.id} className="border-b border-slate-100 pb-4 mb-4 last:mb-0 last:border-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{request.title}</h3>
                          <p className="text-sm text-slate-500">
                            {request.companyName ? `For ${request.companyName}` : ''}
                            {request.location && ` - ${request.location}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-500">
                            {request.createdAt ? 
                              `Added ${formatTimeAgo(new Date(request.createdAt))}` : 
                              'Recently added'}
                          </span>
                          <div className="flex space-x-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="bg-primary"
                              onClick={() => window.location.href = `/job-management?view=${request.id}`}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                // Job Postulations Content
                jobApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No job applications found. Applications from candidates will appear here.
                  </div>
                ) : (
                  jobApplications.map((application) => (
                    <div key={application.id} className="border-b border-slate-100 pb-4 mb-4 last:mb-0 last:border-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{application.firstName} {application.lastName}</h3>
                          <p className="text-sm text-slate-500">
                            Applied for job ID: {application.jobOpeningId}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full", 
                            application.status === 'hired' ? "bg-green-100 text-green-800" :
                            application.status === 'rejected' ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          )}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          <div className="flex space-x-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="bg-primary"
                              onClick={() => window.location.href = `/prospects?create=${application.id}`}
                            >
                              Add to Pipeline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </Card>
        </div>
        
        {/* Statistics Cards - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Active Prospects" 
            value={activeProspectsCount}
            subtitle="In pipeline"
            icon={UserRound}
            iconColor="text-indigo-600"
          />
          
          <StatCard 
            title="Active Clients" 
            value={activeClientsCount}
            subtitle="With open positions"
            icon={Building2}
            iconColor="text-blue-600"
          />
          
          <StatCard 
            title="Pending Invoices" 
            value={pendingInvoicesCount}
            subtitle="Awaiting payment"
            icon={FileText}
            iconColor="text-emerald-600"
          />
        </div>
      </div>
    </Dashboard>
  );
}
