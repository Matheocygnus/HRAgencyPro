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
import { Prospect, Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ProspectForm from "@/components/forms/ProspectForm";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | "primary" | null }> = {
  "sourcing": { label: "Sourcing", variant: "primary" },
  "interview": { label: "Interview", variant: "secondary" },
  "client_review": { label: "Client Review", variant: "outline" },
  "budget": { label: "Budget", variant: "secondary" },
  "contract": { label: "Contract", variant: "primary" },
  "hired": { label: "Hired", variant: "default" },
  "rejected": { label: "Rejected", variant: "destructive" }
};

export default function ProspectsPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch prospects
  const { data: prospects = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch companies for dropdown
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Update prospect status mutation
  const updateProspectMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/prospects/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Prospect status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and sort prospects
  const filteredProspects = prospects
    .filter(prospect => {
      const matchesSearch = 
        searchQuery === "" || 
        `${prospect.firstName} ${prospect.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || prospect.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get client name and company name by ID
  const getClientName = (clientId: number | null | undefined) => {
    if (!clientId) return "N/A";
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  const getCompanyName = (companyId: number | null | undefined) => {
    if (!companyId) return "N/A";
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `Company #${companyId}`;
  };

  const handleStatusChange = (prospectId: number, newStatus: string) => {
    updateProspectMutation.mutate({ id: prospectId, status: newStatus });
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prospects</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Prospect
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Prospects</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="client_review">Client Review</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProspects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No prospects found. Add a new prospect to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProspects.map((prospect) => {
                      const statusConfig = STATUS_BADGES[prospect.status] || STATUS_BADGES.sourcing;
                      return (
                        <TableRow key={prospect.id}>
                          <TableCell className="font-medium">
                            {prospect.firstName} {prospect.lastName}
                          </TableCell>
                          <TableCell>{prospect.position}</TableCell>
                          <TableCell>{getClientName(prospect.clientId)}</TableCell>
                          <TableCell>{getCompanyName(prospect.companyId)}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(prospect.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProspect(prospect);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "sourcing")}
                                  disabled={prospect.status === "sourcing"}
                                >
                                  Move to Sourcing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "interview")}
                                  disabled={prospect.status === "interview"}
                                >
                                  Move to Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "client_review")}
                                  disabled={prospect.status === "client_review"}
                                >
                                  Move to Client Review
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "budget")}
                                  disabled={prospect.status === "budget"}
                                >
                                  Move to Budget
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "contract")}
                                  disabled={prospect.status === "contract"}
                                >
                                  Move to Contract
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "hired")}
                                  disabled={prospect.status === "hired"}
                                >
                                  Mark as Hired
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(prospect.id, "rejected")}
                                  disabled={prospect.status === "rejected"}
                                >
                                  Mark as Rejected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* Add Prospect Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
          </DialogHeader>
          <ProspectForm 
            onSuccess={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Prospect Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Prospect</DialogTitle>
          </DialogHeader>
          {selectedProspect && (
            <ProspectForm 
              initialStage={selectedProspect.status}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}
