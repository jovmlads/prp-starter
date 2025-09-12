import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Perform sign out
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }

  return NextResponse.json({ message: "Signed out successfully" });
}
