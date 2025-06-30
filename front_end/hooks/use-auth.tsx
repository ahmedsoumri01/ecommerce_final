"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { resetAllStores } from "@/lib/store-reset";

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Check auth on mount
    if (authStore.token && !authStore.user) {
      authStore.checkAuth();
    }
  }, [authStore.token, authStore.user, authStore.checkAuth]);

  return authStore;
};

export const useProtectedRoute = (
  requiredRole?: "admin" | "client",
  redirectTo: string = "/login"
) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isFetching, logout } = useAuth();

  useEffect(() => {
    // Don't redirect while checking auth
    if (isFetching) return;

    // Not authenticated
    if (!isAuthenticated || !user) {
      // Clear any invalid auth state
      logout();
      resetAllStores();

      // Extract locale from pathname if it exists
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : "en";

      router.replace(`/${locale}${redirectTo}`);
      return;
    }

    // Check account status
    if (user.accountStatus === "blocked") {
      logout();
      resetAllStores();

      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : "en";

      router.replace(`/${locale}/login?error=account-blocked`);
      return;
    }

    // Check role authorization
    if (requiredRole && user.role !== requiredRole) {
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : "en";

      // Redirect to appropriate dashboard based on user role
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";
      router.replace(`/${locale}${dashboardPath}`);
      return;
    }
  }, [
    isAuthenticated,
    user,
    isFetching,
    requiredRole,
    router,
    pathname,
    logout,
    redirectTo,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading: isFetching,
    hasRequiredRole: requiredRole ? user?.role === requiredRole : true,
  };
};
