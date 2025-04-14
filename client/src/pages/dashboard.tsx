import Dashboard from "@/components/layout/Dashboard";
import StatCard from "@/components/statistics/StatCard";
import HiringPipeline from "@/components/pipeline/HiringPipeline";
import ActivitySection from "@/components/activity/ActivitySection";
import ActionsList from "@/components/actions/ActionsList";
import { useQuery } from "@tanstack/react-query";
import { Prospect, Hero, Client, Invoice } from "@shared/schema";

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
  const activeProspectsCount = prospects.filter(p => p.status !== "hired" && p.status !== "rejected").length;
  const heroesCount = heroes.length;
  const activeClientsCount = clients.filter(c => c.status === "active").length;
  const pendingInvoicesCount = invoices.filter(i => i.status === "pending").length;
  
  return (
    <Dashboard>
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Prospects" 
          value={activeProspectsCount}
          icon="fa-user-tie" 
          change="12% from last month" 
          trend="up"
          color="primary"
        />
        
        <StatCard 
          title="Heroes Hired" 
          value={heroesCount}
          icon="fa-medal" 
          change="5% from last month" 
          trend="up"
          color="success"
        />
        
        <StatCard 
          title="Active Clients" 
          value={activeClientsCount}
          icon="fa-building" 
          change="No change from last month" 
          trend="neutral"
          color="warning"
        />
        
        <StatCard 
          title="Pending Invoices" 
          value={pendingInvoicesCount}
          icon="fa-file-invoice-dollar" 
          change="3 new this week" 
          trend="up"
          color="info"
        />
      </div>
      
      {/* Hiring Pipeline Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <HiringPipeline />
        </div>
      </div>
      
      {/* Activity & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivitySection />
        </div>
        <div>
          <ActionsList />
        </div>
      </div>
    </Dashboard>
  );
}
