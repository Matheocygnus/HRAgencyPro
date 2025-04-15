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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Contract, Hero, Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, MoreHorizontal, Plus, Search, FileText } from "lucide-react";
import { useMockAuth } from "@/hooks/use-mock-auth";
import ContractFormDialog from "@/components/dialogs/ContractFormDialog";

// Contract status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | null }> = {
  "draft": { label: "Draft", variant: "secondary" },
  "signed": { label: "Signed", variant: "outline" },
  "active": { label: "Active", variant: "default" },
  "completed": { label: "Completed", variant: null },
  "terminated": { label: "Terminated", variant: "destructive" }
};

export default function ContractsPage() {
  const { toast } = useToast();
  const { user } = useMockAuth();
  const [isAddContractDialogOpen, setIsAddContractDialogOpen] = useState(false);
  const [editContractId, setEditContractId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Check if user has admin access
  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  // Fetch contracts
  const { data: contracts = [], isLoading: isContractsLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  // Fetch heroes
  const { data: heroes = [] } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
  });

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Filter contracts based on search query and status
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchQuery === "" || 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(contract.clientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCompanyName(contract.companyId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get client name by ID
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  // Get company name by ID
  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `Company #${companyId}`;
  };

  // Get hero name by ID
  const getHeroName = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    const heroProspectId = hero?.prospectId;
    return hero ? `Hero #${heroId} (Prospect ID: ${heroProspectId})` : `Hero #${heroId}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Handle edit contract
  const handleEditContract = (id: number) => {
    setEditContractId(id);
    setIsAddContractDialogOpen(true);
  };

  // Download contract document
  const handleDownloadDocument = (contractId: number) => {
    if (isAdmin) {
      window.open(`/api/contracts/${contractId}/document`, '_blank');
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contracts</h1>
        {isAdmin && (
          <Button onClick={() => {
            setEditContractId(undefined);
            setIsAddContractDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Contracts</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="signed">Signed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isContractsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Hero</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Compensation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No contracts found. {isAdmin ? "Create a new contract to get started." : ""}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracts.map((contract) => {
                      const statusConfig = STATUS_BADGES[contract.status] || STATUS_BADGES.draft;
                      
                      return (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.title}</TableCell>
                          <TableCell>{getHeroName(contract.heroId)}</TableCell>
                          <TableCell>{getClientName(contract.clientId)}</TableCell>
                          <TableCell>{getCompanyName(contract.companyId)}</TableCell>
                          <TableCell>{formatDate(contract.startDate)}</TableCell>
                          <TableCell>{formatDate(contract.endDate)}</TableCell>
                          <TableCell>{formatCurrency(contract.compensation)}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {contract.document && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View Document"
                                  onClick={() => handleDownloadDocument(contract.id)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                              {isAdmin && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditContract(contract.id)}>
                                      Edit Contract
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        // This would update the contract status
                                        // based on the current status
                                        const newStatus = contract.status === 'draft' ? 'signed' :
                                                         contract.status === 'signed' ? 'active' :
                                                         contract.status === 'active' ? 'completed' : 'draft';
                                        
                                        toast({
                                          title: "Status update",
                                          description: `Contract status would be updated to ${newStatus}.`,
                                        });
                                      }}
                                    >
                                      Update Status
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
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

      {/* Contract Dialog */}
      <ContractFormDialog 
        isOpen={isAddContractDialogOpen}
        onOpenChange={setIsAddContractDialogOpen}
        contractId={editContractId}
        onSuccess={() => {
          toast({
            title: "Success",
            description: editContractId ? "Contract updated successfully" : "Contract created successfully",
          });
          setEditContractId(undefined);
        }}
        title={editContractId ? "Edit Contract" : "Create New Contract"}
      />
    </Dashboard>
  );
}