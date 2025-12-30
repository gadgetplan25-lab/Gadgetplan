"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import LoadingAnimation from "@/components/loadingAnimation";

/**
 * Higher-Order Component untuk protect routes berdasarkan role
 * @param {Component} Component - Component yang akan di-protect
 * @param {Object} options - Options untuk protection
 * @param {string[]} options.allowedRoles - Array of allowed roles (e.g., ['admin', 'customer'])
 * @param {string} options.redirectTo - Redirect path jika unauthorized
 */
export function withRoleProtection(Component, options = {}) {
    const { allowedRoles = ['customer'], redirectTo = '/auth/login' } = options;

    return function ProtectedComponent(props) {
        const router = useRouter();
        const pathname = usePathname();
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const res = await apiFetch("/auth/me", {
                        method: "GET",
                        credentials: "include",
                        redirectOnError: false
                    });

                    if (!res.user) {
                        // Not logged in
                        router.push('/auth/login');
                        return;
                    }

                    const userRole = res.user.role;

                    // Check if user role is allowed
                    if (!allowedRoles.includes(userRole)) {
                        // Unauthorized - redirect based on role
                        if (userRole === 'admin') {
                            router.push('/dashboard');
                        } else {
                            router.push('/');
                        }
                        return;
                    }

                    // Authorized
                    setIsAuthorized(true);
                } catch (error) {
                    console.error("Auth check error:", error);
                    router.push(redirectTo);
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();
        }, [pathname]);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-screen bg-[#002B50]">
                    <LoadingAnimation />
                </div>
            );
        }

        if (!isAuthorized) {
            return null; // Will redirect
        }

        return <Component {...props} />;
    };
}

/**
 * Protect customer-only routes
 */
export function withCustomerProtection(Component) {
    return withRoleProtection(Component, {
        allowedRoles: ['customer'],
        redirectTo: '/auth/login'
    });
}

/**
 * Protect admin-only routes
 */
export function withAdminProtection(Component) {
    return withRoleProtection(Component, {
        allowedRoles: ['admin'],
        redirectTo: '/'
    });
}
