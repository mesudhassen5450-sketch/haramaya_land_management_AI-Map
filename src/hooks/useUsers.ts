import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: AppRole[];
}

interface RoleAuditLog {
  id: string;
  user_id: string;
  target_user_id: string;
  action: string;
  role: AppRole;
  created_at: string;
  user_name?: string;
  target_user_name?: string;
}

interface Invitation {
  id: string;
  email: string;
  invited_by: string;
  roles: AppRole[];
  status: string;
  expires_at: string;
  created_at: string;
  inviter_name?: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, avatar_url, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        ...profile,
        roles: (userRoles || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role),
      }));

      return usersWithRoles;
    },
  });
}

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;
      return data.map((r) => r.role);
    },
    enabled: !!userId,
  });
}

export function useAddUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, performedBy }: { userId: string; role: AppRole; performedBy: string }) => {
      // Add the role
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from("role_audit_logs").insert({
        user_id: performedBy,
        target_user_id: userId,
        action: "add",
        role,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["role-stats"] });
      queryClient.invalidateQueries({ queryKey: ["role-audit-logs"] });
    },
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, performedBy }: { userId: string; role: AppRole; performedBy: string }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      // Log the action
      await supabase.from("role_audit_logs").insert({
        user_id: performedBy,
        target_user_id: userId,
        action: "remove",
        role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["role-stats"] });
      queryClient.invalidateQueries({ queryKey: ["role-audit-logs"] });
    },
  });
}

export function useBulkUpdateRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userIds, 
      rolesToAdd, 
      rolesToRemove, 
      performedBy 
    }: { 
      userIds: string[]; 
      rolesToAdd: AppRole[]; 
      rolesToRemove: AppRole[]; 
      performedBy: string;
    }) => {
      // Add roles
      for (const userId of userIds) {
        for (const role of rolesToAdd) {
          await supabase
            .from("user_roles")
            .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
          
          await supabase.from("role_audit_logs").insert({
            user_id: performedBy,
            target_user_id: userId,
            action: "add",
            role,
          });
        }
      }

      // Remove roles
      for (const userId of userIds) {
        for (const role of rolesToRemove) {
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", userId)
            .eq("role", role);
          
          await supabase.from("role_audit_logs").insert({
            user_id: performedBy,
            target_user_id: userId,
            action: "remove",
            role,
          });
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["role-stats"] });
      queryClient.invalidateQueries({ queryKey: ["role-audit-logs"] });
    },
  });
}

export function useRoleStats() {
  return useQuery({
    queryKey: ["role-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role");

      if (error) throw error;

      const stats: Record<AppRole, number> = {
        admin: 0,
        land_officer: 0,
        tax_officer: 0,
        surveyor: 0,
        legal_officer: 0,
        citizen: 0,
      };

      (data || []).forEach((r) => {
        stats[r.role]++;
      });

      return stats;
    },
  });
}

export function useRoleAuditLogs() {
  return useQuery({
    queryKey: ["role-audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get all unique user IDs to fetch names
      const userIds = new Set<string>();
      (data || []).forEach((log) => {
        userIds.add(log.user_id);
        userIds.add(log.target_user_id);
      });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", Array.from(userIds));

      const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);

      return (data || []).map((log) => ({
        ...log,
        user_name: profileMap.get(log.user_id) || "Unknown",
        target_user_name: profileMap.get(log.target_user_id) || "Unknown",
      })) as RoleAuditLog[];
    },
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: ["user-invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get inviter names
      const inviterIds = new Set((data || []).map((i) => i.invited_by));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", Array.from(inviterIds));

      const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);

      return (data || []).map((inv) => ({
        ...inv,
        inviter_name: profileMap.get(inv.invited_by) || "Unknown",
      })) as Invitation[];
    },
  });
}

export function useSendInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, roles, inviterName }: { email: string; roles: AppRole[]; inviterName: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to send invitations");
      }

      const response = await supabase.functions.invoke("send-invitation", {
        body: { email, roles, inviterName },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send invitation");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    },
  });
}

export function useCancelInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from("user_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    },
  });
}
