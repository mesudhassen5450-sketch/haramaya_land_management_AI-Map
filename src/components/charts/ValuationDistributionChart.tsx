
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Residential", value: 12000000, color: "#0ea5e9" },
    { name: "Commercial", value: 8500000, color: "#8b5cf6" },
    { name: "Agricultural", value: 4500000, color: "#10b981" },
    { name: "Public", value: 2000000, color: "#f59e0b" },
];

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    return `${(value / 1000).toFixed(0)}K`;
};

export function ValuationDistributionChart() {
    return (
        <Card className="col-span-1 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Valuation By Land Type</CardTitle>
                <CardDescription>Total assessed value distribution</CardDescription>
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
                                formatter={(value: number) => [`ETB ${formatCurrency(value)}`, "Value"]}
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
