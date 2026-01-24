
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Mon", amount: 45000 },
    { name: "Tue", amount: 52000 },
    { name: "Wed", amount: 38000 },
    { name: "Thu", amount: 65000 },
    { name: "Fri", amount: 48000 },
    { name: "Sat", amount: 25000 },
    { name: "Sun", amount: 15000 },
];

export function PaymentHistoryChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Transaction Volume</CardTitle>
                <CardDescription>Daily revenue collection trends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
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
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <Tooltip
                                formatter={(value: number) => [`ETB ${value.toLocaleString()}`, "Amount"]}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
