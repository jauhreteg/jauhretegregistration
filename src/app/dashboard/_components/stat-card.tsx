"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  secondaryValue?: number;
  secondaryLabel?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  valueColor = "text-2xl font-bold",
  secondaryValue,
  secondaryLabel,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {secondaryValue !== undefined && secondaryLabel ? (
          // Dual value layout for cards with secondary values
          <div>
            <div className="flex items-baseline gap-4 mb-1">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{value}</div>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-muted-foreground">
                  {secondaryValue}
                </div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ) : (
          // Single value layout for regular cards
          <div>
            <div className={valueColor}>{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
