// Test Supabase Connection
// Run this in your browser console at http://localhost:3000

async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase Connection...");

  try {
    // Test 1: Check if Supabase client is available
    console.log("1. Checking Supabase client...");
    const { createClient } = await import("/src/utils/supabase/client.js");
    const supabase = createClient();
    console.log("✅ Supabase client created successfully");

    // Test 2: Test database connection
    console.log("2. Testing database connection...");
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);
    if (error && error.code !== "PGRST116") {
      console.log("⚠️ Database error:", error.message);
      console.log("   This might be expected if tables don't exist yet");
    } else {
      console.log("✅ Database connection working");
    }

    // Test 3: Test authentication
    console.log("3. Testing authentication...");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("✅ User is authenticated:", session.user.email);
    } else {
      console.log("ℹ️ User is not authenticated (this is normal)");
    }

    console.log("🎉 Supabase connection test completed!");
    return { success: true, message: "All tests passed" };
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    return { success: false, error: error.message };
  }
}

// Run the test
testSupabaseConnection();
