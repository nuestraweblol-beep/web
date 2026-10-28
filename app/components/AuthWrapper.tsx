"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "./ui/LoadingScreen";

export default function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    // Protected routes list - add any routes that require authentication
    const protectedRoutes = ["/dashboard", "/timeline", "/galeria", "/fechas"];

    // Public routes that should be accessible even when logged out
    // (Assuming login is public)
    const isLoginPage = pathname === "/login";

    useEffect(() => {
        // If not loading...
        if (!loading) {
            // Check if current path starts with any protected route
            const isProtected = protectedRoutes.some((route) =>
                pathname.startsWith(route)
            );

            if (isProtected && !user) {
                setIsNavigating(true);
                router.push("/login");
            } else {
                setIsNavigating(false);
            }
        }
    }, [user, loading, pathname, router]);

    // Show loading screen if:
    // 1. Auth is initialising (loading)
    // 2. We are redirecting (isNavigating) due to unauthorized access
    if (loading || isNavigating) {
        return <LoadingScreen />;
    }

    // Optional: If you want to strictly prevent rendering children for protected routes
    // until user is confirmed.
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (isProtected && !user) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
