
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
    { month: "Jan", collected: 450000, target: 500000 },
    { month: "Feb", collected: 520000, target: 500000 },
    { month: "Mar", collected: 480000, target: 500000 },
    { month: "Apr", collected: 610000, target: 550000 },
    { month: "May", collected: 590000, target: 550000 },
    { month: "Jun", collected: 720000, target: 600000 },
];

export function TaxRevenueTrendChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Revenue Collection</CardTitle>
                <CardDescription>Monthly tax collection vs targets</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`ETB ${value.toLocaleString()}`, "Amount"]}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
