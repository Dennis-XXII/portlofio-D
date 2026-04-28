"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        backgroundColor: "transparent",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Sign Out
    </button>
  );
}
