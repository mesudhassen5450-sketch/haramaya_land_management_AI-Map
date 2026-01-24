
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#6366f1"];

export function LandUseChart() {
    const { data: stats, isLoading } = useDashboardStats();

    const chartData = stats?.landUseBreakdown ? Object.entries(stats.landUseBreakdown).map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[index % COLORS.length]
    })) : [];

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Land Use Distribution</CardTitle>
                <CardDescription>Breakdown of registered parcels by type</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : chartData.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data available</p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [value, "Parcels"]}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
