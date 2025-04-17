import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Company, Client, Hero, Contract } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/layout/Dashboard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Building, Mail, Phone, Users, FileText, User, Calendar } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function CompanyDetail() {
  const [, params] = useRoute("/company/:id");
  const companyId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch company data
  const { 
    data: company, 
    isLoading: isCompanyLoading, 
    error: companyError 
  } = useQuery<Company | undefined>({
    queryKey: ["/api/companies", companyId],
    enabled: !!companyId,
  });

  // Fetch client data
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: !!companyId,
  });

  // Fetch heroes
  const { data: heroes = [] } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
    enabled: !!companyId,
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
    enabled: !!companyId,
  });

  // Company's client
  const client = clients.find(c => c.id === company?.clientId);

  // Company's contracts
  const companyContracts = contracts.filter(contract => 
    contract.companyId === companyId
  );

  // Company's heroes (via contracts)
  const companyHeroes = heroes.filter(hero => 
    hero.contractIds?.some(contractId => 
      companyContracts.some(contract => contract.id === contractId)
    )
  );

  // Handle errors
  useEffect(() => {
    if (companyError) {
      toast({
        title: "Error",
        description: "Failed to load company details",
        variant: "destructive"
      });
    }
  }, [companyError, toast]);

  if (!companyId) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Company Not Found</CardTitle>
              <CardDescription>No company ID was provided in the URL.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Dashboard>
    );
  }

  if (isCompanyLoading) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  if (!company) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Company Not Found</CardTitle>
              <CardDescription>The requested company could not be found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={company.logoUrl || ""} alt={company.name} />
                  <AvatarFallback className="text-2xl bg-primary-foreground">
                    <Building className="h-12 w-12 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  <p className="text-sm text-muted-foreground">{company.industry || "Technology"}</p>
                  <Badge variant="outline" className="mt-2">
                    {company.status || "Active"}
                  </Badge>
                </div>
                <Separator />
                <div className="grid w-full gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{companyHeroes.length} Active Heroes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="heroes">Heroes</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Summary</CardTitle>
                    <CardDescription>Key information about this company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Client Details</h3>
                        {client ? (
                          <div className="flex flex-col gap-2 p-3 border rounded-md">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{client.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{client.phone}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No client information available</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Active Contracts</h3>
                        {companyContracts.length > 0 ? (
                          <div className="space-y-2">
                            {companyContracts.filter(contract => contract.status === "active").map(contract => (
                              <div key={contract.id} className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{contract.title}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No active contracts</p>
                        )}
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Company Description</h3>
                      <p className="text-sm">
                        {company.description || "No company description available."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Location</h3>
                        <p className="text-sm">{company.address || "No address provided"}</p>
                        <p className="text-sm">
                          {company.city}{company.city && company.state ? ", " : ""}{company.state}
                          {((company.city || company.state) && company.zipCode) ? " " : ""}
                          {company.zipCode}
                        </p>
                        <p className="text-sm">{company.country || ""}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Additional Details</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-sm text-muted-foreground">Website:</span>
                          <span className="text-sm">
                            {company.website ? (
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {company.website}
                              </a>
                            ) : "Not provided"}
                          </span>
                          <span className="text-sm text-muted-foreground">Founded:</span>
                          <span className="text-sm">{company.foundedYear || "Not provided"}</span>
                          <span className="text-sm text-muted-foreground">Company Size:</span>
                          <span className="text-sm">{company.size || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Heroes Tab */}
              <TabsContent value="heroes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contracted Heroes</CardTitle>
                    <CardDescription>Heroes currently working with this company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {companyHeroes.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Contract</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companyHeroes.map(hero => {
                            const heroContract = companyContracts.find(
                              contract => hero.contractIds?.includes(contract.id)
                            );
                            
                            return (
                              <TableRow key={hero.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={hero.avatarUrl || ""} />
                                      <AvatarFallback>
                                        {hero.firstName?.[0]}{hero.lastName?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{hero.firstName} {hero.lastName}</p>
                                      <p className="text-xs text-muted-foreground">{hero.email}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{hero.title || "N/A"}</TableCell>
                                <TableCell>
                                  <Badge variant={hero.status === "active" ? "default" : "secondary"}>
                                    {hero.status || "Unknown"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {hero.startDate ? new Date(hero.startDate).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {heroContract ? (
                                    <Button
                                      variant="link"
                                      className="p-0 h-auto font-normal"
                                      onClick={() => {
                                        // Navigate to contract details in a real app
                                      }}
                                    >
                                      {heroContract.title}
                                    </Button>
                                  ) : "N/A"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Heroes</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This company has no contracted heroes yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contracts Tab */}
              <TabsContent value="contracts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract History</CardTitle>
                    <CardDescription>All contracts associated with this company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {companyContracts.length > 0 ? (
                      <div className="grid gap-4">
                        {companyContracts.map(contract => (
                          <Card key={contract.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium">{contract.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{contract.description}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {new Date(contract.startDate).toLocaleDateString()} - 
                                      {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Ongoing"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {heroes.filter(h => h.contractIds?.includes(contract.id)).length} Heroes
                                    </span>
                                  </div>
                                </div>
                                <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                                  {contract.status || "Unknown"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Contracts</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This company has no contracts yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}