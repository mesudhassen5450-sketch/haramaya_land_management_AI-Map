
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { subject: "Boundary", A: 120, fullMark: 150 },
    { subject: "Ownership", A: 98, fullMark: 150 },
    { subject: "Inheritance", A: 86, fullMark: 150 },
    { subject: "Access", A: 65, fullMark: 150 },
    { subject: "Valuation", A: 90, fullMark: 150 },
    { subject: "Other", A: 45, fullMark: 150 },
];

export function DisputeTypeChart() {
    return (
        <Card className="col-span-1 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Dispute Categories</CardTitle>
                <CardDescription>Frequency by dispute type</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#e5e5e5" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Cases"
                                dataKey="A"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
