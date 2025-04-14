import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string | null;
  trend?: "up" | "down" | "neutral";
  color: "primary" | "success" | "warning" | "info" | "error";
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  trend,
  color
}: StatCardProps) {
  // Define color classes
  const colorClasses = {
    primary: "bg-primary-light bg-opacity-10 text-primary",
    success: "bg-status-success bg-opacity-10 text-status-success",
    warning: "bg-status-warning bg-opacity-10 text-status-warning",
    info: "bg-status-info bg-opacity-10 text-status-info",
    error: "bg-status-error bg-opacity-10 text-status-error"
  };
  
  const trendColorClasses = {
    up: "text-status-success",
    down: "text-status-error",
    neutral: "text-neutral-dark"
  };
  
  return (
    <Card className="p-5">
      <div className="flex items-center">
        <div className={cn("p-3 rounded-full", colorClasses[color])}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div className="ml-4">
          <h3 className="text-neutral-medium text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      {change && trend && (
        <div className={cn("mt-3 text-sm flex items-center", trendColorClasses[trend])}>
          {trend === "up" && <i className="fas fa-arrow-up mr-1"></i>}
          {trend === "down" && <i className="fas fa-arrow-down mr-1"></i>}
          <span>{change}</span>
        </div>
      )}
    </Card>
  );
}
