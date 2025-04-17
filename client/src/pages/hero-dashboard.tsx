import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { MODULES } from "@/hooks/use-mock-auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Hero, Contract, Invoice, Company } from "@shared/schema";
import { 
  Building2, 
  CircleDollarSign, 
  FileText, 
  Calendar, 
  Download, 
  Clock,
  CalendarDays,
  CheckSquare,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function HeroDashboard() {
  const { hasPermission } = useMockAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user has permission to access this page
  if (!hasPermission(MODULES.HERO_DASHBOARD)) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                You do not have permission to access the hero dashboard. You need the "hero_dashboard" permission to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  // In a real app, you would only fetch the current user's hero data
  // This is a mock implementation that fetches all heroes
  const { data: heroes = [], isLoading: isLoadingHeroes } = useQuery<Hero[]>({
    queryKey: ['/api/heroes'],
  });

  // For the mock implementation, we'll just use the first hero as the current user
  const currentHero = heroes[0];

  // Fetch the hero's contract
  const { data: contracts = [], isLoading: isLoadingContracts } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
    enabled: !!currentHero,
  });

  // Get the contract for the current hero
  const heroContract = contracts.find(contract => contract.heroId === currentHero?.id);

  // Fetch the hero's company
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
    enabled: !!currentHero && !!heroContract,
  });

  // Get the company for the current hero
  const heroCompany = companies.find(company => company.id === currentHero?.companyId);

  // Fetch invoices for the current hero
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
    enabled: !!currentHero,
  });

  // Filter invoices for the current hero
  const heroInvoices = invoices.filter(invoice => 
    invoice.heroId === currentHero?.id
  );

  // Calculate total earnings
  const totalEarnings = heroInvoices.reduce((total, invoice) => {
    // In a real app, you would calculate the hero's portion based on the contract
    return total + invoice.amount;
  }, 0);

  // Loading state
  if (isLoadingHeroes || isLoadingContracts || isLoadingCompanies || isLoadingInvoices) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Dashboard>
    );
  }

  // No hero found
  if (!currentHero) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-[500px] text-center">
            <CardHeader>
              <CardTitle>No Hero Profile Found</CardTitle>
              <CardDescription>You do not have an associated hero profile in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Contact your RemoteHero representative for assistance.</p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  // Calculate days since contract started
  const daysSinceStart = heroContract ? 
    Math.floor((new Date().getTime() - new Date(heroContract.startDate).getTime()) / (1000 * 3600 * 24)) : 
    0;

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hero Dashboard</h1>
        {heroContract && (
          <Badge
            variant={
              heroContract.status === "active" ? "default" :
              heroContract.status === "draft" ? "outline" :
              heroContract.status === "completed" ? "secondary" :
              "outline"
            }
            className="px-3 py-1 text-sm capitalize"
          >
            {heroContract.status}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <CircleDollarSign className="w-5 h-5 mr-2 text-primary" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {heroInvoices.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Contract Length
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {daysSinceStart} days
            </div>
            <p className="text-sm text-muted-foreground mt-1">Since contract started</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Company</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{heroCompany?.name || "Unknown Company"}</div>
                          <div className="text-sm text-muted-foreground">{heroCompany?.industry || "Technology"}</div>
                        </div>
                      </div>
                      {heroCompany && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground block">Location</span>
                            <span>{heroCompany.location || "Remote"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Size</span>
                            <span>{heroCompany.size || "Unknown"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contract Details</h3>
                    {heroContract ? (
                      <div className="border rounded-md p-4">
                        <div className="font-medium">{heroContract.title}</div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Started on {new Date(heroContract.startDate).toLocaleDateString()}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground block">Status</span>
                            <Badge 
                              variant={
                                heroContract.status === "active" ? "default" :
                                heroContract.status === "signed" ? "secondary" :
                                "outline"
                              }
                              className="mt-1"
                            >
                              {heroContract.status.charAt(0).toUpperCase() + heroContract.status.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Compensation</span>
                            <span>${heroContract.compensation}/month</span>
                          </div>
                          {heroContract.endDate && (
                            <div className="col-span-2">
                              <span className="text-xs text-muted-foreground block">End Date</span>
                              <span>{new Date(heroContract.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No contract information available
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>
                <ul className="space-y-6 relative mb-4">
                  {heroInvoices.slice(0, 3).map((invoice, index) => (
                    <li key={invoice.id} className="relative pl-10">
                      <div className="absolute left-0 top-1 rounded-full bg-primary p-1.5">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="font-medium">Invoice #{invoice.invoiceNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()} • ${invoice.amount}
                      </div>
                    </li>
                  ))}

                  {heroContract && (
                    <li className="relative pl-10">
                      <div className="absolute left-0 top-1 rounded-full bg-green-500 p-1.5">
                        <CheckSquare className="h-4 w-4 text-white" />
                      </div>
                      <div className="font-medium">Contract Activated</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(heroContract.startDate).toLocaleDateString()}
                      </div>
                    </li>
                  )}
                </ul>

                {heroInvoices.length === 0 && !heroContract && (
                  <div className="text-center py-8 pl-8">
                    <p className="text-muted-foreground">No recent activity to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contract" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSearch className="w-5 h-5 mr-2 text-primary" />
                Contract Details
              </CardTitle>
              <CardDescription>
                Your current contract information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!heroContract ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active contract found</p>
                  <p className="text-sm text-muted-foreground">
                    Contact your RemoteHero representative for assistance
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border rounded-lg p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{heroContract.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={
                              heroContract.status === "active" ? "default" :
                              heroContract.status === "signed" ? "secondary" :
                              "outline"
                            }
                          >
                            {heroContract.status.charAt(0).toUpperCase() + heroContract.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ${heroContract.compensation}/month
                          </span>
                        </div>
                      </div>
                      {heroContract.document && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Contract Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Start Date</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(heroContract.startDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {heroContract.endDate && (
                            <div className="flex items-center gap-3">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              <div>
                                <div className="text-sm font-medium">End Date</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(heroContract.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Contract Duration</div>
                              <div className="text-sm text-muted-foreground">
                                {daysSinceStart} days so far
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Company Information</h4>
                        <div className="flex items-center gap-3">
                          <Building2 className="h-10 w-10 p-2 bg-gray-100 rounded-md text-gray-500" />
                          <div>
                            <div className="font-medium">{heroCompany?.name || "Unknown Company"}</div>
                            <div className="text-sm text-muted-foreground">
                              {heroCompany?.industry || "Technology"} • {heroCompany?.location || "Remote"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mock contract progress section */}
                    {heroContract.endDate && (
                      <div className="mt-8">
                        <h4 className="text-sm font-medium mb-3">Contract Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Started: {new Date(heroContract.startDate).toLocaleDateString()}</span>
                            <span>Ends: {new Date(heroContract.endDate).toLocaleDateString()}</span>
                          </div>
                          <Progress 
                            value={Math.min(
                              (daysSinceStart / 
                                Math.max(1, Math.floor((new Date(heroContract.endDate).getTime() - new Date(heroContract.startDate).getTime()) / (1000 * 3600 * 24)))
                              ) * 100, 
                              100
                            )} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4">Contract Terms Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Compensation</h4>
                        <p className="text-sm">${heroContract.compensation} per month</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Payment Schedule</h4>
                        <p className="text-sm">Monthly, on the 1st</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notice Period</h4>
                        <p className="text-sm">30 days</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">IP Ownership</h4>
                        <p className="text-sm">Client owns all work product</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Confidentiality</h4>
                        <p className="text-sm">Standard NDA applies</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Work Hours</h4>
                        <p className="text-sm">40 hours/week, flexible schedule</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>This is a simplified summary. Please refer to the full contract document for complete details.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Your Invoices
              </CardTitle>
              <CardDescription>
                History of all your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {heroInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No invoices found</p>
                  <p className="text-sm text-muted-foreground">
                    Invoices will appear here once they are generated
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heroInvoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div className="font-medium">#{invoice.invoiceNumber}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              invoice.status === "paid" ? "default" : 
                              invoice.status === "pending" ? "secondary" : 
                              "outline"
                            }>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {invoice.stripeInvoiceUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={invoice.stripeInvoiceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                <Download className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
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
    </Dashboard>
  );
}