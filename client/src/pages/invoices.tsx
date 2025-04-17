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
import { Invoice, Contract, Hero, Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ExternalLink, Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import InvoiceFormDialog from "@/components/dialogs/InvoiceFormDialog";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Invoice status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | null }> = {
  "pending": { label: "Pending", variant: "secondary" },
  "paid": { label: "Paid", variant: "default" },
  "overdue": { label: "Overdue", variant: "destructive" },
  "cancelled": { label: "Cancelled", variant: "outline" }
};

export default function InvoicesPage() {
  const { toast } = useToast();
  const { user, hasPermission } = useMockAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Check if user has admin access using permissions
  const isAdmin = hasPermission("user_management");

  // Fetch invoices
  const { data: invoices = [], isLoading: isInvoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery<Contract[]>({
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

  // Update invoice status mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, status, paidDate }: { id: number; status: string; paidDate?: string }) => {
      const res = await apiRequest("PUT", `/api/invoices/${id}`, { status, paidDate });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter invoices based on search query and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === "" || 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(invoice.clientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCompanyName(invoice.companyId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
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

  // Get contract title by ID
  const getContractTitle = (contractId: number) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.title : `Contract #${contractId}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Check if an invoice is overdue
  const isOverdue = (invoice: Invoice) => {
    return invoice.status === "pending" && new Date(invoice.dueDate) < new Date();
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        {isAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Invoices</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isInvoicesLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stripe Invoice</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No invoices found. {isAdmin ? "Create a new invoice to get started." : ""}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => {
                      // Update status if invoice is overdue
                      const actualStatus = isOverdue(invoice) ? "overdue" : invoice.status;
                      const statusConfig = STATUS_BADGES[actualStatus] || STATUS_BADGES.pending;
                      
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{getContractTitle(invoice.contractId)}</TableCell>
                          <TableCell>{getClientName(invoice.clientId)}</TableCell>
                          <TableCell>{getCompanyName(invoice.companyId)}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {invoice.stripeInvoiceUrl ? (
                              <a 
                                href={invoice.stripeInvoiceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Invoice
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not available</span>
                            )}
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
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  {invoice.stripeInvoiceUrl && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (invoice.stripeInvoiceUrl) {
                                          window.open(invoice.stripeInvoiceUrl, '_blank');
                                        }
                                      }}
                                    >
                                      View Stripe Invoice
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => updateInvoiceMutation.mutate({ 
                                      id: invoice.id, 
                                      status: "paid",
                                      paidDate: new Date().toISOString()
                                    })}
                                    disabled={invoice.status === "paid" || invoice.status === "cancelled"}
                                  >
                                    Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateInvoiceMutation.mutate({ 
                                      id: invoice.id, 
                                      status: "cancelled" 
                                    })}
                                    disabled={invoice.status === "paid" || invoice.status === "cancelled"}
                                  >
                                    Cancel Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
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

      {/* Create Invoice Dialog */}
      <InvoiceFormDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Invoice created successfully",
          });
        }}
      />
    </Dashboard>
  );
}
