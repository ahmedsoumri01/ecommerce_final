"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { resetAllStores } from "@/lib/store-reset";

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Only check auth after hydration and if we have a token but no user
    if (
      authStore.isHydrated &&
      authStore.token &&
      !authStore.user &&
      !authStore.isFetching
    ) {
      authStore.checkAuth();
    }
  }, [
    authStore.isHydrated,
    authStore.token,
    authStore.user,
    authStore.isFetching,
    authStore.checkAuth,
  ]);

  return authStore;
};

export const useProtectedRoute = (
  requiredRole?: "admin" | "client",
  redirectTo = "/login"
) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isFetching, logout, isHydrated } = useAuth();

  useEffect(() => {
    // Don't redirect while hydrating or checking auth
    if (!isHydrated || isFetching) return;

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
    isHydrated,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading: isFetching || !isHydrated,
    hasRequiredRole: requiredRole ? user?.role === requiredRole : true,
  };
};
