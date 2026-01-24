
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Jan', parcels: 120, revenue: 450, disputes: 5 },
    { name: 'Feb', parcels: 135, revenue: 520, disputes: 8 },
    { name: 'Mar', parcels: 140, revenue: 480, disputes: 4 },
    { name: 'Apr', parcels: 165, revenue: 610, disputes: 6 },
    { name: 'May', parcels: 155, revenue: 590, disputes: 3 },
    { name: 'Jun', parcels: 190, revenue: 720, disputes: 9 },
];

export function SystemHealthChart() {
    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">System Health Overview</CardTitle>
                <CardDescription>Cross-functional performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid stroke="#f5f5f5" vertical={false} />
                            <XAxis dataKey="name" scale="band" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="parcels" name="New Parcels" barSize={20} fill="#413ea0" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (k)" stroke="#ff7300" />
                            <Line yAxisId="left" type="monotone" dataKey="disputes" name="Disputes" stroke="#ff0000" strokeDasharray="3 3" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
