import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Action item type
interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "error" | "warning" | "info" | "success";
  link: string;
}

// Sample pending actions (in a real app this would come from an API)
const pendingActions: ActionItem[] = [
  {
    id: "action-1",
    title: "Client Approvals",
    description: "3 profiles awaiting client review",
    icon: "fa-exclamation-circle",
    color: "error",
    link: "/prospects?status=client_review"
  },
  {
    id: "action-2",
    title: "Contract Reviews",
    description: "2 contracts pending verification",
    icon: "fa-file-signature",
    color: "warning",
    link: "/contracts?status=pending"
  },
  {
    id: "action-3",
    title: "Upcoming Interviews",
    description: "5 interviews scheduled this week",
    icon: "fa-calendar-alt",
    color: "info",
    link: "/prospects?status=interview"
  }
];

// Color mappings
const colorClasses: Record<string, string> = {
  error: "bg-status-error/10 text-status-error",
  warning: "bg-status-warning/10 text-status-warning",
  info: "bg-status-info/10 text-status-info",
  success: "bg-status-success/10 text-status-success"
};

function ActionItem({ action }: { action: ActionItem }) {
  return (
    <li className="mb-3 last:mb-0">
      <Link href={action.link}>
        <a className="block p-3 rounded-lg border border-neutral-light hover:border-primary transition group">
          <div className="flex items-center">
            <div className={`${colorClasses[action.color]} p-2 rounded-full mr-3`}>
              <i className={`fas ${action.icon}`}></i>
            </div>
            <div>
              <h4 className="font-medium group-hover:text-primary">{action.title}</h4>
              <p className="text-sm text-neutral-dark">{action.description}</p>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}

export default function ActionsList() {
  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-light">
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <ul>
          {pendingActions.map(action => (
            <ActionItem key={action.id} action={action} />
          ))}
        </ul>
        
        <Button 
          className="w-full mt-4 border border-primary text-primary hover:bg-primary hover:text-white"
          variant="outline"
        >
          View All Actions
        </Button>
      </CardContent>
    </Card>
  );
}
