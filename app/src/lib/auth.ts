import { configureAuth } from "react-query-auth";
import { createClient } from "@/utils/supabase/client";
import type { User, AuthError } from "@/features/auth/types/auth.types";
import type {
  LoginInput,
  RegisterInput,
} from "@/utils/validation/auth-schemas";

// Initialize Supabase client
const supabase = createClient();

// Auth API functions
const getUser = async (): Promise<User | null> => {
  console.log("🔍 Getting user from Supabase...");

  try {
    // First check if we have a session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.log("❌ Session error:", sessionError.message);
      return null;
    }

    if (!sessionData.session) {
      console.log("ℹ️ No active session found");
      return null;
    }

    console.log("✅ Active session found, getting user...");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log("ℹ️ No auth session:", error.message);
      // Return null for unauthenticated users instead of throwing
      return null;
    }

    console.log("👤 User data:", {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
    });

    return user as User | null;
  } catch (error) {
    console.error("❌ Error in getUser:", error);
    return null;
  }
};

const loginWithEmailAndPassword = async (data: LoginInput) => {
  console.log("🔍 Login attempt:", {
    email: data.email,
    hasPassword: !!data.password,
  });

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error("❌ Login error:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });
    throw new Error(`Login failed: ${error.message} (Code: ${error.code})`);
  }

  console.log("✅ Login successful:", {
    userId: authData.user?.id,
    email: authData.user?.email,
    hasSession: !!authData.session,
  });

  return authData.user as User;
};

const registerWithEmailAndPassword = async (data: RegisterInput) => {
  console.log("🔍 Registration attempt:", {
    email: data.email,
    hasPassword: !!data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    acceptTerms: data.acceptTerms,
  });

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        acceptTerms: data.acceptTerms,
      },
    },
  });

  if (error) {
    console.error("❌ Registration error:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });
    throw new Error(
      `Registration failed: ${error.message} (Code: ${error.code})`
    );
  }

  console.log("✅ Registration successful:", {
    userId: authData.user?.id,
    email: authData.user?.email,
    needsConfirmation: !authData.session,
  });

  return authData.user as User;
};

const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

const resetPassword = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
  });

  if (error) {
    throw new Error(error.message);
  }
};

const updatePassword = async (password: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Configure react-query-auth
const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const user = await loginWithEmailAndPassword(data);
    return user;
  },
  registerFn: async (data: RegisterInput) => {
    const user = await registerWithEmailAndPassword(data);
    return user;
  },
  logoutFn: logout,
  queryKeyOptions: {
    all: ["authenticated-user"],
    user: ["authenticated-user"],
  },
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

// Additional auth utilities
export { resetPassword, updatePassword };

// Auth event listener for session changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as User | null);
  });
};

// Get current session
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return session;
};
