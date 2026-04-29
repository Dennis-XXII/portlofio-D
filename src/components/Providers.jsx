"use client";

import { SessionProvider } from "next-auth/react";
import { PortfolioProvider } from "./PortfolioContext";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <PortfolioProvider>
        {children}
      </PortfolioProvider>
    </SessionProvider>
  );
}
