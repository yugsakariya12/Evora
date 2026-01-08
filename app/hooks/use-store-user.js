"use client";

import { useEffect, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function useStoreUser() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();

  const upsertUser = useMutation(api.users.upsertUser);

  const [hasStoredUser, setHasStoredUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ ADD THIS

  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !user || hasStoredUser) {
      return;
    }

    const storeUser = async () => {
      setIsLoading(true); // ✅ START LOADING
      try {
        await new Promise((r) => setTimeout(r, 500));
        await upsertUser(); // NO ARGS (correct)
        setHasStoredUser(true);
      } catch (error) {
        console.error("Failed to store user:", error);
      } finally {
        setIsLoading(false); // ✅ STOP LOADING
      }
    };

    storeUser();
  }, [isLoaded, isAuthenticated, user, upsertUser, hasStoredUser]);

  return { hasStoredUser, isLoading }; // ✅ RETURN IT
}
