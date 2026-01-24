
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Critical", resolved: 10, open: 5, escalated: 2 },
    { name: "High", resolved: 20, open: 15, escalated: 5 },
    { name: "Medium", resolved: 40, open: 25, escalated: 3 },
    { name: "Low", resolved: 30, open: 10, escalated: 0 },
];

export function DisputeSeverityChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Case Severity Analysis</CardTitle>
                <CardDescription>Status breakdown by priority level</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
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
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Legend />
                            <Bar dataKey="open" name="Open" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="escalated" name="Escalated" stackId="a" fill="#ef4444" />
                            <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
