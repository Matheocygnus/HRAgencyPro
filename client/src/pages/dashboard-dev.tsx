import { useState, useEffect } from "react";
import DashboardDev from "@/components/layout/DashboardDev";
import StatCard from "@/components/statistics/StatCard";
import HiringPipeline from "@/components/pipeline/HiringPipeline";
import ActivitySection from "@/components/activity/ActivitySection";
import ActionsList from "@/components/actions/ActionsList";
import { Prospect, Hero, Client, Invoice } from "@shared/schema";

// Mock data for development
const mockProspects: Partial<Prospect>[] = [
  { 
    id: 1, 
    firstName: "John", 
    lastName: "Smith", 
    email: "john@example.com", 
    position: "Frontend Developer", 
    status: "sourcing", 
    clientId: 1, 
    skills: "React, TypeScript",
    createdAt: new Date(),
  },
  { 
    id: 2, 
    firstName: "Emily", 
    lastName: "Johnson", 
    email: "emily@example.com", 
    position: "Backend Developer", 
    status: "interview", 
    clientId: 1, 
    skills: "Node.js, MongoDB",
    createdAt: new Date(),
  },
  { 
    id: 3, 
    firstName: "Michael", 
    lastName: "Brown", 
    email: "michael@example.com", 
    position: "Data Scientist", 
    status: "client_review", 
    clientId: 2, 
    skills: "Python, Django",
    createdAt: new Date(),
  },
  { 
    id: 4, 
    firstName: "Jessica", 
    lastName: "Williams", 
    email: "jessica@example.com", 
    position: "UX Designer", 
    status: "budget", 
    clientId: 2, 
    skills: "Figma, Adobe XD",
    createdAt: new Date(),
  },
  { 
    id: 5, 
    firstName: "David", 
    lastName: "Miller", 
    email: "david@example.com", 
    position: "DevOps Engineer", 
    status: "hired", 
    clientId: 1, 
    skills: "AWS, Docker",
    createdAt: new Date(),
  },
  { 
    id: 6, 
    firstName: "Sarah", 
    lastName: "Davis", 
    email: "sarah@example.com", 
    position: "Project Manager", 
    status: "rejected", 
    clientId: 3, 
    skills: "Agile, Scrum",
    createdAt: new Date(),
  },
  { 
    id: 7, 
    firstName: "Robert", 
    lastName: "Wilson", 
    email: "robert@example.com", 
    position: "Mobile Developer", 
    status: "sourcing", 
    clientId: 3, 
    skills: "React Native, Flutter",
    createdAt: new Date(),
  },
  { 
    id: 8, 
    firstName: "Jennifer", 
    lastName: "Garcia", 
    email: "jennifer@example.com", 
    position: "Backend Developer", 
    status: "interview", 
    clientId: 1, 
    skills: "PHP, Laravel",
    createdAt: new Date(),
  },
];

const mockHeroes: Partial<Hero>[] = [
  { id: 1, clientId: 1, prospectId: 5, companyId: 1, createdAt: new Date() },
  { id: 2, clientId: 2, prospectId: 3, companyId: 2, createdAt: new Date() },
  { id: 3, clientId: 1, prospectId: 2, companyId: 1, createdAt: new Date() },
];

const mockClients: Partial<Client>[] = [
  { id: 1, name: "Acme Corp", status: "active", contactPerson: "John Doe", email: "contact@acme.com", createdAt: new Date() },
  { id: 2, name: "Globex Inc", status: "active", contactPerson: "Jane Smith", email: "contact@globex.com", createdAt: new Date() },
  { id: 3, name: "Wayne Enterprises", status: "inactive", contactPerson: "Bruce Wayne", email: "bruce@wayne.com", createdAt: new Date() },
  { id: 4, name: "Stark Industries", status: "active", contactPerson: "Tony Stark", email: "tony@stark.com", createdAt: new Date() },
];

const mockInvoices: Partial<Invoice>[] = [
  { 
    id: 1, 
    invoiceNumber: "INV-001",
    contractId: 1,
    heroId: 1, 
    clientId: 1, 
    companyId: 1,
    amount: 5000, 
    status: "paid", 
    dueDate: new Date("2023-12-15"),
    createdAt: new Date()
  },
  { 
    id: 2, 
    invoiceNumber: "INV-002",
    contractId: 1,
    heroId: 1, 
    clientId: 1, 
    companyId: 1,
    amount: 4500, 
    status: "pending", 
    dueDate: new Date("2024-01-15"),
    createdAt: new Date()
  },
  { 
    id: 3, 
    invoiceNumber: "INV-003",
    contractId: 2,
    heroId: 2, 
    clientId: 2, 
    companyId: 2,
    amount: 7500, 
    status: "pending", 
    dueDate: new Date("2024-01-20"),
    createdAt: new Date()
  },
  { 
    id: 4, 
    invoiceNumber: "INV-004",
    contractId: 3,
    heroId: 3, 
    clientId: 3, 
    companyId: 3,
    amount: 3000, 
    status: "overdue", 
    dueDate: new Date("2023-12-01"),
    createdAt: new Date()
  },
];

export default function DashboardDevPage() {
  const [prospects, setProspects] = useState<Partial<Prospect>[]>([]);
  const [heroes, setHeroes] = useState<Partial<Hero>[]>([]);
  const [clients, setClients] = useState<Partial<Client>[]>([]);
  const [invoices, setInvoices] = useState<Partial<Invoice>[]>([]);
  
  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setProspects(mockProspects);
      setHeroes(mockHeroes);
      setClients(mockClients);
      setInvoices(mockInvoices);
    }, 500);
  }, []);
  
  // Calculate counts
  const activeProspectsCount = prospects.filter(p => p.status !== "hired" && p.status !== "rejected").length;
  const heroesCount = heroes.length;
  const activeClientsCount = clients.filter(c => c.status === "active").length;
  const pendingInvoicesCount = invoices.filter(i => i.status === "pending").length;
  
  return (
    <DashboardDev>
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
    </DashboardDev>
  );
}