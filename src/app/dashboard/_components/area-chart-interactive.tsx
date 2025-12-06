"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { RegistrationService } from "@/services/registrationService";
interface RegistrationTrendData {
  date: string;
  registrations: number;
  cumulative: number;
}

const chartConfig = {
  registrations: {
    label: "Daily Registrations",
    color: "#3b82f6", // Blue - for daily registrations
  },
  cumulative: {
    label: "Cumulative Total",
    color: "#10b981", // Green - for cumulative growth
  },
} satisfies ChartConfig;

interface AreaChartInteractiveProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function AreaChartInteractive({
  title = "Registration Trends",
  description = "Daily registration activity over time",
  icon = <TrendingUp className="h-5 w-5" />,
}: AreaChartInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [registrationData, setRegistrationData] = React.useState<
    RegistrationTrendData[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch registration trends data
  React.useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);

        let days = 90;
        if (timeRange === "30d") days = 30;
        else if (timeRange === "7d") days = 7;
        else if (timeRange === "180d") days = 180;

        const result = await RegistrationService.getRegistrationTrends(days);

        if (result.error) {
          console.error("Error fetching registration trends:", result.error);
          setError("Failed to load registration trends");
        } else {
          setRegistrationData(result.data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Failed to load registration trends");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeRange]);

  // Data is already filtered by timeRange in the API call
  const filteredData = registrationData;

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="180d" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-3 pb-4 sm:px-6 sm:pt-4">
        {loading ? (
          <div className="flex h-[295px] items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex h-[295px] items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[295px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillRegistrations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="font-medium mb-2">
                          {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="space-y-1">
                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: entry.stroke || entry.color,
                                }}
                              />
                              <span className="text-muted-foreground">
                                {entry.dataKey === "registrations"
                                  ? "Daily Registrations"
                                  : "Cumulative Total"}
                              </span>
                              <span className="font-medium ml-auto">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                dataKey="registrations"
                type="natural"
                fill="url(#fillRegistrations)"
                stroke="#3b82f6"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="cumulative"
                type="natural"
                fill="url(#fillCumulative)"
                stroke="#10b981"
                strokeWidth={2}
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        )}

        {/* Simple Statistics Line */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="flex items-center gap-2 pt-2 mt-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              Average:{" "}
              {(
                filteredData.reduce(
                  (sum, item) => sum + item.registrations,
                  0
                ) / filteredData.length
              ).toFixed(1)}{" "}
              registrations/day over{" "}
              {timeRange === "7d"
                ? "7 days"
                : timeRange === "30d"
                ? "30 days"
                : timeRange === "180d"
                ? "6 months"
                : "3 months"}{" "}
              ({filteredData[filteredData.length - 1]?.cumulative || 0} total)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
