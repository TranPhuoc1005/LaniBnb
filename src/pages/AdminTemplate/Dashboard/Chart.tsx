"use client";

import { useState } from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookingItem } from "@/interface/booking.interface";
import { parseISO, isValid } from "date-fns";

export const description = "An interactive area chart";

const chartConfig = {
  checkout: {
    label: "Check-out",
    color: "var(--chart-1)",
  },
  checkin: {
    label: "Check-in",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function Chart({ data }: { data: BookingItem[] | undefined }) {
  // State
  const [timeRange, setTimeRange] = useState("90d");

  // Api
  const dataBooking = data?.slice(0, 50).map(item => ({
    ...item,
    ngayDen: new Date(item.ngayDen),
    ngayDi: new Date(item.ngayDi),
  })) ?? [];

  const bookingStatsMap = dataBooking?.reduce((acc, item) => {
    const dateCheckin = item.ngayDen.toISOString().split("T")[0];
    const dateCheckout = item.ngayDi.toISOString().split("T")[0];

    if (dateCheckin) {
      if (!acc[dateCheckin]) acc[dateCheckin] = { date: dateCheckin, checkin: 0, checkout: 0 };
      acc[dateCheckin].checkin += Number(item.soLuongKhach ?? 1);
    }

    if (dateCheckout) {
      if (!acc[dateCheckout]) acc[dateCheckout] = { date: dateCheckout, checkin: 0, checkout: 0 };
      acc[dateCheckout].checkout += Number(item.soLuongKhach ?? 1);
    }

    return acc;
  }, {} as Record<string, { date: string; checkin: number; checkout: number }>);

  const bookingArray = Object.values(bookingStatsMap)
    .filter(entry => isValid(parseISO(entry.date)))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const latestTime = bookingArray.length
    ? Math.max(...bookingArray.map(e => parseISO(e.date).getTime()))
    : Date.now();
  const referenceDate = new Date(latestTime);

  const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const filteredData = bookingArray.filter(e => parseISO(e.date).getTime() >= startDate.getTime());

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Số Liệu Phòng</CardTitle>
          <CardDescription>Tổng Quan Phòng Gần Đây</CardDescription>
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
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-checkout)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-checkout)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-checkin)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-checkin)"
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
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="checkin"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-checkin)"
              stackId="a"
            />
            <Area
              dataKey="checkout"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-checkout)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
