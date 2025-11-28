"use client";

import React from "react";
import { MapPin } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "A horizontal bar chart showing team registrations by city";

interface CityData {
  city: string;
  count: number;
}

interface BarChartHorizontalProps {
  data?: CityData[];
  barColor?: string;
  labelColor?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  maxCities?: number;
  barSize?: number;
}

const chartConfig = {
  count: {
    label: "Teams",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const defaultCityData: CityData[] = [
  { city: "Vancouver", count: 45 },
  { city: "Toronto", count: 38 },
  { city: "Calgary", count: 32 },
  { city: "Montreal", count: 28 },
  { city: "Ottawa", count: 24 },
  { city: "Edmonton", count: 18 },
  { city: "Other", count: 62 },
];

export function BarChartHorizontal({
  data = defaultCityData,
  barColor = "#000000",
  labelColor = "#ffffff",
  title = "Registrations by City",
  description = "Geographic distribution of team registrations",
  icon = <MapPin className="h-5 w-5" />,
  maxCities = 10,
  barSize = 20,
}: BarChartHorizontalProps) {
  // Process data to show top N cities and group the rest as "Other"
  const processedData = React.useMemo(() => {
    // Sort cities by count in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    // Check if "Other" already exists in the data
    const existingOtherIndex = sortedData.findIndex(
      (item) => item.city.toLowerCase() === "other"
    );
    let otherCount = 0;

    if (existingOtherIndex >= 0) {
      otherCount = sortedData[existingOtherIndex].count;
      sortedData.splice(existingOtherIndex, 1);
    }

    if (sortedData.length > maxCities) {
      // Take top N cities
      const topCities = sortedData.slice(0, maxCities);

      // Sum up the remaining cities
      const remainingCities = sortedData.slice(maxCities);
      const remainingCount =
        remainingCities.reduce((sum, city) => sum + city.count, 0) + otherCount;

      // Add "Other" category if there are remaining cities
      if (remainingCount > 0) {
        topCities.push({ city: "Other", count: remainingCount });
      }

      return topCities;
    }

    // If "Other" existed but we're showing all cities, add it back
    if (otherCount > 0) {
      sortedData.push({ city: "Other", count: otherCount });
    }

    return sortedData;
  }, [data, maxCities]);

  const dynamicChartConfig = {
    count: {
      label: "Teams",
      color: barColor,
    },
    label: {
      color: labelColor,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig} className="h-[300px]">
          <BarChart
            accessibilityLayer
            data={processedData}
            layout="vertical"
            margin={{
              right: 16,
              top: 10,
              bottom: 10,
            }}
            barSize={barSize}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="city"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" fill={barColor} radius={2}>
              <LabelList
                dataKey="city"
                position="insideLeft"
                offset={8}
                style={{ fill: labelColor }}
                fontSize={11}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Total teams: {data.reduce((sum, item) => sum + item.count, 0)}{" "}
          registered across {data.length} cities (showing top{" "}
          {Math.min(maxCities, data.length)})
        </div>
      </CardFooter>
    </Card>
  );
}
