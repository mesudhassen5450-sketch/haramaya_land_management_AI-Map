
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const data = [
    { name: "Jan", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Feb", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Mar", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Apr", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "May", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Jun", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Jul", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Aug", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Sep", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Oct", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Nov", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
    { name: "Dec", total: Math.floor(Math.random() * 50000) + 10000, target: 45000 },
];

export function RevenueChart() {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                    Monthly tax collection vs target for the current fiscal year
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                                tickFormatter={(value) => `ETB ${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={(value: number) => [`ETB ${value.toLocaleString()}`, undefined]}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar
                                name="Revenue Collected"
                                dataKey="total"
                                fill="#0ea5e9"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                            <Bar
                                name="Target"
                                dataKey="target"
                                fill="#e2e8f0"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
