import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dashboard from "@/components/layout/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, ExternalLink, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define ProspectDatabase type based on the database schema
type ProspectDatabase = {
  id: number;
  name: string;
  status: string;
  rolePosition: string;
  otherRoleOfInterest: string | null;
  vocarooRecord: string | null;
  resume: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  programTools: string | null;
  englishLevel: string | null;
  createdAt: string;
};

const ProspectDatabasePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch prospects from database
  const { data: prospects, isLoading, error } = useQuery<ProspectDatabase[]>({
    queryKey: ["/api/prospects-database"],
    queryFn: async () => {
      const response = await fetch("/api/prospects-database");
      if (!response.ok) {
        throw new Error("Failed to fetch prospects database");
      }
      return response.json();
    },
  });
  
  // Mutation for moving a prospect to sourcing
  const moveToSourcingMutation = useMutation({
    mutationFn: async (prospectId: number) => {
      const response = await fetch(`/api/prospects-database/${prospectId}/move-to-sourcing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to move prospect to sourcing");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Prospect successfully moved to sourcing.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/prospects-database"] });
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
  
  // Filter prospects based on search term and exclude those with 'moved to sourcing' status
  const filteredProspects = prospects
    ? prospects.filter(prospect => {
        // Filter out prospects that have already been moved to sourcing
        if (prospect.status === 'moved to sourcing' || prospect.status === 'hired') {
          return false;
        }
        
        // Apply search filter to multiple fields
        const searchLower = searchTerm.toLowerCase();
        return (
          prospect.name?.toLowerCase().includes(searchLower) ||
          prospect.rolePosition?.toLowerCase().includes(searchLower) ||
          prospect.country?.toLowerCase().includes(searchLower) ||
          prospect.email?.toLowerCase().includes(searchLower) ||
          prospect.programTools?.toLowerCase().includes(searchLower) ||
          prospect.englishLevel?.toLowerCase().includes(searchLower)
        );
      })
    : [];
  
  const handleMoveToSourcing = (prospectId: number) => {
    moveToSourcingMutation.mutate(prospectId);
  };
  
  return (
    <Dashboard>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Prospect Database</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Search className="text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredProspects.length} prospects found
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                Error loading prospects database: {String(error)}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Available Prospects</CardTitle>
              <CardDescription>
                These prospects have submitted applications but have not yet been moved to the sourcing phase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role Position</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>English Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProspects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No prospects found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProspects.map((prospect) => (
                        <TableRow key={prospect.id}>
                          <TableCell className="font-medium">{prospect.name}</TableCell>
                          <TableCell>{prospect.rolePosition || 'Not specified'}</TableCell>
                          <TableCell>{prospect.country || 'Not specified'}</TableCell>
                          <TableCell>
                            {prospect.email && (
                              <div className="mb-1">
                                <a href={`mailto:${prospect.email}`} className="text-primary hover:underline flex items-center gap-1">
                                  {prospect.email} <ExternalLink size={14} />
                                </a>
                              </div>
                            )}
                            {prospect.phone && (
                              <div>
                                <a href={`tel:${prospect.phone}`} className="text-muted-foreground hover:underline">
                                  {prospect.phone}
                                </a>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {prospect.englishLevel ? (
                              <Badge variant="outline">{prospect.englishLevel}</Badge>
                            ) : (
                              'Not specified'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {prospect.resume && (
                                <a 
                                  href={prospect.resume} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3 rounded-md"
                                >
                                  <ExternalLink size={14} className="mr-1" />
                                  Resume
                                </a>
                              )}
                              
                              <Button 
                                onClick={() => handleMoveToSourcing(prospect.id)} 
                                disabled={moveToSourcingMutation.isPending}
                                variant="default"
                                size="sm"
                              >
                                {moveToSourcingMutation.isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="mr-2 h-4 w-4" />
                                )}
                                Move to Sourcing
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </Dashboard>
  );
};

export default ProspectDatabasePage;