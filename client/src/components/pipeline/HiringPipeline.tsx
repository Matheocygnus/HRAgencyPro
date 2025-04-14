import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import ProspectForm from "@/components/forms/ProspectForm";
import { Prospect } from "@shared/schema";

// Pipeline stage configuration
const PIPELINE_STAGES = [
  { id: "sourcing", name: "Prospect Sourcing", key: "sourcing", icon: "fa-search" },
  { id: "interview", name: "Interview Stage", key: "interview", icon: "fa-comments" },
  { id: "client_review", name: "Client Review", key: "client_review", icon: "fa-clipboard-check" },
  { id: "budget", name: "Budget Agreement", key: "budget", icon: "fa-money-bill-wave" },
  { id: "contract", name: "Contract & Hire", key: "contract", icon: "fa-file-signature" }
];

// Status badge configuration
const STATUS_BADGES: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" | "primary" | null }> = {
  "new": { label: "New", variant: "primary" },
  "scheduled": { label: "Scheduled", variant: "secondary" },
  "pending": { label: "Pending", variant: "outline" },
  "negotiating": { label: "Negotiating", variant: "secondary" },
  "rejected": { label: "Rejected", variant: "destructive" },
  "signing": { label: "Signing", variant: "primary" }
};

interface ProspectCardProps {
  prospect: Prospect;
}

function ProspectCard({ prospect }: ProspectCardProps) {
  // Status badge logic - this would come from the prospect data in a real implementation
  // but for now we'll derive it based on other fields
  let statusKey = "new";
  
  if (prospect.status === "interview" && prospect.isInterviewed) {
    statusKey = "scheduled";
  } else if (prospect.status === "client_review") {
    statusKey = "pending";
  } else if (prospect.status === "budget") {
    statusKey = "negotiating";
  } else if (prospect.status === "contract") {
    statusKey = "signing";
  }
  
  const statusBadge = STATUS_BADGES[statusKey] || STATUS_BADGES.new;
  
  return (
    <div className="bg-neutral-lightest rounded-lg p-3 mb-3 border border-neutral-light hover:shadow-sm transition">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{`${prospect.firstName} ${prospect.lastName}`}</h4>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>
      <p className="text-neutral-dark text-sm mt-2">{prospect.position}</p>
      <div className="flex items-center mt-3 text-xs text-neutral-dark">
        <span className="flex items-center mr-3">
          <i className="fas fa-building mr-1"></i>
          <span>{prospect.companyId ? `Company #${prospect.companyId}` : "No Company"}</span>
        </span>
        <span className="flex items-center">
          <i className="fas fa-calendar mr-1"></i>
          <span>{`Added ${new Date(prospect.createdAt).toLocaleDateString()}`}</span>
        </span>
      </div>
    </div>
  );
}

interface PipelineStageProps {
  stage: typeof PIPELINE_STAGES[0];
  prospects: Prospect[];
  onAddClick: (stage: string) => void;
}

function PipelineStage({ stage, prospects, onAddClick }: PipelineStageProps) {
  return (
    <div className="flex-shrink-0 w-64 mr-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{stage.name}</h3>
        <Badge variant="outline" className="text-neutral-dark">{prospects.length}</Badge>
      </div>
      
      {prospects.map(prospect => (
        <ProspectCard key={prospect.id} prospect={prospect} />
      ))}
      
      <Button 
        variant="ghost" 
        className="w-full py-2 text-primary hover:text-primary-dark text-sm"
        onClick={() => onAddClick(stage.id)}
      >
        <i className="fas fa-plus mr-1"></i>
        <span>Add Prospect</span>
      </Button>
    </div>
  );
}

export default function HiringPipeline() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  // Fetch prospects
  const { data: prospects = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });
  
  const handleAddClick = (stage: string) => {
    setSelectedStage(stage);
    setAddDialogOpen(true);
  };
  
  // Group prospects by pipeline stage
  const prospectsByStage: Record<string, Prospect[]> = {};
  
  PIPELINE_STAGES.forEach(stage => {
    prospectsByStage[stage.id] = prospects.filter(p => p.status === stage.id);
  });
  
  return (
    <>
      <Card>
        <CardHeader className="border-b border-neutral-light flex justify-between items-center py-4">
          <CardTitle>Hiring Pipeline</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-2">
              {PIPELINE_STAGES.map(stage => (
                <PipelineStage 
                  key={stage.id}
                  stage={stage}
                  prospects={prospectsByStage[stage.id] || []}
                  onAddClick={handleAddClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
          </DialogHeader>
          <ProspectForm 
            initialStage={selectedStage || 'sourcing'} 
            onSuccess={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
