"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  if (status === "loading") {
    return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f9f9f9"
    }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "16px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ marginBottom: "10px" }}>Admin Login</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: "#fff2f0", 
            border: "1px solid #ffccc7", 
            padding: "10px", 
            borderRadius: "8px", 
            color: "#ff4d4f",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {error === "AccessDenied" 
              ? "Access Denied: You are not authorized to view the admin panel." 
              : `Authentication Error: ${error}`}
          </div>
        )}

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Please sign in with your GitHub account to access the dashboard.
        </p>
        
        <button
          onClick={() => signIn("github", { callbackUrl })}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#24292e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 4.29 9.785 9.845 11.383.6.111.795-.261.795-.577v-2.235c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 15.271-1.59 19.851-6.071 19.851-11.383 0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
