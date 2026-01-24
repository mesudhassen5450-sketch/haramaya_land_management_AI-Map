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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { useInquiries, useRespondToInquiry } from "@/hooks/useInquiries";
import { toast } from "sonner";

export default function Inquiries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false);
  const [response, setResponse] = useState("");

  const { data: inquiries, isLoading } = useInquiries();
  const respondToInquiry = useRespondToInquiry();

  const filteredInquiries = inquiries?.filter((inquiry) => {
    const matchesSearch =
      inquiry.inquiry_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || inquiry.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  // Stats calculation
  const totalInquiries = inquiries?.length || 0;
  const openInquiries = inquiries?.filter((i) => i.status === "open").length || 0;
  const respondedInquiries = inquiries?.filter((i) => i.status === "responded").length || 0;
  const closedInquiries = inquiries?.filter((i) => i.status === "closed").length || 0;

  const handleViewInquiry = (inquiry: InquiryWithUser) => {
    setSelectedInquiry(inquiry);
    setIsViewDialogOpen(true);
  };

  const handleOpenRespondDialog = (inquiry: InquiryWithUser) => {
    setSelectedInquiry(inquiry);
    setResponse("");
    setIsRespondDialogOpen(true);
  };

  const handleRespond = async () => {
    if (!selectedInquiry || !response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await respondToInquiry.mutateAsync({
        id: selectedInquiry.id,
        response: response.trim(),
      });
      toast.success("Response sent successfully");
      setIsRespondDialogOpen(false);
      setSelectedInquiry(null);
      setResponse("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send response");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "closed":
        return "badge-status-active";
      case "responded":
        return "badge-status-pending";
      case "open":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "badge-status-overdue";
      case "normal":
        return "badge-status-pending";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout
      title="Citizen Inquiries"
      subtitle="Manage and respond to citizen support requests"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Inquiries"
              value={totalInquiries}
              change="All time"
              changeType="neutral"
              icon={MessageSquare}
              variant="primary"
            />
            <StatCard
              title="Open"
              value={openInquiries}
              change="Awaiting response"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Responded"
              value={respondedInquiries}
              change="Pending closure"
              changeType="positive"
              icon={Send}
            />
            <StatCard
              title="Closed"
              value={closedInquiries}
              change="Resolved"
              changeType="positive"
              icon={CheckCircle}
            />
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, subject, or user..."
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
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="registration">Registration</SelectItem>
              <SelectItem value="dispute">Dispute</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inquiries Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No inquiries found</p>
          <p className="text-sm">Adjust your filters to see more results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {inquiry.inquiry_id}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {inquiry.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs capitalize", getPriorityBadge(inquiry.priority))}>
                    {inquiry.priority}
                  </Badge>
                  <Badge className={cn("text-xs capitalize", getStatusBadge(inquiry.status))}>
                    {inquiry.status === "closed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {inquiry.status === "open" && <Clock className="w-3 h-3 mr-1" />}
                    {inquiry.status}
                  </Badge>
                </div>
              </div>

              <h4 className="font-medium text-foreground mb-2">{inquiry.subject}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {inquiry.message}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {inquiry.profiles?.full_name || "Unknown User"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {inquiry.created_at.split("T")[0]}
                </span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewInquiry(inquiry)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {inquiry.status === "open" && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenRespondDialog(inquiry)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Respond
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Inquiry Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {selectedInquiry?.inquiry_id}
            </DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("text-xs capitalize", getStatusBadge(selectedInquiry.status))}>
                  {selectedInquiry.status}
                </Badge>
                <Badge className={cn("text-xs capitalize", getPriorityBadge(selectedInquiry.priority))}>
                  {selectedInquiry.priority} priority
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedInquiry.category}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-lg">{selectedInquiry.subject}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <User className="w-4 h-4" />
                  {selectedInquiry.profiles?.full_name || "Unknown"} • {selectedInquiry.created_at.split("T")[0]}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-foreground">{selectedInquiry.message}</p>
              </div>

              {selectedInquiry.response && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">Response:</p>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">{selectedInquiry.response}</p>
                    {selectedInquiry.responded_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on {selectedInquiry.responded_at.split("T")[0]}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {selectedInquiry.status === "open" && (
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleOpenRespondDialog(selectedInquiry);
                  }}>
                    <Send className="w-4 h-4 mr-1" />
                    Respond
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog open={isRespondDialogOpen} onOpenChange={setIsRespondDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Inquiry</DialogTitle>
            <DialogDescription>
              {selectedInquiry?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Original message:</p>
              <p className="text-sm">{selectedInquiry?.message}</p>
            </div>
            <div className="grid gap-2">
              <Label>Your Response *</Label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRespondDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRespond} disabled={respondToInquiry.isPending}>
              {respondToInquiry.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
