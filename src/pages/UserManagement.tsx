import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  Users,
  Shield,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  Clock,
  Loader2,
  UserCog,
  History,
  Mail,
  UserPlus,
  XCircle,
  Send,
  CheckCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  useUsers, 
  useRoleStats, 
  useAddUserRole, 
  useRemoveUserRole, 
  useBulkUpdateRoles,
  useRoleAuditLogs,
  useInvitations,
  useSendInvitation,
  useCancelInvitation,
} from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type AppRole = Database["public"]["Enums"]["app_role"];

const ALL_ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "land_officer", label: "Land Officer", description: "Land registration and parcels" },
  { value: "tax_officer", label: "Tax Officer", description: "Tax assessments and payments" },
  { value: "surveyor", label: "Surveyor", description: "Property valuations and GIS" },
  { value: "legal_officer", label: "Legal Officer", description: "Dispute resolution" },
  { value: "citizen", label: "Citizen", description: "Basic access to portal" },
];

const roleColors: Record<AppRole, string> = {
  admin: "bg-primary text-primary-foreground",
  land_officer: "bg-accent text-accent-foreground",
  tax_officer: "bg-secondary text-secondary-foreground",
  surveyor: "bg-primary/20 text-primary",
  legal_officer: "bg-warning/20 text-warning",
  citizen: "bg-muted text-muted-foreground",
};

const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  land_officer: "Land Officer",
  tax_officer: "Tax Officer",
  surveyor: "Surveyor",
  legal_officer: "Legal Officer",
  citizen: "Citizen",
};

