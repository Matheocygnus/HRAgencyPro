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
import { Database, Search, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProspectDatabase() {
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<any[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Fetch all prospects on component mount
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch('/api/prospects');
        if (!response.ok) throw new Error('Failed to fetch prospects');
        
        const data = await response.json();
        
        // Filter out any prospect that has been hired (has a hero record)
        const nonHiredProspects = data.filter((prospect: any) => 
          !prospect.isHired && 
          prospect.status !== 'hired' && 
          prospect.status !== 'Hired'
        );
        
        setProspects(nonHiredProspects);
        setFilteredProspects(nonHiredProspects);
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

    fetchProspects();
  }, [toast]);

  // Apply filters whenever searchTerm or statusFilter changes
  useEffect(() => {
    let result = [...prospects];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(prospect => prospect.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(prospect => 
        (prospect.firstName && prospect.firstName.toLowerCase().includes(term)) ||
        (prospect.lastName && prospect.lastName.toLowerCase().includes(term)) ||
        (prospect.email && prospect.email.toLowerCase().includes(term)) ||
        (prospect.position && prospect.position.toLowerCase().includes(term)) ||
        (prospect.skills && prospect.skills.toLowerCase().includes(term))
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
                  <SelectItem value="sourcing">Sourcing</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProspects.map((prospect) => (
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
                          <Badge variant={
                            prospect.status === 'interviewing' ? 'default' :
                            prospect.status === 'offer' ? 'secondary' :
                            prospect.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {prospect.status?.charAt(0).toUpperCase() + prospect.status?.slice(1) || "Unknown"}
                          </Badge>
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
                      </TableRow>
                    ))}
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