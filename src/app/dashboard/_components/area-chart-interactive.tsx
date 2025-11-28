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

// Mock registration data - replace with real API calls
const registrationData = [
  { date: "2024-09-01", registrations: 5, cumulative: 5 },
  { date: "2024-09-02", registrations: 8, cumulative: 13 },
  { date: "2024-09-03", registrations: 3, cumulative: 16 },
  { date: "2024-09-04", registrations: 12, cumulative: 28 },
  { date: "2024-09-05", registrations: 7, cumulative: 35 },
  { date: "2024-09-06", registrations: 15, cumulative: 50 },
  { date: "2024-09-07", registrations: 4, cumulative: 54 },
  { date: "2024-09-08", registrations: 18, cumulative: 72 },
  { date: "2024-09-09", registrations: 2, cumulative: 74 },
  { date: "2024-09-10", registrations: 9, cumulative: 83 },
  { date: "2024-09-11", registrations: 14, cumulative: 97 },
  { date: "2024-09-12", registrations: 6, cumulative: 103 },
  { date: "2024-09-13", registrations: 11, cumulative: 114 },
  { date: "2024-09-14", registrations: 3, cumulative: 117 },
  { date: "2024-09-15", registrations: 16, cumulative: 133 },
  { date: "2024-09-16", registrations: 8, cumulative: 141 },
  { date: "2024-09-17", registrations: 22, cumulative: 163 },
  { date: "2024-09-18", registrations: 13, cumulative: 176 },
  { date: "2024-09-19", registrations: 5, cumulative: 181 },
  { date: "2024-09-20", registrations: 7, cumulative: 188 },
  { date: "2024-09-21", registrations: 19, cumulative: 207 },
  { date: "2024-09-22", registrations: 4, cumulative: 211 },
  { date: "2024-09-23", registrations: 10, cumulative: 221 },
  { date: "2024-09-24", registrations: 17, cumulative: 238 },
  { date: "2024-09-25", registrations: 6, cumulative: 244 },
  { date: "2024-09-26", registrations: 3, cumulative: 247 },
  { date: "2024-09-27", registrations: 0, cumulative: 247 },
  { date: "2024-09-28", registrations: 0, cumulative: 247 },
  { date: "2024-09-29", registrations: 0, cumulative: 247 },
  { date: "2024-09-30", registrations: 0, cumulative: 247 },
  { date: "2024-10-01", registrations: 0, cumulative: 247 },
  { date: "2024-10-15", registrations: 0, cumulative: 247 },
  { date: "2024-11-01", registrations: 0, cumulative: 247 },
  { date: "2024-11-15", registrations: 0, cumulative: 247 },
  { date: "2024-11-27", registrations: 0, cumulative: 247 },
];

const chartConfig = {
  registrations: {
    label: "Daily Registrations",
    color: "var(--chart-1)",
  },
  cumulative: {
    label: "Cumulative Total",
    color: "var(--chart-2)",
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

  const filteredData = registrationData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-11-27"); // Current date
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
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
                <stop
                  offset="5%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cumulative)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cumulative)"
                  stopOpacity={0.1}
                />
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
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="registrations"
              type="natural"
              fill="url(#fillRegistrations)"
              stroke="var(--color-registrations)"
              stackId="a"
            />
            <Area
              dataKey="cumulative"
              type="natural"
              fill="url(#fillCumulative)"
              stroke="var(--color-cumulative)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
