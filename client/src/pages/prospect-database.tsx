import { useState, useEffect } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, Search, UserRound, MoveRight, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProspectDatabase() {
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<any[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Move prospect to sourcing status
  const moveToSourcing = async (prospectId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sourcing' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update prospect status');
      }
      
      toast({
        title: "Status Updated",
        description: "Prospect has been moved to sourcing status",
      });
      
      // Refresh the prospects list
      fetchProspects();
    } catch (error) {
      console.error('Error updating prospect status:', error);
      toast({
        title: "Update Failed",
        description: "Could not move prospect to sourcing",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Fetch all prospects from API
  const fetchProspects = async () => {
    try {
      setLoading(true);
      
      // Fetch clients and companies for additional context
      const [clientsResponse, companiesResponse] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/companies')
      ]);
      
      let clients: any[] = [];
      let companies: any[] = [];
      
      if (clientsResponse.ok) {
        clients = await clientsResponse.json();
      }
      
      if (companiesResponse.ok) {
        companies = await companiesResponse.json();
      }
      
      // Fetch prospects data
      const response = await fetch('/api/prospects');
      if (!response.ok) throw new Error('Failed to fetch prospects');
      
      const data = await response.json();
      
      // Check for heroes data to identify hired prospects
      const heroesResponse = await fetch('/api/heroes');
      let heroes: any[] = [];
      if (heroesResponse.ok) {
        heroes = await heroesResponse.json();
      }
      
      // Just manually filter out explicitly hired or terminated prospects
      const nonHiredProspects = data.filter((prospect: any) => {
        // Check if status is defined
        if (!prospect.status) return true;
        
        // Normalize status for comparison
        const status = prospect.status.toString().toLowerCase();
        
        // Basic filtering - only remove prospects that say "hired" or "terminated"
        const isExplicitlyHired = 
          status === 'hired' || 
          status === 'terminated';
          
        return !isExplicitlyHired;
      });
      
      // Process and enhance prospects with additional information
      const enhancedProspects = nonHiredProspects.map((prospect: any) => {
        // Try to extract location from notes or existing location field
        if (!prospect.location && prospect.notes) {
          const notesLower = prospect.notes.toLowerCase();
          
          // Common countries/regions in the dataset
          const locationKeywords = ['argentina', 'brasil', 'brazil', 'colombia', 'bolivia', 'gmt'];
          for (const keyword of locationKeywords) {
            if (notesLower.includes(keyword)) {
              prospect.location = keyword.charAt(0).toUpperCase() + keyword.slice(1);
              break;
            }
          }
        }
        
        // Add client and company names if available
        if (prospect.clientId) {
          const client = clients.find(c => c.id === prospect.clientId);
          if (client) {
            prospect.clientName = client.name;
          }
        }
        
        if (prospect.companyId) {
          const company = companies.find(c => c.id === prospect.companyId);
          if (company) {
            prospect.companyName = company.name;
          }
        }
        
        return prospect;
      });
      
      console.log(`Found ${enhancedProspects.length} non-hired prospects out of ${data.length} total`);
      setProspects(enhancedProspects);
      setFilteredProspects(enhancedProspects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prospects:', error);
      toast({
        title: "Error",
        description: "Failed to load prospects. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Fetch prospects on component mount
  useEffect(() => {
    fetchProspects();
  }, [toast]);

  // Apply filters whenever searchTerm or statusFilter changes
  useEffect(() => {
    let result = [...prospects];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(prospect => {
        // Normalize status case for consistent filtering
        const normalizedStatus = prospect.status?.toLowerCase() || '';
        return normalizedStatus === statusFilter.toLowerCase();
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(prospect => 
        (prospect.firstName && prospect.firstName.toLowerCase().includes(term)) ||
        (prospect.lastName && prospect.lastName.toLowerCase().includes(term)) ||
        (prospect.email && prospect.email.toLowerCase().includes(term)) ||
        (prospect.position && prospect.position.toLowerCase().includes(term)) ||
        (prospect.skills && prospect.skills.toLowerCase().includes(term)) ||
        (prospect.location && prospect.location.toLowerCase().includes(term)) ||
        (prospect.notes && prospect.notes.toLowerCase().includes(term))
      );
    }
    
    setFilteredProspects(result);
  }, [searchTerm, statusFilter, prospects]);

  return (
    <Dashboard>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Database className="h-8 w-8 mr-3 text-primary" />
              Prospect Database
            </h1>
            <p className="text-muted-foreground">
              Browse and filter all non-hired prospects in the system
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserRound className="w-5 h-5 mr-2 text-primary" />
              Active Prospects
            </CardTitle>
            <CardDescription>
              Comprehensive database of all prospects not yet hired
            </CardDescription>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, position, skills..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="screen call done">Screen Call Done</SelectItem>
                  <SelectItem value="sourcing">Sourcing</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="not selected">Not Selected</SelectItem>
                  <SelectItem value="not interested">Not Interested</SelectItem>
                  <SelectItem value="not screened">Not Screened</SelectItem>
                  <SelectItem value="in database">In Database</SelectItem>
                  <SelectItem value="sending to client">Sending to Client</SelectItem>
                  <SelectItem value="others better">Others Better</SelectItem>
                  <SelectItem value="no show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Loading state skeleton
              <>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : filteredProspects.length === 0 ? (
              // Empty state
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No prospects found matching your filters</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              // Prospects table
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProspects.map((prospect) => {
                      // Normalize status for comparison
                      const normalizedStatus = (prospect.status || '').toString().toLowerCase();
                      
                      // Check if already in sourcing
                      const isAlreadySourcing = normalizedStatus === 'sourcing';
                    
                      return (
                        <TableRow key={prospect.id}>
                          <TableCell className="font-medium">
                            {prospect.firstName} {prospect.lastName}
                          </TableCell>
                          <TableCell>{prospect.position || "N/A"}</TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {prospect.skills || "Not specified"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              // Determine badge variant based on status
                              let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
                              
                              if (normalizedStatus.includes('screen') || normalizedStatus.includes('interviewing')) {
                                variant = 'default'; // Blue
                              } else if (normalizedStatus.includes('sending to client') || 
                                        normalizedStatus.includes('database') ||
                                        normalizedStatus === 'sourcing') {
                                variant = 'secondary'; // Gray
                              } else if (normalizedStatus.includes('not selected') || 
                                        normalizedStatus.includes('not interested') || 
                                        normalizedStatus.includes('no show') ||
                                        normalizedStatus.includes('others better')) {
                                variant = 'destructive'; // Red
                              }
                              
                              // Format status for display - capitalize words
                              const displayStatus = prospect.status
                                ?.split(' ')
                                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ') || "Unknown";
                                
                              return (
                                <Badge variant={variant}>
                                  {displayStatus}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            {prospect.location || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {prospect.email}
                              {prospect.phone && (
                                <div>{prospect.phone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={isAlreadySourcing ? "outline" : "default"} 
                              size="sm"
                              disabled={isAlreadySourcing}
                              onClick={() => moveToSourcing(prospect.id)}
                            >
                              {isAlreadySourcing ? (
                                <>
                                  <Check className="mr-1 h-4 w-4" />
                                  In Sourcing
                                </>
                              ) : (
                                <>
                                  <MoveRight className="mr-1 h-4 w-4" />
                                  Move to Sourcing
                                </>
                              )}
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
      </div>
    </Dashboard>
  );
}