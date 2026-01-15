import { Badge } from "@/components/ui/badge";
import { getRiskColor, getRiskLabel } from "@/lib/stats";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({
  score,
  showLabel = true,
  size = "md",
}: RiskBadgeProps) {
  const colorClass = getRiskColor(score);
  const label = getRiskLabel(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-transparent font-semibold text-white shadow",
        colorClass,
        sizeClasses[size]
      )}
    >
      {score.toFixed(1)} {showLabel && `- ${label}`}
    </div>
  );
}

interface TypeBadgeProps {
  isBaseline: boolean;
}

export function TypeBadge({ isBaseline }: TypeBadgeProps) {
  return (
    <Badge variant={isBaseline ? "secondary" : "destructive"}>
      {isBaseline ? "Baseline" : "Primary"}
    </Badge>
  );
}
