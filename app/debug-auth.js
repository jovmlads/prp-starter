// Debug Authentication Script
// Run this in the browser console to test different scenarios

async function debugAuthentication() {
  console.log("🔍 Debugging Authentication...");

  try {
    // Import Supabase client
    const { createClient } = await import("/src/utils/supabase/client.js");
    const supabase = createClient();

    // Test 1: Check Supabase project configuration
    console.log("\n1. Testing Supabase client configuration...");
    console.log(
      "Supabase URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"
    );
    console.log(
      "Supabase Key exists:",
      !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    // Test 2: Test different email formats
    console.log("\n2. Testing email validation...");

    const testEmails = [
      "admin@example.com",
      "test@gmail.com",
      "user@test.com",
      "mladen@company.io",
    ];

    for (const email of testEmails) {
      console.log(`\nTesting email: ${email}`);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: "TestPassword123!",
          options: {
            data: {
              firstName: "Test",
              lastName: "User",
              acceptTerms: true,
            },
          },
        });

        if (error) {
          console.log(`❌ Error with ${email}:`, error.message, error.code);
        } else {
          console.log(`✅ Success with ${email}`);
          // Clean up - try to delete the user (this might not work in free tier)
          if (data.user) {
            console.log("User created, attempting cleanup...");
          }
        }
      } catch (err) {
        console.log(`❌ Exception with ${email}:`, err.message);
      }
    }

    // Test 3: Check auth settings
    console.log("\n3. Checking current session...");
    const { data: session } = await supabase.auth.getSession();
    console.log("Current session:", session?.session ? "Active" : "None");
  } catch (error) {
    console.error("❌ Debug script failed:", error);
  }
}

// Auto-run
debugAuthentication();
