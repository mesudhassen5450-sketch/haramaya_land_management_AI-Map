import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Map,
  Receipt,
  Users,
  Scale,
  Building,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useReportStats, useRecentActivity } from "@/hooks/useReports";
import { SystemHealthChart } from "@/components/charts/SystemHealthChart";
import { useLandParcels } from "@/hooks/useLandParcels";
import { usePayments } from "@/hooks/usePayments";
import { useTaxAssessments } from "@/hooks/useTaxAssessments";
import { usePropertyValuations } from "@/hooks/usePropertyValuations";
import { useDisputes } from "@/hooks/useDisputes";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { toast } from "sonner";

const reportTemplates = [
  {
    id: "tax-revenue",
    name: "Property Tax Revenue Report",
    description: "Comprehensive analysis of tax collection by zone, type, and period",
    category: "Revenue",
    icon: Receipt,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "land-registration",
    name: "Land Registration Statistics",
    description: "Summary of registered parcels, ownership transfers, and new registrations",
    category: "Land",
    icon: Map,
    formats: ["PDF", "Excel"],
  },
  {
    id: "outstanding-tax",
    name: "Outstanding Tax Report",
    description: "List of properties with pending or overdue tax payments",
    category: "Revenue",
    icon: TrendingUp,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "valuation-summary",
    name: "Property Valuation Summary",
    description: "Aggregate valuation data by zone and land use type",
    category: "Valuation",
    icon: Building,
    formats: ["PDF", "Excel"],
  },
  {
    id: "dispute-resolution",
    name: "Dispute Resolution Report",
    description: "Status and outcomes of land dispute cases",
    category: "Legal",
    icon: Scale,
    formats: ["PDF"],
  },
  {
    id: "activity-audit",
    name: "User Activity Audit Log",
    description: "System access and transaction audit trail",
    category: "Audit",
    icon: Users,
    formats: ["PDF", "CSV"],
  },
];

const categoryColors: Record<string, string> = {
  Revenue: "bg-primary/10 text-primary",
  Land: "bg-accent/10 text-accent",
  Valuation: "bg-secondary/20 text-secondary-foreground",
  Legal: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Audit: "bg-muted text-muted-foreground",
};

