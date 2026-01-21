import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { type ReactNode, useEffect, useState } from "react";

async function getConvexUrl(): Promise<string> {
  // Try environment variable first (for local development)
  const envUrl = import.meta.env.VITE_CONVEX_URL || import.meta.env.CONVEX_URL;
  if (envUrl) {
    console.log("Using Convex URL from env:", envUrl);
    return envUrl;
  }

  // Fetch from API for production
  console.log("Fetching Convex URL from API...");
  const response = await fetch("/api/config");
  const config = await response.json() as {convexUrl?: string};
  console.log("API config:", config);
  
  if (!config.convexUrl) {
    throw new Error("convexUrl is not found in API config");
  }
  
  return config.convexUrl;
}

export function ConvexProvider({ children }: { children: ReactNode }) {
  const [convexClient, setConvexClient] = useState<ConvexReactClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConvexUrl()
      .then((url) => {
        console.log("Initializing Convex client with URL:", url);
        const client = new ConvexReactClient(url);
        setConvexClient(client);
      })
      .catch((err) => {
        console.error("Failed to get Convex URL:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error loading Convex: {error}</div>;
  }

  if (!convexClient) {
    return <div>Loading...</div>;
  }

  return <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>;
}
