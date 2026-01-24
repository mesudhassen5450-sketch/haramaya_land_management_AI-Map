import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Inquiry {
  id: string;
  inquiry_id: string;
  user_id: string;
  property_id?: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  response?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  property_sales?: {
    title: string;
  };
}

export function useInquiries(all = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["inquiries", user?.id, all],
    queryFn: async () => {
      let query = supabase
        .from("inquiries")
        .select(`
          *,
          profiles:user_id (full_name, email),
          property_sales:property_id (title)
        `);

      if (!all && user) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Inquiry[];
    },
    enabled: !!user,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newInquiry: Partial<Inquiry>) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("inquiries")
        .insert([{
          ...newInquiry,
          user_id: user.id,
          inquiry_id: `INQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'pending',
          priority: 'medium'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit inquiry");
    },
  });
}

export function useRespondToInquiry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("inquiries")
        .update({
          response,
          responded_by: user.id,
          responded_at: new Date().toISOString(),
          status: 'responded',
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Response sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send response");
    },
  });
}
