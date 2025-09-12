"use client";

import { useUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function DebugAuthPage() {
  const user = useUser();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [rawUser, setRawUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      // Get session directly from Supabase
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      console.log("Direct session check:", { sessionData, sessionError });
      setSessionInfo({ sessionData, sessionError });

      // Get user directly from Supabase
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      console.log("Direct user check:", { userData, userError });
      setRawUser({ userData, userError });
    };

    checkSession();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">
            React Query Auth State (useUser):
          </h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(
              {
                isLoading: user.isLoading,
                isError: user.isError,
                data: user.data,
                error: user.error,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Direct Supabase Session:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Direct Supabase User:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(rawUser, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
