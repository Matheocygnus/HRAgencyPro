import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Role } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Check,
  Shield,
  Pencil,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MODULES } from "@/hooks/use-mock-auth";

// For UI, we'll display modules in groups
const MODULE_GROUPS = [
  {
    name: "Core Modules",
    modules: [
      { id: MODULES.DASHBOARD, label: "Dashboard", description: "View and access the main dashboard" },
      { id: MODULES.PROSPECTS, label: "Prospects", description: "Manage candidate pipeline" },
      { id: MODULES.INTERVIEWS, label: "Interviews", description: "Schedule and manage interviews" },
      { id: MODULES.HEROES, label: "Heroes", description: "View and manage contracted talent" },
      { id: MODULES.HERO_DETAIL, label: "Hero Details", description: "Access hero detailed profiles" },
    ]
  },
  {
    name: "Business Modules",
    modules: [
      { id: MODULES.COMPANIES, label: "Companies", description: "Manage client companies" },
      { id: MODULES.COMPANY_DETAIL, label: "Company Details", description: "Access company detailed profiles" },
      { id: MODULES.CONTRACTS, label: "Contracts", description: "Create and manage contracts" },
      { id: MODULES.INVOICES, label: "Invoices", description: "Generate and track invoices" },
    ]
  },
  {
    name: "Administration",
    modules: [
      { id: MODULES.USER_MANAGEMENT, label: "User Management", description: "Add and manage system users" },
      { id: MODULES.JOB_MANAGEMENT, label: "Job Management", description: "Manage job postings and requests" },
      { id: MODULES.ROLE_MANAGEMENT, label: "Role Management", description: "Define user roles and permissions" },
      { id: MODULES.SYSTEM_SETTINGS, label: "System Settings", description: "Configure system parameters" }
    ]
  }
];

// Mock roles for development
const mockRoles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access",
    permissions: JSON.stringify(Object.values(MODULES)),
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Recruiter",
    description: "Manage prospects and interviews",
    permissions: JSON.stringify([MODULES.DASHBOARD, MODULES.PROSPECTS, MODULES.INTERVIEWS]),
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Finance Manager",
    description: "Handle contracts and invoices",
    permissions: JSON.stringify([MODULES.DASHBOARD, MODULES.CONTRACTS, MODULES.INVOICES]),
    createdAt: new Date()
  }
];

export default function RoleManagement() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });
  const [editedRole, setEditedRole] = useState({
    id: 0,
    name: "",
    description: "",
    permissions: [] as string[]
  });
  
  // In a real app, this would be fetched from the server
  const { data: roles = mockRoles, isLoading } = useQuery<Role[]>({
    queryKey: ["/api/roles"],
    queryFn: () => Promise.resolve(mockRoles) // Mock API call
  });
  
  // Create role mutation - would call the API in a real app
  const createRoleMutation = useMutation({
    mutationFn: async (data: { name: string, description: string, permissions: string[] }) => {
      // This is a mock implementation
      const newRole: Role = {
        id: roles.length + 1,
        name: data.name,
        description: data.description,
        permissions: JSON.stringify(data.permissions),
        createdAt: new Date()
      };
      return newRole;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role created successfully",
      });
      setIsAddDialogOpen(false);
      setNewRole({
        name: "",
        description: "",
        permissions: []
      });
      // In a real app, this would invalidate the roles query
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update role mutation - would call the API in a real app
  const updateRoleMutation = useMutation({
    mutationFn: async (data: { id: number, name: string, description: string, permissions: string[] }) => {
      // This is a mock implementation
      const updatedRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description,
        permissions: JSON.stringify(data.permissions),
        createdAt: new Date()
      };
      return updatedRole;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      setIsEditDialogOpen(false);
      // In a real app, this would invalidate the roles query
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete role mutation - would call the API in a real app
  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      // This is a mock implementation
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      // In a real app, this would invalidate the roles query
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle creating a new role
  const handleCreateRole = () => {
    if (newRole.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (newRole.permissions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one permission",
        variant: "destructive",
      });
      return;
    }
    
    createRoleMutation.mutate(newRole);
  };
  
  // Handle updating a role
  const handleUpdateRole = () => {
    if (editedRole.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (editedRole.permissions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one permission",
        variant: "destructive",
      });
      return;
    }
    
    updateRoleMutation.mutate(editedRole);
  };
  
  // Handle module selection for new role
  const handleModuleToggle = (moduleId: string, targetState: "new" | "edit") => {
    if (targetState === "new") {
      const updatedPermissions = [...newRole.permissions];
      
      if (updatedPermissions.includes(moduleId)) {
        // Remove module if already selected
        const index = updatedPermissions.indexOf(moduleId);
        updatedPermissions.splice(index, 1);
      } else {
        // Add module if not selected
        updatedPermissions.push(moduleId);
      }
      
      setNewRole({
        ...newRole,
        permissions: updatedPermissions
      });
    } else {
      const updatedPermissions = [...editedRole.permissions];
      
      if (updatedPermissions.includes(moduleId)) {
        // Remove module if already selected
        const index = updatedPermissions.indexOf(moduleId);
        updatedPermissions.splice(index, 1);
      } else {
        // Add module if not selected
        updatedPermissions.push(moduleId);
      }
      
      setEditedRole({
        ...editedRole,
        permissions: updatedPermissions
      });
    }
  };
  
  // Parse permissions from string to array for a role
  const parsePermissions = (permissionsStr: string): string[] => {
    try {
      return JSON.parse(permissionsStr);
    } catch (e) {
      console.error("Failed to parse permissions:", e);
      return [];
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Roles and Permissions</CardTitle>
          <CardDescription>Define custom roles with specific access permissions</CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              No roles found. Add a new role to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between p-4 border-b">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Shield className="mr-2 h-5 w-5 text-primary" />
                          {role.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRole(role);
                              setEditedRole({
                                id: role.id,
                                name: role.name,
                                description: role.description || "",
                                permissions: parsePermissions(role.permissions)
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
                                deleteRoleMutation.mutate(role.id);
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {parsePermissions(role.permissions).map((permission) => {
                          // Find the module info
                          let moduleInfo = null;
                          MODULE_GROUPS.forEach(group => {
                            const found = group.modules.find(m => m.id === permission);
                            if (found) moduleInfo = found;
                          });
                          
                          return (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {moduleInfo ? moduleInfo.label : permission}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specific permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Recruiter, Finance Manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe this role's responsibilities"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-6">
                {MODULE_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <h3 className="text-sm font-medium">{group.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.modules.map((module) => (
                        <div key={module.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`new-${module.id}`}
                            checked={newRole.permissions.includes(module.id)}
                            onCheckedChange={() => handleModuleToggle(module.id, "new")}
                          />
                          <div className="space-y-1">
                            <Label htmlFor={`new-${module.id}`} className="text-sm font-medium">
                              {module.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Modify the role's name, description, or permissions</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Role Name</Label>
                  <Input
                    id="edit-name"
                    value={editedRole.name}
                    onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editedRole.description}
                    onChange={(e) => setEditedRole({ ...editedRole, description: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4 space-y-6">
                  {MODULE_GROUPS.map((group) => (
                    <div key={group.name} className="space-y-3">
                      <h3 className="text-sm font-medium">{group.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.modules.map((module) => (
                          <div key={module.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`edit-${module.id}`}
                              checked={editedRole.permissions.includes(module.id)}
                              onCheckedChange={() => handleModuleToggle(module.id, "edit")}
                            />
                            <div className="space-y-1">
                              <Label htmlFor={`edit-${module.id}`} className="text-sm font-medium">
                                {module.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {module.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}