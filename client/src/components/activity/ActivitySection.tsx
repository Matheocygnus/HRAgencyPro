import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Type for activity item
interface ActivityItem {
  id: string;
  type: "contract" | "interview" | "invoice" | "client";
  title: string;
  description: string;
  timestamp: Date;
}

// Sample activity data (in a real app this would come from an API)
const recentActivities: ActivityItem[] = [
  {
    id: "act-1",
    type: "contract",
    title: "Hero Contract Signed",
    description: "David Chen has been successfully hired as a DevOps Engineer for InfraCloud.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: "act-2",
    type: "interview",
    title: "Interview Scheduled",
    description: "Interview scheduled for Mike Thompson (Backend Developer) with CloudTech for tomorrow at 2:00 PM.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: "act-3",
    type: "invoice",
    title: "New Invoice Generated",
    description: "Invoice #INV-2023-042 for DesignStudio has been generated and requires admin approval.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "act-4",
    type: "client",
    title: "New Client Added",
    description: "AgileCore Inc has been added as a new client. Awaiting admin verification.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  }
];

// Map of activity types to icon and color classes
const activityTypeConfig: Record<string, { icon: string, colorClass: string }> = {
  contract: { icon: "fa-user-check", colorClass: "bg-status-success bg-opacity-10 text-status-success" },
  interview: { icon: "fa-calendar-check", colorClass: "bg-primary bg-opacity-10 text-primary" },
  invoice: { icon: "fa-file-invoice", colorClass: "bg-status-info bg-opacity-10 text-status-info" },
  client: { icon: "fa-building", colorClass: "bg-status-warning bg-opacity-10 text-status-warning" }
};

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? "Yesterday" : `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  } else {
    return "Just now";
  }
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const config = activityTypeConfig[activity.type];
  
  return (
    <div className="flex items-start mb-4 last:mb-0">
      <div className={`${config.colorClass} p-2 rounded-full mr-3`}>
        <i className={`fas ${config.icon}`}></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{activity.title}</h4>
          <span className="text-xs text-neutral-medium">{formatTimeAgo(activity.timestamp)}</span>
        </div>
        <p className="text-sm text-neutral-dark mt-1">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

export default function ActivitySection() {
  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-light flex justify-between items-center">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="p-4">
        {recentActivities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </CardContent>
    </Card>
  );
}
