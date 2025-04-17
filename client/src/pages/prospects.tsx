import { useState, useEffect } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Prospect, Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ProspectForm from "@/components/forms/ProspectForm";
import { 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen,
  MapPin,
  Building,
  DollarSign,
  FileText,
  Headphones,
  History
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | "primary" | null, color: string }> = {
  "sourcing": { label: "Sourcing", variant: "outline", color: "bg-gray-100" },
  "contacted": { label: "Contacted", variant: "outline", color: "bg-cyan-100" },
  "interview": { label: "Interview", variant: "secondary", color: "bg-blue-100" },
  "client_review": { label: "Client Review", variant: "outline", color: "bg-purple-100" },
  "budget": { label: "Budget", variant: "primary", color: "bg-green-100" },
  "contract": { label: "Contract", variant: "default", color: "bg-amber-100" },
  "hired": { label: "Hired", variant: "default", color: "bg-emerald-100" },
  "rejected": { label: "Rejected", variant: "destructive", color: "bg-red-100" }
};

const COLUMNS = [
  { id: "sourcing", title: "Sourcing", color: "bg-gray-100" },
  { id: "contacted", title: "Contacted", color: "bg-cyan-100" },
  { id: "interview", title: "Interview", color: "bg-blue-100" },
  { id: "client_review", title: "Client Review", color: "bg-purple-100" },
  { id: "budget", title: "Budget", color: "bg-green-100" },
  { id: "contract", title: "Contract", color: "bg-amber-100" },
  { id: "hired", title: "Hired", color: "bg-emerald-100" },
  { id: "rejected", title: "Rejected", color: "bg-red-100" }
];

