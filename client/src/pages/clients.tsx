import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import ClientForm from "@/components/forms/ClientForm";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import CompanyFormDialog from "@/components/dialogs/CompanyFormDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockAuth } from "@/hooks/use-mock-auth";

export default function ClientsPage() {
  const { toast } = useToast();
  const { user } = useMockAuth();
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("clients");

  // Check if user has admin access
  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  // Fetch clients and companies
  const { data: clients = [], isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: companies = [], isLoading: isCompaniesLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Update client status mutation
  const updateClientStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/clients/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    return searchQuery === "" || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => {
    return searchQuery === "" || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Get client name by ID
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients & Companies</h1>
        {isAdmin && (
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddClientDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
            <Button variant="outline" onClick={() => setIsAddCompanyDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <CardTitle>Manage Clients & Companies</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clients" value={currentTab} onValueChange={setCurrentTab} className="mt-4">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients" className="mt-4">
              {isClientsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No clients found. {isAdmin ? "Add a new client to get started." : ""}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.contactPerson}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.phone || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                                {client.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {isAdmin && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => updateClientStatusMutation.mutate({ 
                                        id: client.id, 
                                        status: client.status === "active" ? "inactive" : "active" 
                                      })}
                                    >
                                      {client.status === "active" ? "Mark as Inactive" : "Mark as Active"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="companies" className="mt-4">
              {isCompaniesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No companies found. {isAdmin ? "Add a new company to get started." : ""}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCompanies.map((company) => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{getClientName(company.clientId)}</TableCell>
                            <TableCell>{company.industry || "N/A"}</TableCell>
                            <TableCell>{company.size || "N/A"}</TableCell>
                            <TableCell>{company.location || "N/A"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm onSuccess={() => setIsAddClientDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <CompanyFormDialog 
        isOpen={isAddCompanyDialogOpen}
        onOpenChange={setIsAddCompanyDialogOpen}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Company added successfully",
          });
        }}
      />
    </Dashboard>
  );
}