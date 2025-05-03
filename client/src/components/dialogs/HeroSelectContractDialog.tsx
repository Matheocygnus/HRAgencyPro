import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Hero, Prospect } from "@shared/schema";
import { Loader2 } from "lucide-react";
import CreateContractForm from "../forms/CreateContractForm";

type HeroSelectContractDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HeroSelectContractDialog({
  isOpen,
  onOpenChange,
}: HeroSelectContractDialogProps) {
  const [selectedHeroId, setSelectedHeroId] = useState<string>("");
  const [showContractForm, setShowContractForm] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  
  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedHeroId("");
      setShowContractForm(false);
      setHeroData(null);
    }
  }, [isOpen]);
  
  // Fetch heroes data
  const { data: heroes = [], isLoading: isHeroesLoading } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
  });
  
  // Fetch prospects data (for names)
  const { data: prospects = [], isLoading: isProspectsLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });
  
  // Filter heroes without contracts
  const availableHeroes = heroes.filter(hero => !hero.contractId);
  
  // Get hero name by ID and prospect info
  const getHeroName = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return `Hero #${heroId}`;
    
    const prospect = prospects.find(p => p.id === hero.prospectId);
    if (!prospect) return `Hero #${heroId}`;
    
    return `${prospect.firstName} ${prospect.lastName}`;
  };
  
  // Get prospect position
  const getHeroPosition = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return "";
    
    const prospect = prospects.find(p => p.id === hero.prospectId);
    if (!prospect) return "";
    
    return prospect.position;
  };
  
  // Handle hero selection
  const handleHeroSelected = (heroId: string) => {
    setSelectedHeroId(heroId);
    const numericId = parseInt(heroId);
    
    // Find the hero and prepare data for the contract form
    const hero = heroes.find(h => h.id === numericId);
    if (hero) {
      const prospect = prospects.find(p => p.id === hero.prospectId);
      
      setHeroData({
        id: hero.id,
        prospectId: hero.prospectId,
        clientId: hero.clientId,
        companyId: hero.companyId,
        name: prospect ? `${prospect.firstName} ${prospect.lastName}` : `Hero #${hero.id}`,
        position: prospect?.position || 'Professional',
      });
    }
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (selectedHeroId && heroData) {
      setShowContractForm(true);
    }
  };
  
  // Loading state
  const isLoading = isHeroesLoading || isProspectsLoading;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Contract</DialogTitle>
          <DialogDescription>
            Select a hero without a contract to create a new agreement.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : showContractForm && heroData ? (
          <CreateContractForm 
            hero={heroData}
            onSuccess={() => {
              onOpenChange(false);
            }}
          />
        ) : (
          <div className="space-y-4 py-4">
            {availableHeroes.length === 0 ? (
              <div className="text-center py-4">
                <p>All heroes already have contracts.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new hero first or complete onboarding for existing prospects.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="hero-select" className="text-sm font-medium">
                    Select Hero
                  </label>
                  <Select value={selectedHeroId} onValueChange={handleHeroSelected}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a hero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Heroes</SelectLabel>
                        {availableHeroes.map(hero => (
                          <SelectItem key={hero.id} value={String(hero.id)}>
                            {getHeroName(hero.id)} - {getHeroPosition(hero.id)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedHeroId && (
                  <div className="pt-2">
                    <Button onClick={handleContinue} className="w-full">
                      Continue
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}