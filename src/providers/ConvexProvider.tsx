import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import {type ReactNode } from "react";

console.log("=== CONVEX ENV DEBUG ===");
console.log("CONVEX_URL:", import.meta.env.CONVEX_URL);
console.log("All env vars:", import.meta.env);
console.log("========================");

const convex = new ConvexReactClient(import.meta.env.CONVEX_URL as string);

export function ConvexProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
