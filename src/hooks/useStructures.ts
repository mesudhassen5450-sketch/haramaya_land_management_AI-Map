import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for land structures
export type StructureType =
    | "residential_house"
    | "commercial_building"
    | "apartment"
    | "institutional"
    | "government_approved";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface LandStructure {
    id: string;
    parcel_id: string;
    structure_type: StructureType;
    structure_name: string;
    building_permit_number?: string;
    occupancy_certificate_number?: string;
    construction_year?: number;
    floor_count?: number;
    structure_images: string[];
    verification_status: VerificationStatus;
    verified_by?: string;
    verified_at?: string;
    rejection_reason?: string;
    notes?: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface SaleEligibility {
    eligible: boolean;
    reason: string;
    structure_count: number;
}

export interface ComplianceReport {
    parcel_id: string;
    owner_name: string;
    land_use: string;
    area_sqm: number;
    structure_count: number;
    verified_structures: number;
    pending_structures: number;
    sale_eligible: boolean;
    compliance_notes: string;
}

// Fetch all structures
export function useStructures() {
    return useQuery({
        queryKey: ["land_structures"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("land_structures")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as LandStructure[];
        },
    });
}

// Fetch structures by parcel ID
export function useStructuresByParcel(parcelId: string | null) {
    return useQuery({
        queryKey: ["land_structures", parcelId],
        queryFn: async () => {
            if (!parcelId) return [];

            const { data, error } = await supabase
                .from("land_structures")
                .select("*")
                .eq("parcel_id", parcelId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as LandStructure[];
        },
        enabled: !!parcelId,
    });
}

// Create new structure
export function useCreateStructure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (structure: Omit<LandStructure, "id" | "created_at" | "updated_at" | "verification_status">) => {
            const { data, error } = await supabase
                .from("land_structures")
                .insert([structure])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["land_structures"] });
            queryClient.invalidateQueries({ queryKey: ["land_parcels"] });
            toast.success("Structure registered successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to register structure");
        },
    });
}

// Update structure
export function useUpdateStructure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<LandStructure> & { id: string }) => {
            const { data, error } = await supabase
                .from("land_structures")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["land_structures"] });
            queryClient.invalidateQueries({ queryKey: ["land_parcels"] });
            toast.success("Structure updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update structure");
        },
    });
}

// Verify structure (staff only)
export function useVerifyStructure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            status,
            rejectionReason
        }: {
            id: string;
            status: "verified" | "rejected";
            rejectionReason?: string;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("land_structures")
                .update({
                    verification_status: status,
                    verified_by: user?.id,
                    verified_at: new Date().toISOString(),
                    rejection_reason: rejectionReason || null,
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["land_structures"] });
            queryClient.invalidateQueries({ queryKey: ["land_parcels"] });
            toast.success(
                variables.status === "verified"
                    ? "Structure verified successfully"
                    : "Structure rejected"
            );
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to verify structure");
        },
    });
}

// Check sale eligibility for a parcel
export function useCheckSaleEligibility(parcelId: string | null) {
    return useQuery({
        queryKey: ["sale_eligibility", parcelId],
        queryFn: async () => {
            if (!parcelId) return null;

            const { data, error } = await supabase
                .rpc("check_sale_eligibility", { p_parcel_id: parcelId });

            if (error) throw error;
            return data?.[0] as SaleEligibility;
        },
        enabled: !!parcelId,
    });
}

// Generate compliance report
export function useComplianceReport(parcelId: string | null) {
    return useQuery({
        queryKey: ["compliance_report", parcelId],
        queryFn: async () => {
            if (!parcelId) return null;

            const { data, error } = await supabase
                .rpc("generate_compliance_report", { p_parcel_id: parcelId });

            if (error) throw error;
            return data?.[0] as ComplianceReport;
        },
        enabled: !!parcelId,
    });
}

// Delete structure
export function useDeleteStructure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("land_structures")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["land_structures"] });
            queryClient.invalidateQueries({ queryKey: ["land_parcels"] });
            toast.success("Structure deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete structure");
        },
    });
}