export default function UserManagement() {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    roles: AppRole[];
  } | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkRolesToAdd, setBulkRolesToAdd] = useState<Set<AppRole>>(new Set());
  const [bulkRolesToRemove, setBulkRolesToRemove] = useState<Set<AppRole>>(new Set());
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<Set<AppRole>>(new Set(["citizen"]));

  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: roleStats } = useRoleStats();
  const { data: auditLogs } = useRoleAuditLogs();
  const { data: invitations } = useInvitations();
  
  const addRoleMutation = useAddUserRole();
  const removeRoleMutation = useRemoveUserRole();
  const bulkUpdateMutation = useBulkUpdateRoles();
  const sendInvitationMutation = useSendInvitation();
  const cancelInvitationMutation = useCancelInvitation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users?.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" || u.roles.includes(roleFilter as AppRole);
    return matchesSearch && matchesRole;
  });

  const handleRoleToggle = async (role: AppRole, checked: boolean) => {
    if (!selectedUser || !user) return;

    try {
      if (checked) {
        await addRoleMutation.mutateAsync({ userId: selectedUser.id, role, performedBy: user.id });
        setSelectedUser({
          ...selectedUser,
          roles: [...selectedUser.roles, role],
        });
        toast.success(`Added ${roleLabels[role]} role`);
      } else {
        await removeRoleMutation.mutateAsync({ userId: selectedUser.id, role, performedBy: user.id });
        setSelectedUser({
          ...selectedUser,
          roles: selectedUser.roles.filter((r) => r !== role),
        });
        toast.success(`Removed ${roleLabels[role]} role`);
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const openRoleDialog = (u: { id: string; full_name: string; roles: AppRole[] }) => {
    setSelectedUser({ id: u.id, name: u.full_name, roles: u.roles });
    setRoleDialogOpen(true);
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleBulkUpdate = async () => {
    if (!user || selectedUsers.size === 0) return;

    try {
      await bulkUpdateMutation.mutateAsync({
        userIds: Array.from(selectedUsers),
        rolesToAdd: Array.from(bulkRolesToAdd),
        rolesToRemove: Array.from(bulkRolesToRemove),
        performedBy: user.id,
      });
      toast.success(`Updated roles for ${selectedUsers.size} users`);
      setBulkDialogOpen(false);
      setSelectedUsers(new Set());
      setBulkRolesToAdd(new Set());
      setBulkRolesToRemove(new Set());
    } catch (error) {
      toast.error("Failed to update roles");
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || inviteRoles.size === 0) {
      toast.error("Please enter an email and select at least one role");
      return;
    }

    try {
      await sendInvitationMutation.mutateAsync({
        email: inviteEmail,
        roles: Array.from(inviteRoles),
        inviterName: profile?.full_name || "Admin",
      });
      toast.success("Invitation sent successfully!");
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRoles(new Set(["citizen"]));
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitationMutation.mutateAsync(invitationId);
      toast.success("Invitation cancelled");
    } catch (error) {
      toast.error("Failed to cancel invitation");
    }
  };

  const totalUsers = users?.length || 0;
  const staffUsers = users?.filter((u) => 
    u.roles.some((r) => ["admin", "land_officer", "tax_officer", "surveyor", "legal_officer"].includes(r))
  ).length || 0;
  const pendingInvites = invitations?.filter((i) => i.status === "pending").length || 0;

  return (
    <MainLayout
      title="User Management"
      subtitle="Manage system users, roles, and permissions"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          change="Registered accounts"
          changeType="neutral"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Staff Members"
          value={staffUsers}
          change="With staff roles"
          changeType="positive"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Pending Invites"
          value={pendingInvites}
          change="Awaiting response"
          changeType="neutral"
          icon={Mail}
        />
        <StatCard
          title="Admins"
          value={roleStats?.admin || 0}
          change="Full access"
          changeType="neutral"
          icon={UserCog}
        />
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            <Mail className="w-4 h-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Roles Overview */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-base">Roles Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ALL_ROLES.map((role) => (
                  <div
                    key={role.value}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{role.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {roleStats?.[role.value] || 0}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="lg:col-span-3 space-y-4">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {ALL_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUsers.size > 0 && (
                    <Button variant="outline" onClick={() => setBulkDialogOpen(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Bulk Edit ({selectedUsers.size})
                    </Button>
                  )}
                  <Button onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </div>

              {/* Users Grid */}
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers?.map((u, index) => (
                    <Card
                      key={u.id}
                      className={cn(
                        "animate-slide-up hover:shadow-card-hover transition-shadow",
                        selectedUsers.has(u.id) && "ring-2 ring-primary"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Checkbox
                                checked={selectedUsers.has(u.id)}
                                onCheckedChange={() => toggleUserSelection(u.id)}
                                className="absolute -top-1 -left-1 z-10"
                              />
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {getInitials(u.full_name)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {u.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openRoleDialog(u)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Manage Roles
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {u.roles.length > 0 ? (
                            u.roles.map((role) => (
                              <Badge
                                key={role}
                                className={cn("text-xs", roleColors[role])}
                              >
                                {roleLabels[role]}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              No roles assigned
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            Joined: {new Date(u.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRoleDialog(u)}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!usersLoading && filteredUsers?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Pending Invitations</CardTitle>
                <CardDescription>Manage user invitations</CardDescription>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                New Invitation
              </Button>
            </CardHeader>
            <CardContent>
              {invitations && invitations.length > 0 ? (
                <div className="space-y-4">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          inv.status === "pending" && "bg-warning/10",
                          inv.status === "accepted" && "bg-primary/10",
                          inv.status === "expired" && "bg-muted",
                          inv.status === "cancelled" && "bg-destructive/10"
                        )}>
                          {inv.status === "pending" && <Clock className="w-5 h-5 text-warning" />}
                          {inv.status === "accepted" && <CheckCheck className="w-5 h-5 text-primary" />}
                          {inv.status === "expired" && <Clock className="w-5 h-5 text-muted-foreground" />}
                          {inv.status === "cancelled" && <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{inv.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited by {inv.inviter_name} on {new Date(inv.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {inv.roles.map((role) => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {roleLabels[role]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs capitalize",
                            inv.status === "pending" && "badge-status-pending",
                            inv.status === "accepted" && "badge-status-active",
                            inv.status === "expired" && "bg-muted text-muted-foreground",
                            inv.status === "cancelled" && "badge-status-overdue"
                          )}
                        >
                          {inv.status}
                        </Badge>
                        {inv.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(inv.id)}
                            disabled={cancelInvitationMutation.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No invitations yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Role Change History
              </CardTitle>
              <CardDescription>Track all role assignments and removals</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs && auditLogs.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            log.action === "add" ? "bg-primary/10" : "bg-destructive/10"
                          )}>
                            {log.action === "add" ? (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{log.user_name}</span>
                              {" "}
                              {log.action === "add" ? "assigned" : "removed"}
                              {" "}
                              <Badge variant="secondary" className={cn("text-xs", roleColors[log.role])}>
                                {roleLabels[log.role]}
                              </Badge>
                              {" "}
                              {log.action === "add" ? "to" : "from"}
                              {" "}
                              <span className="font-medium">{log.target_user_name}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No audit logs yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Management Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Assign or remove roles for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {ALL_ROLES.map((role) => {
              const isChecked = selectedUser?.roles.includes(role.value) || false;
              const isLoading =
                (addRoleMutation.isPending || removeRoleMutation.isPending) &&
                ((addRoleMutation.variables?.role === role.value) ||
                  (removeRoleMutation.variables?.role === role.value));

              return (
                <div
                  key={role.value}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={role.value}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleRoleToggle(role.value, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <div>
                      <Label
                        htmlFor={role.value}
                        className="font-medium cursor-pointer"
                      >
                        {role.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to a new user with pre-assigned roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Roles</Label>
              <div className="space-y-2">
                {ALL_ROLES.map((role) => (
                  <div
                    key={role.value}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border"
                  >
                    <Checkbox
                      id={`invite-${role.value}`}
                      checked={inviteRoles.has(role.value)}
                      onCheckedChange={(checked) => {
                        const newRoles = new Set(inviteRoles);
                        if (checked) {
                          newRoles.add(role.value);
                        } else {
                          newRoles.delete(role.value);
                        }
                        setInviteRoles(newRoles);
                      }}
                    />
                    <Label
                      htmlFor={`invite-${role.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={sendInvitationMutation.isPending}
            >
              {sendInvitationMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Role Management</DialogTitle>
            <DialogDescription>
              Update roles for {selectedUsers.size} selected users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-primary">Roles to Add</Label>
              <div className="space-y-2">
                {ALL_ROLES.map((role) => (
                  <div
                    key={`add-${role.value}`}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border"
                  >
                    <Checkbox
                      id={`bulk-add-${role.value}`}
                      checked={bulkRolesToAdd.has(role.value)}
                      onCheckedChange={(checked) => {
                        const newRoles = new Set(bulkRolesToAdd);
                        if (checked) {
                          newRoles.add(role.value);
                          // Remove from remove list if exists
                          bulkRolesToRemove.delete(role.value);
                          setBulkRolesToRemove(new Set(bulkRolesToRemove));
                        } else {
                          newRoles.delete(role.value);
                        }
                        setBulkRolesToAdd(newRoles);
                      }}
                    />
                    <Label
                      htmlFor={`bulk-add-${role.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-destructive">Roles to Remove</Label>
              <div className="space-y-2">
                {ALL_ROLES.map((role) => (
                  <div
                    key={`remove-${role.value}`}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border"
                  >
                    <Checkbox
                      id={`bulk-remove-${role.value}`}
                      checked={bulkRolesToRemove.has(role.value)}
                      onCheckedChange={(checked) => {
                        const newRoles = new Set(bulkRolesToRemove);
                        if (checked) {
                          newRoles.add(role.value);
                          // Remove from add list if exists
                          bulkRolesToAdd.delete(role.value);
                          setBulkRolesToAdd(new Set(bulkRolesToAdd));
                        } else {
                          newRoles.delete(role.value);
                        }
                        setBulkRolesToRemove(newRoles);
                      }}
                    />
                    <Label
                      htmlFor={`bulk-remove-${role.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpdate}
              disabled={bulkUpdateMutation.isPending || (bulkRolesToAdd.size === 0 && bulkRolesToRemove.size === 0)}
            >
              {bulkUpdateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
