"use client";

import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const AdminLogoutButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogout = async () => {
    setIsSubmitting(true);

    try {
      await axios.post(
        "/api/administrators/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Administrator logout failed:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  return (
    <Button disabled={isSubmitting} onClick={onLogout} variant="outline">
      {isSubmitting ? "Signing out..." : "Sign out"}
    </Button>
  );
};
