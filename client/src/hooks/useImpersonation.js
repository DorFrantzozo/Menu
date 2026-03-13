import { useState, useCallback } from "react";
import axiosInstance from "../utils/baseUrl";
import { toast } from "react-toastify";

export function useImpersonation() {
  const [isImpersonating, setIsImpersonating] = useState(false);

  const impersonateUser = useCallback(async (userId) => {
    try {
      setIsImpersonating(true);
      
      const adminToken = localStorage.getItem("token");
      
      const response = await axiosInstance.post(
        `/admin/impersonate/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const { token: userToken, user: targetUser } = response.data;

      // Save Admin state to Session Storage
      sessionStorage.setItem("admin_recovery_token", adminToken);
      sessionStorage.setItem("admin_recovery_user", localStorage.getItem("user"));
      
      // We don't necessarily need to save categories, but let's clear them so the target user's load fresh
      const existingCats = localStorage.getItem("categories");
      if (existingCats) {
        sessionStorage.setItem("admin_recovery_categories", existingCats);
      }

      // Overwrite Local Storage with Target User Data
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(targetUser));
      localStorage.removeItem("categories"); // Force fresh fetch

      toast.success(`Impersonating ${targetUser.restaurantName || targetUser.displayName || 'User'}`);
      
      // Hard redirect to clear out Redux state and reload the app as the target user
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);

    } catch (error) {
      console.error("Failed to impersonate user:", error);
      toast.error(error.response?.data?.message || "Failed to impersonate user");
    } finally {
      setIsImpersonating(false);
    }
  }, []);

  const returnToAdmin = useCallback(() => {
    try {
      const adminToken = sessionStorage.getItem("admin_recovery_token");
      const adminUser = sessionStorage.getItem("admin_recovery_user");
      const adminCats = sessionStorage.getItem("admin_recovery_categories");

      if (!adminToken || !adminUser) {
        throw new Error("No admin recovery data found in session.");
      }

      // Restore Admin Data
      localStorage.setItem("token", adminToken);
      localStorage.setItem("user", adminUser);
      if (adminCats) {
        localStorage.setItem("categories", adminCats);
      } else {
        localStorage.removeItem("categories");
      }

      // Clear Recovery Data
      sessionStorage.removeItem("admin_recovery_token");
      sessionStorage.removeItem("admin_recovery_user");
      sessionStorage.removeItem("admin_recovery_categories");

      // Hard redirect back to Admin Dash
      window.location.href = "/admin";

    } catch (error) {
      console.error("Failed to return to admin:", error);
      toast.error("Error returning to Admin. Please log out and back in.");
    }
  }, []);

  const isCurrentlyImpersonating = !!sessionStorage.getItem("admin_recovery_token");

  return { impersonateUser, returnToAdmin, isCurrentlyImpersonating, isImpersonating };
}
