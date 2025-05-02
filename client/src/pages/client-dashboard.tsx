import { useEffect, useState } from "react";
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
import { Client, Company, Hero, Contract, JobRequest, Prospect } from "@shared/schema";

// Extended Hero type with prospect data
interface EnhancedHero extends Hero {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  position?: string;
}
import { Building2, Plus, Users, FileSignature, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function ClientDashboard() {
  const { hasPermission } = useMockAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user has permission to access this page
  if (!hasPermission(MODULES.CLIENT_DASHBOARD)) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                You do not have permission to access the client dashboard. You need the "client_dashboard" permission to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  // Fetch only the client associated with the current user
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Get current user's client directly from API
  const { data: userClient } = useQuery<Client>({
    queryKey: ['/api/user/client'],
  });

  // Set client based on user's associated client or first client as fallback
  useEffect(() => {
    if (userClient) {
      setSelectedClient(userClient);
    } else if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients, userClient, selectedClient]);

  // Fetch companies for the selected client
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: [`/api/clients/${selectedClient?.id}/companies`],
    enabled: !!selectedClient,
  });

  // Fetch heroes for the selected client
  const { data: heroes = [], isLoading: isLoadingHeroes } = useQuery<EnhancedHero[]>({
    queryKey: [`/api/clients/${selectedClient?.id}/heroes`],
    enabled: !!selectedClient,
  });

  // Fetch contracts for the selected client
  const { data: contracts = [], isLoading: isLoadingContracts } = useQuery<Contract[]>({
    queryKey: [`/api/clients/${selectedClient?.id}/contracts`],
    enabled: !!selectedClient,
  });

  // Fetch job requests for the selected client
  const { data: jobRequests = [], isLoading: isLoadingRequests } = useQuery<JobRequest[]>({
    queryKey: ['/api/job-requests'],
    enabled: !!selectedClient,
  });

  // Filter job requests for current client
  const clientJobRequests = jobRequests.filter(req => req.clientId === selectedClient?.id);

  // Loading state
  if (isLoadingClients) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Dashboard>
    );
  }

  // Empty state
  if (clients.length === 0) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[500px] text-center">
            <CardHeader>
              <CardTitle>No Clients Found</CardTitle>
              <CardDescription>There are no clients associated with your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Contact your administrator to associate your account with a client.</p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
      </div>

      {selectedClient && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold">
                  {companies.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Registered companies</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Heroes
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold">
                  {heroes.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Active heroes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center">
                  <FileSignature className="w-5 h-5 mr-2 text-primary" />
                  Contracts
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold">
                  {contracts.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Active contracts</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="heroes">Heroes</TabsTrigger>
              <TabsTrigger value="requests">Job Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-primary" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Basic Information</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground block">Company Name</span>
                            <span className="font-medium">{selectedClient.name}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground block">Contact Person</span>
                            <span className="font-medium">{selectedClient.contactPerson || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground block">Email</span>
                            <span className="font-medium">{selectedClient.email || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground block">Phone</span>
                            <span className="font-medium">{selectedClient.phone || "Not specified"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Your Companies</h3>
                        {companies.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No companies registered yet</p>
                        ) : (
                          <ul className="space-y-2">
                            {companies.map(company => (
                              <li key={company.id} className="border rounded-md p-2">
                                <div className="font-medium">{company.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {company.industry || "Industry not specified"}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="heroes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Your Heroes
                  </CardTitle>
                  <CardDescription>
                    Heroes currently contracted with your company
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {heroes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No heroes contracted yet</p>
                      <p className="text-sm text-muted-foreground">
                        Contact your RemoteHero manager to find the perfect talent for your needs
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Hero</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Contract</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {heroes.map(hero => {
                            const heroContract = contracts.find(c => c.heroId === hero.id);
                            return (
                              <TableRow key={hero.id}>
                                <TableCell>
                                  <div className="font-medium">
                                    {hero.firstName && hero.lastName 
                                      ? `${hero.firstName} ${hero.lastName}`
                                      : `Hero #${hero.id}`}
                                  </div>
                                  {hero.position && (
                                    <div className="text-sm text-muted-foreground">{hero.position}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {hero.startDate ? new Date(hero.startDate).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {heroContract ? (
                                    <Badge variant={
                                      heroContract.status === 'active' ? 'default' : 
                                      heroContract.status === 'signed' ? 'secondary' : 
                                      'outline'
                                    }>
                                      {heroContract.status.charAt(0).toUpperCase() + heroContract.status.slice(1)}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">No Contract</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/hero/${hero.id}`}>View Details</Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="requests" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-primary" />
                      Job Requests
                    </CardTitle>
                    <CardDescription>
                      Manage your job requests
                    </CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/job-requests">
                      <Plus className="h-4 w-4 mr-1" />
                      New Request
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {clientJobRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No job requests submitted yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a new job request to find the perfect talent for your needs
                      </p>
                      <Button asChild>
                        <Link href="/job-requests">
                          <Plus className="h-4 w-4 mr-1" />
                          New Job Request
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientJobRequests.map(request => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="font-medium">{request.title}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  request.status === 'approved' ? 'default' : 
                                  request.status === 'pending' ? 'secondary' : 
                                  request.status === 'rejected' ? 'destructive' : 
                                  'outline'
                                }>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(request.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/job-requests?id=${request.id}`}>View Details</Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </Dashboard>
  );
}