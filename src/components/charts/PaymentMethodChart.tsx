
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Bank Transfer", uv: 45, fill: "#0ea5e9" },
    { name: "Mobile Money", uv: 35, fill: "#10b981" },
    { name: "Cash", uv: 20, fill: "#f59e0b" },
];

export function PaymentMethodChart() {
    return (
        <Card className="col-span-1 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Payment Methods</CardTitle>
                <CardDescription>Popularity of payment channels</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="30%"
                            outerRadius="100%"
                            barSize={20}
                            data={data}
                        >
                            <RadialBar
                                background
                                dataKey="uv"
                                label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                            />
                            <Legend
                                iconSize={10}
                                layout="vertical"
                                verticalAlign="middle"
                                wrapperStyle={{ right: 8, top: '25%', bottom: 0 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={(value: number) => [`${value}%`, "Usage"]}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
