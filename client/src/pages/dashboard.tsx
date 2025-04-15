import Dashboard from "@/components/layout/Dashboard";
import StatCard from "@/components/statistics/StatCard";
import HiringPipeline from "@/components/pipeline/HiringPipeline";
import ActivitySection from "@/components/activity/ActivitySection";
import ActionsList from "@/components/actions/ActionsList";
import { useQuery } from "@tanstack/react-query";
import { Prospect, Hero, Client, Invoice } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, UserRound, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
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
  
  // Calculate counts
  const upcomingInterviewsCount = 12; // Demo data - would come from actual interviews
  const matchedProspectsCount = 24;   // Demo data - would come from actual matches
  const pendingTasksCount = 9;        // Demo data - would come from actual tasks
  
  // Calculate actual data
  const activeProspectsCount = prospects.filter(p => p.status !== "hired" && p.status !== "rejected").length;
  const heroesCount = heroes.length;
  const activeClientsCount = clients.filter(c => c.status === "active").length;
  const pendingInvoicesCount = invoices.filter(i => i.status === "pending").length;
  
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
            <button className={cn(
              "py-2 px-1 text-sm font-medium border-b-2 -mb-px",
              "border-primary text-primary"
            )}>
              Interviews
            </button>
            <button className={cn(
              "py-2 px-1 text-sm font-medium border-b-2 -mb-px",
              "border-transparent text-slate-500 hover:text-slate-700"
            )}>
              Pending Tasks
            </button>
          </div>
        </div>
        
        {/* Recent Prospect Activity */}
        <div className="mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              {/* Mock entries - would be replaced with actual data */}
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Michael Johnson</h3>
                    <p className="text-sm text-slate-500">Applied for Full-stack Developer position</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500">Added 2 days ago</span>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="default" className="bg-primary">Match</Button>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Sarah Williams</h3>
                    <p className="text-sm text-slate-500">Applied for UX Designer position</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500">Added 3 days ago</span>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="default" className="bg-primary">Match</Button>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
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
            subtitle="3 new this week"
            icon={FileText}
            iconColor="text-emerald-600"
          />
        </div>
      </div>
    </Dashboard>
  );
}
