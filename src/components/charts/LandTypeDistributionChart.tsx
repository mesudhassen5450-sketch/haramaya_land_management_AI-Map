
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Residential", value: 350, color: "#0ea5e9" },
    { name: "Commercial", value: 120, color: "#8b5cf6" },
    { name: "Agricultural", value: 200, color: "#10b981" },
    { name: "Public", value: 45, color: "#f59e0b" },
    { name: "Mixed", value: 30, color: "#6366f1" },
];

export function LandTypeDistributionChart() {
    return (
        <Card className="col-span-1 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Land Use Distribution</CardTitle>
                <CardDescription>Parcels by usage type</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`${value} Parcels`, "Count"]}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-sm text-foreground ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
