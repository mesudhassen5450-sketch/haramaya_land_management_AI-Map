
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", registrations: 45 },
    { month: "Feb", registrations: 52 },
    { month: "Mar", registrations: 38 },
    { month: "Apr", registrations: 65 },
    { month: "May", registrations: 48 },
    { month: "Jun", registrations: 72 },
];

export function RegistrationTrendChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Registration Trends</CardTitle>
                <CardDescription>New land parcels registered over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                            />
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="registrations"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#colorRegistrations)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
