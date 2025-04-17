import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Hero, Contract } from "@shared/schema";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CalendarDays, Mail, Phone, FileText, Building, DollarSign, ClipboardCheck } from "lucide-react";

export default function HeroDetail() {
  const [, params] = useRoute("/hero/:id");
  const heroId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch hero data
  const { 
    data: hero, 
    isLoading: isHeroLoading, 
    error: heroError 
  } = useQuery<Hero | undefined>({
    queryKey: ["/api/heroes", heroId],
    enabled: !!heroId,
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
    enabled: !!heroId,
  });

  // Hero's contracts
  const heroContracts = contracts.filter(contract => 
    hero?.contractIds?.includes(contract.id)
  );

  // Handle errors
  useEffect(() => {
    if (heroError) {
      toast({
        title: "Error",
        description: "Failed to load hero details",
        variant: "destructive"
      });
    }
  }, [heroError, toast]);

  if (!heroId) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Hero Not Found</CardTitle>
              <CardDescription>No hero ID was provided in the URL.</CardDescription>
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

  if (isHeroLoading) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  if (!hero) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Hero Not Found</CardTitle>
              <CardDescription>The requested hero could not be found.</CardDescription>
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
          <h1 className="text-2xl font-bold">Hero Profile</h1>
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
                  <AvatarImage src={hero.avatarUrl || ""} alt={`${hero.firstName} ${hero.lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {hero.firstName?.[0]}{hero.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-bold">{hero.firstName} {hero.lastName}</h2>
                  <p className="text-sm text-muted-foreground">{hero.title || "Remote Hero"}</p>
                  <Badge variant="outline" className="mt-2">
                    {hero.status || "Active"}
                  </Badge>
                </div>
                <Separator />
                <div className="grid w-full gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hero.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hero.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {hero.startDate ? new Date(hero.startDate).toLocaleDateString() : "No start date"}
                    </span>
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
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Summary</CardTitle>
                    <CardDescription>Key information about this hero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Skills & Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {hero.skills?.length ? hero.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          )) : (
                            <p className="text-sm text-muted-foreground">No skills listed</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Contracts</h3>
                        {heroContracts.length > 0 ? (
                          <div className="space-y-2">
                            {heroContracts.map(contract => (
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
                      <h3 className="text-sm font-medium mb-2">Background</h3>
                      <p className="text-sm">
                        {hero.background || "No background information available."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Activity tracking will be implemented in a future update.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contracts Tab */}
              <TabsContent value="contracts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract History</CardTitle>
                    <CardDescription>All contracts associated with this hero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {heroContracts.length > 0 ? (
                      <div className="grid gap-4">
                        {heroContracts.map(contract => (
                          <Card key={contract.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium">{contract.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Company #{contract.companyId}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {new Date(contract.startDate).toLocaleDateString()} - 
                                      {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Ongoing"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                      }).format(contract.rate || 0)}
                                      {contract.rateType ? `/${contract.rateType}` : ""}
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
                        <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Contracts</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This hero has no contracts yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Complete information about this hero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Personal Information</h3>
                          <dl className="grid grid-cols-2 gap-2 mt-2">
                            <dt className="text-sm text-muted-foreground">First Name</dt>
                            <dd className="text-sm">{hero.firstName || "N/A"}</dd>
                            <dt className="text-sm text-muted-foreground">Last Name</dt>
                            <dd className="text-sm">{hero.lastName || "N/A"}</dd>
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd className="text-sm">{hero.email || "N/A"}</dd>
                            <dt className="text-sm text-muted-foreground">Phone</dt>
                            <dd className="text-sm">{hero.phone || "N/A"}</dd>
                            <dt className="text-sm text-muted-foreground">Location</dt>
                            <dd className="text-sm">{hero.location || "N/A"}</dd>
                          </dl>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Professional Information</h3>
                          <dl className="grid grid-cols-2 gap-2 mt-2">
                            <dt className="text-sm text-muted-foreground">Title</dt>
                            <dd className="text-sm">{hero.title || "N/A"}</dd>
                            <dt className="text-sm text-muted-foreground">Skills</dt>
                            <dd className="text-sm flex flex-wrap gap-1">
                              {hero.skills?.length ? hero.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                              )) : "N/A"}
                            </dd>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="text-sm">
                              <Badge variant="outline" className="text-xs">
                                {hero.status || "N/A"}
                              </Badge>
                            </dd>
                            <dt className="text-sm text-muted-foreground">Start Date</dt>
                            <dd className="text-sm">
                              {hero.startDate 
                                ? new Date(hero.startDate).toLocaleDateString() 
                                : "N/A"}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Additional Notes</h3>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <div className="text-sm">
                          {hero.notes || "No additional notes available."}
                        </div>
                      </ScrollArea>
                    </div>
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