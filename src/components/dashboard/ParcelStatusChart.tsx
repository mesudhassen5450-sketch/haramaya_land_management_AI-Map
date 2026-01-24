
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", registered: 40, pending: 24, disputed: 2 },
    { name: "Feb", registered: 30, pending: 13, disputed: 1 },
    { name: "Mar", registered: 20, pending: 58, disputed: 4 },
    { name: "Apr", registered: 27, pending: 39, disputed: 2 },
    { name: "May", registered: 18, pending: 48, disputed: 1 },
    { name: "Jun", registered: 23, pending: 38, disputed: 2 },
];

export function ParcelStatusChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Registration Activity</CardTitle>
                <CardDescription>Monthly parcel registration and status trends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                            />
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="registered"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorRegistered)"
                                name="Registered"
                            />
                            <Area
                                type="monotone"
                                dataKey="pending"
                                stroke="#f59e0b"
                                fillOpacity={1}
                                fill="url(#colorPending)"
                                name="Pending"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
