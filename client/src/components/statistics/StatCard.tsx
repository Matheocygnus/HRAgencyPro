import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  className
}: StatCardProps) {
  return (
    <Card className={cn("p-6 border border-slate-200 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-slate-600">{title}</h3>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <span className="ml-2 text-sm text-slate-500">{subtitle}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-full bg-blue-50", iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