export default function Reports() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reportType, setReportType] = useState("revenue");
  const [period, setPeriod] = useState("month");
  const [zone, setZone] = useState("all");
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useReportStats();
  const { data: activities } = useRecentActivity();
  const { data: parcels } = useLandParcels();
  const { data: payments } = usePayments();
  const { data: taxes } = useTaxAssessments();
  const { data: valuations } = usePropertyValuations();
  const { data: disputes } = useDisputes();

  const filteredTemplates = reportTemplates.filter(
    (r) => categoryFilter === "all" || r.category.toLowerCase() === categoryFilter
  );

  const getReportData = (reportId: string) => {
    switch (reportId) {
      case "tax-revenue":
        return payments?.map((p) => ({
          receipt_number: p.receipt_number,
          amount: p.amount,
          payment_method: p.payment_method,
          payment_date: p.payment_date,
          parcel_id: p.tax_assessments?.land_parcels?.parcel_id || "N/A",
          owner: p.tax_assessments?.land_parcels?.land_owners?.full_name || "Unknown",
        })) || [];
      case "land-registration":
        return parcels?.map((p) => ({
          parcel_id: p.parcel_id,
          owner: p.land_owners?.full_name || "Unknown",
          land_use: p.land_use,
          area_sqm: p.area_sqm,
          zone: p.zone || "N/A",
          status: p.status,
          registration_date: p.registration_date || p.created_at?.split("T")[0],
        })) || [];
      case "outstanding-tax":
        return taxes?.filter((t) => t.status !== "paid").map((t) => ({
          tax_id: t.tax_id,
          parcel_id: t.land_parcels?.parcel_id || "N/A",
          owner: t.land_parcels?.land_owners?.full_name || "Unknown",
          total_due: t.total_due,
          due_date: t.due_date,
          status: t.status,
        })) || [];
      case "valuation-summary":
        return valuations?.map((v) => ({
          parcel_id: v.land_parcels?.parcel_id || "N/A",
          owner: v.land_parcels?.land_owners?.full_name || "Unknown",
          land_use: v.land_parcels?.land_use || "N/A",
          assessed_value: v.assessed_value,
          market_value: v.market_value || "N/A",
          valuation_date: v.valuation_date,
          approved: v.approved_at ? "Yes" : "No",
        })) || [];
      case "dispute-resolution":
        return disputes?.map((d) => ({
          dispute_id: d.dispute_id,
          title: d.title,
          type: d.dispute_type,
          status: d.status,
          priority: d.priority,
          complainant: d.complainant?.full_name || "N/A",
          respondent: d.respondent?.full_name || "N/A",
          created: d.created_at?.split("T")[0],
        })) || [];
      case "activity-audit":
        return activities?.map((a) => ({
          action: a.action,
          entity_type: a.entity_type,
          entity_id: a.entity_id || "N/A",
          timestamp: a.created_at,
          ip_address: a.ip_address || "N/A",
        })) || [];
      default:
        return [];
    }
  };

  const handleExport = async (reportId: string, format: string) => {
    setGenerating(`${reportId}-${format}`);

    try {
      const data = getReportData(reportId);
      const template = reportTemplates.find((t) => t.id === reportId);
      const filename = `${reportId}-${new Date().toISOString().split("T")[0]}`;

      if (data.length === 0) {
        toast.error("No data available for this report");
        return;
      }

      switch (format) {
        case "CSV":
          exportToCSV(data, filename);
          break;
        case "Excel":
          exportToExcel(data, filename);
          break;
        case "PDF":
          exportToPDF(template?.name || "Report", data);
          break;
      }

      toast.success(`${format} report generated successfully`);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  const handleQuickGenerate = () => {
    setGenerating("quick");

    let data: Record<string, unknown>[] = [];
    let title = "";

    switch (reportType) {
      case "revenue":
        data = getReportData("tax-revenue");
        title = "Tax Revenue Report";
        break;
      case "registration":
        data = getReportData("land-registration");
        title = "Land Registration Report";
        break;
      case "valuation":
        data = getReportData("valuation-summary");
        title = "Property Valuation Report";
        break;
      case "disputes":
        data = getReportData("dispute-resolution");
        title = "Disputes Report";
        break;
    }

    if (zone !== "all") {
      data = data.filter((d: any) => d.zone === zone);
    }

    if (data.length === 0) {
      toast.error("No data available for this report");
      setGenerating(null);
      return;
    }

    exportToPDF(title, data);
    toast.success("Report generated successfully");
    setGenerating(null);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(1)}K`;
    return `ETB ${amount.toFixed(0)}`;
  };

  const recentDownloads = activities?.slice(0, 3).map((a) => ({
    name: `${a.action} - ${a.entity_type}`,
    date: a.created_at?.split("T")[0] || "N/A",
    size: "~1 MB",
  })) || [];

  return (
    <MainLayout
      title="Reports & Analytics"
      subtitle="Generate and download comprehensive reports"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Parcels"
              value={stats?.totalParcels || 0}
              change="Registered properties"
              changeType="neutral"
              icon={Map}
              variant="primary"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalRevenue || 0)}
              change="All time collections"
              changeType="positive"
              icon={Receipt}
              variant="gold"
            />
            <StatCard
              title="Active Valuations"
              value={stats?.totalValuations || 0}
              change="Current assessments"
              changeType="neutral"
              icon={Building}
            />
            <StatCard
              title="Open Disputes"
              value={stats?.disputesByStatus?.open || 0}
              change={`${stats?.totalDisputes || 0} total cases`}
              changeType="neutral"
              icon={Scale}
            />
          </>
        )}
      </div>

      <div className="mb-6">
        <SystemHealthChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Available Reports</h2>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="valuation">Valuation</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((report, index) => (
              <Card
                key={report.id}
                className="animate-slide-up hover:shadow-card-hover transition-shadow"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <report.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1">
                        {report.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className={categoryColors[report.category]}
                    >
                      {report.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getReportData(report.id).length} records
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Export:</span>
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleExport(report.id, format)}
                        disabled={generating === `${report.id}-${format}`}
                      >
                        {generating === `${report.id}-${format}` ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <>
                            {format === "Excel" && <FileSpreadsheet className="w-3 h-3 mr-1" />}
                            {format === "PDF" && <FileText className="w-3 h-3 mr-1" />}
                            {format === "CSV" && <Download className="w-3 h-3 mr-1" />}
                          </>
                        )}
                        {format}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Generate */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Quick Generate</CardTitle>
              <CardDescription>Create a custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Tax Revenue</SelectItem>
                  <SelectItem value="registration">Land Registration</SelectItem>
                  <SelectItem value="valuation">Property Valuation</SelectItem>
                  <SelectItem value="disputes">Disputes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="Zone A">Zone A - Town</SelectItem>
                  <SelectItem value="Zone B">Zone B - Market</SelectItem>
                  <SelectItem value="Zone C">Zone C - Rural</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full" onClick={handleQuickGenerate} disabled={generating === "quick"}>
                {generating === "quick" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4 mr-2" />
                )}
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDownloads.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                recentDownloads.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {report.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Data Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parcels by Land Use</span>
              </div>
              {stats?.parcelsByLandUse && Object.entries(stats.parcelsByLandUse).map(([use, count]) => (
                <div key={use} className="flex justify-between text-sm">
                  <span className="capitalize">{use}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assessed Value</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(stats?.totalAssessedValue || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
