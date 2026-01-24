import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data for Value Appreciation
const valueData = [
    { year: "2020", value: 1200000 },
    { year: "2021", value: 1350000 },
    { year: "2022", value: 1520000 },
    { year: "2023", value: 1800000 },
    { year: "2024", value: 2150000 },
    { year: "2025", value: 2400000 },
];

// Mock Data for Tax Allocation (Where your money goes)
const taxAllocationData = [
    { name: "Infrastructure", value: 40, color: "#0ea5e9" },
    { name: "Education", value: 25, color: "#10b981" },
    { name: "Health Services", value: 20, color: "#f59e0b" },
    { name: "Public Safety", value: 15, color: "#ef4444" },
];

export const ValueAppreciationChart = () => {
    return (
        <Card className="rounded-[2.5rem] border-border bg-card shadow-lg p-6 overflow-hidden">
            <CardHeader className="px-4 pb-8">
                <CardTitle className="text-xl font-black text-foreground">Asset Value Appreciation</CardTitle>
                <CardDescription className="text-sm font-medium">Estimated market value growth of your combined property portfolio</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={valueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(value) => `ETB ${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: number) => [`ETB ${value.toLocaleString()}`, 'Portfolio Value']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const TaxAllocationChart = () => {
    return (
        <Card className="rounded-[2.5rem] border-border bg-card shadow-lg p-6 overflow-hidden">
            <CardHeader className="px-4 pb-8">
                <CardTitle className="text-xl font-black text-foreground">Tax Usage Transparency</CardTitle>
                <CardDescription className="text-sm font-medium">How your property tax contributions are allocated by the administration</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={taxAllocationData}
                            cx="40%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {taxAllocationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value: number) => [`${value}%`, 'Allocation']}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span className="text-xs font-bold text-foreground ml-2">{value} ({entry.payload.value}%)</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
