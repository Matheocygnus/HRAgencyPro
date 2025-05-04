import React, { useState } from "react";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Contract, Hero, Client, Company, Prospect } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, MoreHorizontal, Plus, Search, FileText, Edit, ClipboardEdit, Upload, FileUp, PenLine, CheckCircle, CircleAlert } from "lucide-react";
import { useMockAuth } from "@/hooks/use-mock-auth";
import ContractFormDialog from "@/components/dialogs/ContractFormDialog";
import QuickEditContractDialog from "@/components/dialogs/QuickEditContractDialog";
import HeroSelectContractDialog from "@/components/dialogs/HeroSelectContractDialog";

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
  const [isQuickEditDialogOpen, setIsQuickEditDialogOpen] = useState(false);
  const [isHeroSelectDialogOpen, setIsHeroSelectDialogOpen] = useState(false);
  const [editContractId, setEditContractId] = useState<number | undefined>(undefined);
  const [quickEditContractId, setQuickEditContractId] = useState<number | undefined>(undefined);
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
  
  // Mutation for updating contract status
  const updateContractStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/contracts/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "Status updated",
        description: "Contract status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // File upload state and refs
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });
  
  // Fetch prospects
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  // Filter contracts based on search query and status
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchQuery === "" || 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(contract.clientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCompanyName(contract.companyId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getHeroName(contract.heroId).toLowerCase().includes(searchQuery.toLowerCase());
    
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
    if (!hero) return `Hero #${heroId}`;
    
    // Find the prospect associated with this hero
    const prospect = prospects.find(p => p.id === hero.prospectId);
    if (!prospect) return `Hero #${heroId}`;
    
    // Return hero's full name from the prospect data
    return `${prospect.firstName} ${prospect.lastName}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  // Handle edit contract
  const handleEditContract = (id: number) => {
    setEditContractId(id);
    setIsAddContractDialogOpen(true);
  };
  
  // Handle quick edit contract
  const handleQuickEditContract = (id: number) => {
    setQuickEditContractId(id);
    setIsQuickEditDialogOpen(true);
  };

  // Upload document handler
  const handleFileUpload = async (contractId: number, file: File) => {
    if (!isAdmin) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch(`/api/contracts/${contractId}/document`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      
      toast({
        title: "Document uploaded",
        description: "Contract document has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Trigger document upload via file input
  const handleUploadClick = (contractId: number) => {
    // Create a hidden file input if it doesn't exist
    if (!fileInputRef.current) return;
    
    // Set up a one-time event handler for the file selection
    const handleFileSelect = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileUpload(contractId, target.files[0]);
      }
      // Remove the event listener after file selection
      fileInputRef.current?.removeEventListener('change', handleFileSelect);
    };
    
    // Add the event listener
    fileInputRef.current.addEventListener('change', handleFileSelect);
    
    // Reset the file input to allow selecting the same file multiple times
    fileInputRef.current.value = '';
    
    // Trigger file browser
    fileInputRef.current.click();
  };
  
  // Handle contract status update
  const handleStatusUpdate = (contractId: number, newStatus: string) => {
    updateContractStatusMutation.mutate({ id: contractId, status: newStatus });
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
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                setIsHeroSelectDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Contract for Hero
            </Button>
            <Button onClick={() => {
              setEditContractId(undefined);
              setIsAddContractDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Contract (Manual)
            </Button>
            <Button 
              onClick={() => {
                setEditContractId(undefined);
                setIsAddContractDialogOpen(true);
              }}
              style={{ backgroundColor: '#2563eb', color: 'white' }}
              className="font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              NEW CONTRACT
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <CardTitle>Manage Contracts</CardTitle>
            {isAdmin && (
              <Button 
                size="sm" 
                onClick={() => {
                  setEditContractId(undefined);
                  setIsAddContractDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            )}
          </div>
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
                    <TableHead>Hero Compensation</TableHead>
                    <TableHead>Company Payment</TableHead>
                    <TableHead>Profit</TableHead>
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
                          <TableCell>{contract.companyPayment ? formatCurrency(contract.companyPayment) : '-'}</TableCell>
                          <TableCell>
                            {contract.profit ? formatCurrency(contract.profit) : 
                              (contract.companyPayment ? 
                                formatCurrency(contract.companyPayment - contract.compensation) : 
                                '-')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
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
                                    {/* Editing options */}
                                    <DropdownMenuItem onClick={() => handleQuickEditContract(contract.id)} className="md:hidden">
                                      <ClipboardEdit className="h-4 w-4 mr-2" />
                                      Quick Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditContract(contract.id)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Full Edit
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    {/* Status change options */}
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(contract.id, 'draft')}
                                      disabled={contract.status === 'draft'}
                                    >
                                      <PenLine className="h-4 w-4 mr-2" />
                                      Set as Draft
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(contract.id, 'signed')}
                                      disabled={contract.status === 'signed'}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Signed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(contract.id, 'active')}
                                      disabled={contract.status === 'active'}
                                    >
                                      <CircleAlert className="h-4 w-4 mr-2" />
                                      Set as Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(contract.id, 'completed')}
                                      disabled={contract.status === 'completed'}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    {/* Document options */}
                                    <DropdownMenuItem onClick={() => handleUploadClick(contract.id)}>
                                      <FileUp className="h-4 w-4 mr-2" />
                                      Upload Contract
                                    </DropdownMenuItem>
                                    
                                    {contract.document && (
                                      <DropdownMenuItem onClick={() => handleDownloadDocument(contract.id)}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        View Contract
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
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
      
      {/* Quick Edit Dialog */}
      <QuickEditContractDialog
        isOpen={isQuickEditDialogOpen}
        onOpenChange={setIsQuickEditDialogOpen}
        contractId={quickEditContractId}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Contract updated successfully",
          });
          setQuickEditContractId(undefined);
        }}
      />
      
      {/* Hero Select Contract Dialog */}
      <HeroSelectContractDialog
        isOpen={isHeroSelectDialogOpen}
        onOpenChange={(isOpen) => {
          setIsHeroSelectDialogOpen(isOpen);
          if (!isOpen) {
            // Refresh contract list when dialog is closed
            queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
          }
        }}
      />
      
      {/* Hidden file input for document upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt" 
      />
    </Dashboard>
  );
}