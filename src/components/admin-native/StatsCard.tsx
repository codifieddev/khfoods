import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconClassName,
}: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden border-slate-200 transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold tracking-tight text-slate-500 uppercase">{title}</CardTitle>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600", iconClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {(description || trend) && (
          <p className="mt-1 flex items-center text-xs text-slate-500 font-medium">
            {trend && (
              <span className={cn("mr-2 flex items-center", trend.isUp ? "text-emerald-500" : "text-rose-500")}>
                {trend.isUp ? "↑" : "↓"} {trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
