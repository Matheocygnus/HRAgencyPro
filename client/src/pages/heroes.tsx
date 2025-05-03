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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Hero, Prospect, Client, Company, Contract } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Loader2, MoreHorizontal, Plus, Search, Mail, Phone } from "lucide-react";
import { useMockAuth } from "@/hooks/use-mock-auth";
import CreateContractDialog from "@/components/dialogs/CreateContractDialog";
import HeroSelectContractDialog from "@/components/dialogs/HeroSelectContractDialog";

export default function HeroesPage() {
  const { toast } = useToast();
  const { user } = useMockAuth();
  const [isCreateHeroDialogOpen, setIsCreateHeroDialogOpen] = useState(false);
  const [isHeroSelectContractDialogOpen, setIsHeroSelectContractDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const [isCreateContractDialogOpen, setIsCreateContractDialogOpen] = useState(false);
  const [isHeroDetailsDialogOpen, setIsHeroDetailsDialogOpen] = useState(false);

  // Check if user has admin access
  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  // Fetch heroes
  const { data: heroes = [], isLoading: isHeroesLoading } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
  });

  // Fetch prospects (to create new heroes)
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  // Filter heroes based on search query
  const filteredHeroes = heroes.filter(hero => {
    const prospect = prospects.find(p => p.id === hero.prospectId);
    
    if (!prospect) return false;
    
    return searchQuery === "" || 
      `${prospect.firstName} ${prospect.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Get prospect name by ID
  const getProspectName = (prospectId: number) => {
    const prospect = prospects.find(p => p.id === prospectId);
    return prospect ? `${prospect.firstName} ${prospect.lastName}` : `Prospect #${prospectId}`;
  };

  // Get prospect position by ID
  const getProspectPosition = (prospectId: number) => {
    const prospect = prospects.find(p => p.id === prospectId);
    return prospect ? prospect.position : "Unknown Position";
  };

  // Get contract status by ID
  const getContractStatus = (contractId: number | null | undefined) => {
    if (!contractId) return "No Contract";
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.status : "Unknown";
  };

  // Create hero mutation
  const createHeroMutation = useMutation({
    mutationFn: async (data: { 
      prospectId: number; 
      clientId: number; 
      companyId: number; 
      startDate?: string;
    }) => {
      const res = await apiRequest("POST", "/api/heroes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hero created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/heroes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      setIsCreateHeroDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Available prospects for conversion to Heroes
  const availableProspects = prospects.filter(
    prospect => prospect.status === "contract" && !heroes.some(hero => hero.prospectId === prospect.id)
  );
  
  // Handle creating a contract for a hero
  const handleCreateContract = (hero: any) => {
    // Get the prospect information
    const prospect = prospects.find(p => p.id === hero.prospectId);
    
    // Prepare hero data with name from prospect
    const heroData = {
      ...hero,
      name: prospect ? `${prospect.firstName} ${prospect.lastName}` : `Hero #${hero.id}`,
      position: prospect?.position || 'Professional',
    };
    
    setSelectedHero(heroData);
    setIsCreateContractDialogOpen(true);
  };
  
  // Handle viewing hero details
  const handleViewHeroDetails = (hero: any) => {
    // Get the prospect information
    const prospect = prospects.find(p => p.id === hero.prospectId);
    
    // Prepare hero data with name and additional info from prospect
    const heroData = {
      ...hero,
      name: prospect ? `${prospect.firstName} ${prospect.lastName}` : `Hero #${hero.id}`,
      position: prospect?.position || 'Professional',
      email: prospect?.email || '',
      phone: prospect?.phone || '',
      skills: prospect?.skills || [],
      status: getContractStatus(hero.contractId),
      clientName: getClientName(hero.clientId),
      companyName: getCompanyName(hero.companyId),
    };
    
    setSelectedHero(heroData);
    setIsHeroDetailsDialogOpen(true);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Heroes</h1>
        {isAdmin && (
          <div className="flex space-x-3">
            {/* Contract Creation Button with Hero Selection */}
            <Button 
              variant="outline" 
              onClick={() => setIsHeroSelectContractDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
            
            {/* Create Hero Button */}
            {availableProspects.length > 0 && (
              <Button onClick={() => setIsCreateHeroDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Hero
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <CardTitle>Hired Heroes</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search heroes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isAdmin && (
                <Button 
                  size="sm" 
                  onClick={() => setIsHeroSelectContractDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create Contract
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isHeroesLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hero Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Contract Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHeroes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No heroes found. {isAdmin && availableProspects.length > 0 ? "Create a new hero from available prospects." : ""}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHeroes.map((hero) => (
                      <TableRow key={hero.id}>
                        <TableCell className="font-medium">{getProspectName(hero.prospectId)}</TableCell>
                        <TableCell>{getProspectPosition(hero.prospectId)}</TableCell>
                        <TableCell>{getClientName(hero.clientId)}</TableCell>
                        <TableCell>{getCompanyName(hero.companyId)}</TableCell>
                        <TableCell>
                          {hero.startDate ? new Date(hero.startDate).toLocaleDateString() : "Not set"}
                        </TableCell>
                        <TableCell>
                          {getContractStatus(hero.contractId)}
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
                              <DropdownMenuItem onClick={() => handleViewHeroDetails(hero)}>
                                View Details
                              </DropdownMenuItem>
                              {isAdmin && (
                                <DropdownMenuItem onClick={() => handleCreateContract(hero)}>
                                  Create Contract
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Hero Dialog */}
      <Dialog open={isCreateHeroDialogOpen} onOpenChange={setIsCreateHeroDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Hero from Prospect</DialogTitle>
          </DialogHeader>
          {availableProspects.length > 0 ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Select a prospect who has reached the contract stage to create a hero.
              </p>
              <div className="max-h-[300px] overflow-y-auto">
                {availableProspects.map(prospect => {
                  const canCreateHero = prospect.clientId && prospect.companyId;
                  
                  return (
                    <div key={prospect.id} className="p-3 border rounded-md mb-2">
                      <div className="font-medium">{prospect.firstName} {prospect.lastName}</div>
                      <div className="text-sm text-muted-foreground">{prospect.position}</div>
                      <div className="text-sm mt-1">
                        <span className="text-muted-foreground mr-1">Client:</span>
                        {prospect.clientId ? getClientName(prospect.clientId) : "Not assigned"}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-1">Company:</span>
                        {prospect.companyId ? getCompanyName(prospect.companyId) : "Not assigned"}
                      </div>
                      
                      <Button 
                        className="mt-2 w-full"
                        variant={canCreateHero ? "default" : "outline"}
                        disabled={!canCreateHero || createHeroMutation.isPending}
                        onClick={() => {
                          if (canCreateHero && prospect.clientId && prospect.companyId) {
                            createHeroMutation.mutate({
                              prospectId: prospect.id,
                              clientId: prospect.clientId,
                              companyId: prospect.companyId,
                              startDate: new Date().toISOString()
                            });
                          }
                        }}
                      >
                        {createHeroMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Hero"
                        )}
                      </Button>
                      
                      {!canCreateHero && (
                        <p className="text-xs text-red-500 mt-1">
                          This prospect needs a client and company assignment to create a hero.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p>No prospects in the contract stage are available.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Move prospects to the contract stage to create heroes.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Contract Dialog */}
      {selectedHero && (
        <CreateContractDialog
          isOpen={isCreateContractDialogOpen}
          onOpenChange={setIsCreateContractDialogOpen}
          hero={selectedHero}
        />
      )}
      
      {/* Hero Select Contract Dialog */}
      <HeroSelectContractDialog
        isOpen={isHeroSelectContractDialogOpen}
        onOpenChange={(isOpen) => {
          setIsHeroSelectContractDialogOpen(isOpen);
          if (!isOpen) {
            // Refresh contract and hero lists when dialog is closed
            queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
            queryClient.invalidateQueries({ queryKey: ["/api/heroes"] });
          }
        }}
      />
      
      {/* Hero Details Dialog */}
      {selectedHero && (
        <Dialog open={isHeroDetailsDialogOpen} onOpenChange={setIsHeroDetailsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Hero Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedHero.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedHero.position}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p>{selectedHero.email || "No email available"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p>{selectedHero.phone || "No phone available"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Start Date</h4>
                    <p>{selectedHero.startDate ? 
                      new Date(selectedHero.startDate).toLocaleDateString() : 
                      "Not set"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Client</h4>
                    <p className="font-medium">{selectedHero.clientName}</p>
                    
                    <h4 className="text-sm font-medium mt-3 mb-1">Company</h4>
                    <p className="font-medium">{selectedHero.companyName}</p>
                    
                    <h4 className="text-sm font-medium mt-3 mb-1">Contract Status</h4>
                    <Badge
                      variant={selectedHero.status === "No Contract" ? "outline" : "default"}
                    >
                      {selectedHero.status}
                    </Badge>
                    
                    {isAdmin && selectedHero.status === "No Contract" && (
                      <Button 
                        className="mt-3 w-full"
                        onClick={() => {
                          setIsHeroDetailsDialogOpen(false);
                          handleCreateContract(selectedHero);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Contract
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedHero.skills && selectedHero.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHero.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dashboard>
  );
}