export default function Prospects() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch prospects
  const { data: serverProspects = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });
  
  // Use local state to make UI updates feel more responsive
  const [prospects, setProspects] = useState<Prospect[]>([]);
  
  // Update local state when server data changes
  useEffect(() => {
    setProspects(serverProspects);
  }, [serverProspects]);

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch companies for dropdown
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Update prospect status mutation
  const updateProspectMutation = useMutation({
    mutationFn: async (data: Partial<Prospect> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/prospects/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Prospect updated successfully",
      });
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

  // Filter and sort prospects
  const filteredProspects = prospects
    .filter(prospect => {
      const matchesSearch = 
        searchQuery === "" || 
        `${prospect.firstName} ${prospect.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || prospect.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get client name and company name by ID
  const getClientName = (clientId: number | null | undefined) => {
    if (!clientId) return "N/A";
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  const getCompanyName = (companyId: number | null | undefined) => {
    if (!companyId) return "N/A";
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `Company #${companyId}`;
  };

  const handleStatusChange = (prospectId: number, newStatus: string) => {
    // Make sure newStatus is a valid status value
    const validStatus = ["sourcing", "contacted", "interview", "client_review", "budget", "contract", "hired", "rejected"].includes(newStatus) 
      ? newStatus as "sourcing" | "contacted" | "interview" | "client_review" | "budget" | "contract" | "hired" | "rejected"
      : "sourcing";
      
    // Optimistic UI update - update local state immediately
    const updatedProspects = prospects.map(prospect => 
      prospect.id === prospectId 
        ? { 
            ...prospect, 
            status: validStatus
          }
        : prospect
    );
    setProspects(updatedProspects);
    
    // Then update on the server
    updateProspectMutation.mutate({ id: prospectId, status: validStatus });
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    
    // Check if dropped outside any droppable area
    if (!destination) return;
    
    // Check if dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get the prospect ID and update its status
    const prospectId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    // Update the status
    handleStatusChange(prospectId, newStatus);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prospects Pipeline</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Prospect
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recruiting Pipeline</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
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
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="client_review">Client Review</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProspects.length === 0 ? (
            <div className="text-center py-8">
              No prospects found. Add a new prospect to get started.
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 min-w-[1200px]">
                  {COLUMNS.map(column => (
                    <Droppable droppableId={column.id} key={column.id}>
                      {(provided, snapshot) => (
                        <div 
                          className="w-1/7 min-w-[250px]"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className={`${column.color} p-2 rounded-t-md`}>
                            <h3 className="font-semibold text-sm">{column.title}</h3>
                          </div>
                          <div 
                            className={`p-2 rounded-b-md min-h-[400px] ${
                              snapshot.isDraggingOver ? 'bg-blue-50' : column.color.replace('100', '50')
                            }`}
                          >
                            {filteredProspects
                              .filter(prospect => prospect.status === column.id)
                              .map((prospect, index) => (
                                <Draggable 
                                  key={prospect.id} 
                                  draggableId={prospect.id.toString()} 
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <Card 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`mb-2 hover:shadow-md ${
                                        snapshot.isDragging ? 'shadow-lg' : ''
                                      }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={() => {
                                        setSelectedProspect(prospect);
                                        setIsDetailDialogOpen(true);
                                      }}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="font-medium text-sm">
                                            {prospect.firstName} {prospect.lastName}
                                          </div>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                              <Button variant="ghost" className="h-7 w-7 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                              <DropdownMenuItem
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedProspect(prospect);
                                                  setIsEditDialogOpen(true);
                                                }}
                                              >
                                                Edit
                                              </DropdownMenuItem>
                                              {column.id !== "sourcing" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "sourcing");
                                                  }}
                                                >
                                                  Move to Sourcing
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "contacted" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "contacted");
                                                  }}
                                                >
                                                  Move to Contacted
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "interview" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "interview");
                                                  }}
                                                >
                                                  Move to Interview
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "client_review" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "client_review");
                                                  }}
                                                >
                                                  Move to Client Review
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "budget" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "budget");
                                                  }}
                                                >
                                                  Move to Budget
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "contract" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "contract");
                                                  }}
                                                >
                                                  Move to Contract
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "hired" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "hired");
                                                  }}
                                                >
                                                  Move to Hired
                                                </DropdownMenuItem>
                                              )}
                                              {column.id !== "rejected" && (
                                                <DropdownMenuItem
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(prospect.id, "rejected");
                                                  }}
                                                >
                                                  Move to Rejected
                                                </DropdownMenuItem>
                                              )}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">{prospect.position}</div>
                                        <div className="text-xs text-gray-500">{getClientName(prospect.clientId)}</div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Prospect Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
          </DialogHeader>
          <ProspectForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Prospect Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prospect</DialogTitle>
          </DialogHeader>
          {selectedProspect && (
            <ProspectForm 
              initialStage={selectedProspect.status}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Prospect Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prospect Details</DialogTitle>
          </DialogHeader>
          {selectedProspect && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Full Name</Label>
                        <p className="text-base">{selectedProspect.firstName} {selectedProspect.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="text-base flex items-center">
                          <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                          {selectedProspect.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Phone</Label>
                        <p className="text-base flex items-center">
                          <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                          {selectedProspect.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Skills</Label>
                        <p className="text-base flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          {selectedProspect.skills || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Resume</Label>
                        <p className="text-base flex items-center">
                          <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                          {selectedProspect.resume ? (
                            <a 
                              href={selectedProspect.resume} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Resume
                            </a>
                          ) : "Not available"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Voice Message</Label>
                        <p className="text-base flex items-center">
                          <Headphones className="mr-1 h-4 w-4 text-muted-foreground" />
                          {selectedProspect.voiceMessageUrl ? (
                            <div className="flex flex-col space-y-1 w-full">
                              <audio 
                                src={selectedProspect.voiceMessageUrl} 
                                controls 
                                className="max-w-full mt-1"
                              />
                              <a 
                                href={selectedProspect.voiceMessageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-xs"
                              >
                                Open voice message in new tab
                              </a>
                            </div>
                          ) : "No voice message available"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Building className="mr-2 h-5 w-5 text-primary" />
                      Company Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Client</Label>
                        <Select
                          value={selectedProspect.clientId?.toString() || ""}
                          onValueChange={(value) => {
                            const clientId = value === "" ? null : parseInt(value);
                            updateProspectMutation.mutate({ 
                              id: selectedProspect.id, 
                              clientId 
                            });
                          }}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Company</Label>
                        <Select
                          value={selectedProspect.companyId?.toString() || ""}
                          onValueChange={(value) => {
                            const companyId = value === "" ? null : parseInt(value);
                            updateProspectMutation.mutate({ 
                              id: selectedProspect.id, 
                              companyId 
                            });
                          }}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {companies
                              .filter(company => !selectedProspect.clientId || company.clientId === selectedProspect.clientId)
                              .map((company) => (
                                <SelectItem key={company.id} value={company.id.toString()}>
                                  {company.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Position</Label>
                        <p className="text-base">{selectedProspect.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      Status Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Current Stage</Label>
                        <Badge className={`${STATUS_BADGES[selectedProspect.status].color} text-sm font-medium mt-1`}>
                          {STATUS_BADGES[selectedProspect.status].label}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Created Date</Label>
                        <p className="text-base">{new Date(selectedProspect.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-primary" />
                      Budget Status
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm text-muted-foreground">Budget Agreed</Label>
                        <Switch
                          checked={!!selectedProspect.isBudgetAgreed}
                          onCheckedChange={(checked) => {
                            updateProspectMutation.mutate({ 
                              id: selectedProspect.id, 
                              isBudgetAgreed: checked 
                            });
                          }}
                        />
                        <span className="text-sm font-medium">
                          {selectedProspect.isBudgetAgreed ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Current Notes
                  </h3>
                  <div className="mt-2">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-muted-foreground">Notes</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Add current note to history
                            if (selectedProspect.notes) {
                              // Parse existing notes history or initialize empty array
                              let existingNotes = [];
                              try {
                                existingNotes = selectedProspect.notesHistory ? JSON.parse(selectedProspect.notesHistory) : [];
                              } catch (e) {
                                console.error("Failed to parse notes history:", e);
                              }

                              // Add new note
                              const newHistory = [
                                ...existingNotes,
                                {
                                  timestamp: new Date().toISOString(),
                                  note: selectedProspect.notes,
                                  status: selectedProspect.status,
                                  userName: "Current User" // Would be replaced with actual user name from auth
                                }
                              ];
                              
                              updateProspectMutation.mutate({ 
                                id: selectedProspect.id, 
                                notesHistory: JSON.stringify(newHistory),
                                notes: "" // Clear current notes after archiving
                              });
                            }
                          }}
                        >
                          Archive Note
                        </Button>
                      </div>
                      <Textarea 
                        value={selectedProspect.notes || ""} 
                        placeholder="Add notes here..."
                        className="min-h-[100px]"
                        onChange={(e) => {
                          updateProspectMutation.mutate({ 
                            id: selectedProspect.id, 
                            notes: e.target.value 
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <History className="mr-2 h-5 w-5 text-primary" />
                    Notes History
                  </h3>
                  <div className="mt-2 space-y-2">
                    {selectedProspect.notesHistory ? (
                      (() => {
                        try {
                          const notesHistory = JSON.parse(selectedProspect.notesHistory);
                          if (notesHistory && notesHistory.length > 0) {
                            return (
                              <div className="space-y-3">
                                {[...notesHistory].reverse().map((entry, index) => (
                                  <div key={index} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="flex items-center">
                                        <Badge className={`${STATUS_BADGES[entry.status]?.color || 'bg-gray-100'} mr-2`}>
                                          {STATUS_BADGES[entry.status]?.label || entry.status}
                                        </Badge>
                                        <span className="text-sm font-medium">{entry.userName}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(entry.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{entry.note}</p>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                        } catch (e) {
                          console.error("Failed to parse notes history:", e);
                        }
                        return <p className="text-sm text-muted-foreground">No previous notes found.</p>;
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">No previous notes found.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsDetailDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}>
                  Edit Prospect
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}