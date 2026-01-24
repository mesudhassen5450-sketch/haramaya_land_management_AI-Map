import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Plus,
  Scale,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDisputes, useDisputeStats, useCreateDispute } from "@/hooks/useDisputes";
import { useLandParcels, useLandOwners } from "@/hooks/useLandParcels";
import { DisputeTypeChart } from "@/components/charts/DisputeTypeChart";
import { DisputeSeverityChart } from "@/components/charts/DisputeSeverityChart";
import { toast } from "sonner";

export default function Disputes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDispute, setNewDispute] = useState({
    title: "",
    description: "",
    dispute_type: "boundary",
    priority: "medium",
    parcel_id: "",
    complainant_id: "",
    respondent_id: "",
  });

  const { data: disputes, isLoading } = useDisputes();
  const { data: stats, isLoading: statsLoading } = useDisputeStats();
  const { data: parcels } = useLandParcels();
  const { data: owners } = useLandOwners();
  const createDispute = useCreateDispute();

  const filteredDisputes = disputes?.filter((dispute) => {
    const matchesSearch =
      dispute.dispute_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.complainant?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dispute.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || dispute.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleCreateDispute = async () => {
    if (!newDispute.title || !newDispute.description || !newDispute.dispute_type) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createDispute.mutateAsync({
        title: newDispute.title,
        description: newDispute.description,
        dispute_type: newDispute.dispute_type,
        priority: newDispute.priority,
        parcel_id: newDispute.parcel_id || null,
        complainant_id: newDispute.complainant_id || null,
        respondent_id: newDispute.respondent_id || null,
      });
      toast.success("Dispute case created successfully");
      setIsDialogOpen(false);
      setNewDispute({
        title: "",
        description: "",
        dispute_type: "boundary",
        priority: "medium",
        parcel_id: "",
        complainant_id: "",
        respondent_id: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create dispute");
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "badge-status-overdue";
      case "medium":
        return "badge-status-pending";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "badge-status-active";
      case "under_review":
        return "badge-status-pending";
      case "open":
        return "bg-muted text-muted-foreground";
      case "escalated":
        return "badge-status-overdue";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Calculate dispute type distribution
  const disputeTypes = disputes?.reduce((acc, d) => {
    const type = d.dispute_type || "other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalDisputes = disputes?.length || 0;
  const disputeStats = Object.entries(disputeTypes).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
    count,
    percentage: totalDisputes > 0 ? Math.round((count / totalDisputes) * 100) : 0,
  }));

  return (
    <MainLayout
      title="Dispute Management"
      subtitle="Land dispute cases and resolution tracking"
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
              title="Active Cases"
              value={stats?.open || 0}
              change={`${stats?.byPriority?.high || 0} high priority`}
              changeType="neutral"
              icon={Scale}
              variant="primary"
            />
            <StatCard
              title="Resolved"
              value={stats?.resolved || 0}
              change={`${stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate`}
              changeType="positive"
              icon={CheckCircle}
              variant="success"
            />
            <StatCard
              title="Under Review"
              value={stats?.byStatus?.under_review || 0}
              change="Being processed"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Total Cases"
              value={stats?.total || 0}
              change="All time"
              changeType="neutral"
              icon={FileText}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <Card className="animate-slide-up col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  File New Dispute
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>File New Dispute</DialogTitle>
                  <DialogDescription>
                    Create a new land dispute case.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Title *</Label>
                    <Input
                      value={newDispute.title}
                      onChange={(e) => setNewDispute({ ...newDispute, title: e.target.value })}
                      placeholder="Brief title for the dispute"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Type *</Label>
                      <Select
                        value={newDispute.dispute_type}
                        onValueChange={(value) => setNewDispute({ ...newDispute, dispute_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boundary">Boundary</SelectItem>
                          <SelectItem value="ownership">Ownership</SelectItem>
                          <SelectItem value="valuation_appeal">Valuation Appeal</SelectItem>
                          <SelectItem value="encroachment">Encroachment</SelectItem>
                          <SelectItem value="double_registration">Double Registration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Priority</Label>
                      <Select
                        value={newDispute.priority}
                        onValueChange={(value) => setNewDispute({ ...newDispute, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Related Parcel</Label>
                    <Select
                      value={newDispute.parcel_id}
                      onValueChange={(value) => setNewDispute({ ...newDispute, parcel_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parcel (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {parcels?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.parcel_id} - {p.land_owners?.full_name || "Unknown"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Complainant</Label>
                      <Select
                        value={newDispute.complainant_id}
                        onValueChange={(value) => setNewDispute({ ...newDispute, complainant_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners?.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Respondent</Label>
                      <Select
                        value={newDispute.respondent_id}
                        onValueChange={(value) => setNewDispute({ ...newDispute, respondent_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners?.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Description *</Label>
                    <Textarea
                      value={newDispute.description}
                      onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                      placeholder="Detailed description of the dispute..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDispute} disabled={createDispute.isPending}>
                    {createDispute.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Case
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Hearing
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Assign Officer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by case ID, title, or parties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dispute Cases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No dispute cases found</p>
          <p className="text-sm">Try adjusting your filters or create a new case</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDisputes.map((dispute, index) => (
            <Card
              key={dispute.id}
              className="animate-slide-up hover:shadow-card-hover transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{dispute.dispute_id}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {dispute.dispute_type?.replace(/_/g, " ") || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={cn("text-xs capitalize", getPriorityColor(dispute.priority))}>
                      {dispute.priority || "Medium"}
                    </Badge>
                    <Badge variant="secondary" className={cn("text-xs capitalize", getStatusColor(dispute.status))}>
                      {dispute.status?.replace(/_/g, " ") || "Open"}
                    </Badge>
                  </div>
                </div>

                <h4 className="font-medium text-foreground mb-2">{dispute.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {dispute.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Complainant:</span>
                    <span className="text-foreground truncate">
                      {dispute.complainant?.full_name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Parcel:</span>
                    <span className="text-foreground">
                      {dispute.land_parcels?.parcel_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Filed:</span>
                    <span className="text-foreground">
                      {dispute.created_at?.split("T")[0] || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="text-foreground">
                      {dispute.updated_at?.split("T")[0] || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Assigned: {dispute.assigned_to ? "Yes" : "Unassigned"}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
