
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

const data = [
    { month: "Jan", value: 4500000 },
    { month: "Feb", value: 5200000 },
    { month: "Mar", value: 4800000 },
    { month: "Apr", value: 6100000 },
    { month: "May", value: 5900000 },
    { month: "Jun", value: 7200000 },
];

export function ValuationTrendsChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Valuation Trends</CardTitle>
                <CardDescription>Assessed property values over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
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
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`ETB ${(value / 1000000).toFixed(2)}M`, "Total Value"]}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#0ea5e9" }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
