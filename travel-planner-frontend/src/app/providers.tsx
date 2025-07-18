"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../../services/msal";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
