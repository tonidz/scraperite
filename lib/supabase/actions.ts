"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Helper function to validate email
function isValidEmail(email: string) {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

// Helper function to get base URL
function getURL(path: string) {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseURL}${path}`;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  const callbackURL = getURL('/auth/callback');

  // Validate email
  if (!isValidEmail(email)) {
    return { error: "Invalid email address. Please try again." };
  }

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackURL
      }
    });

    if (error) {
      console.error("Auth error:", error);
      return { error: error.message };
    }

    // Check for existing account
    if (data.user?.identities?.length === 0) {
      return { 
        error: "There is already an account associated with this email address. Try resetting your password." 
      };
    }

    // If user is created successfully
    if (data.user) {
      try {
        // Create reseller profile with all the form data
        const { error: profileError } = await supabase
          .from("reseller_profiles")
          .insert({
            user_id: data.user.id,
            company_name: formData.get("companyName") as string,
            contact_name: formData.get("contactName") as string,
            phone_number: formData.get("phoneNumber") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            country: formData.get("country") as string,
            vat_number: formData.get("vatNumber") as string,
            business_type: formData.get("businessType") as string,
            status: 'pending'
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          return { error: "Failed to create reseller profile" };
        }

        // Check if email confirmation is required
        if (!data.user.confirmed_at) {
          return { 
            redirect: "/welcome",
            message: "Please check your email for a confirmation link." 
          };
        }

        // If no email confirmation required, user is signed in automatically
        if (data.session) {
          revalidatePath("/", "layout");
          return { 
            success: true, 
            redirect: "/welcome",
            message: "Registration successful! Welcome to our platform." 
          };
        }
      } catch (error: any) {
        console.error("Profile creation error:", error);
        return { error: "Failed to create reseller profile" };
      }
    }

    return { error: "Sign up failed. Please try again." };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();

  if (!isValidEmail(email)) {
    return { error: "Invalid email address" };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Authentication failed" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getAuthUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email')).trim();

  // Validate email
  if (!isValidEmail(email)) {
    return { error: "Invalid email address" };
  }

  try {
    // Get the language from the form data or default to 'en'
    const lang = formData.get('lang') || 'en';
    const redirectUrl = getURL(`/${lang}/update-password`);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
      return { error: error.message };
    }

    // Always return success to prevent email enumeration
    return { success: true };
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    return { error: "Failed to send password reset email" };
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = String(formData.get('password')).trim();

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Update password error:", error);
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update password error:", error);
    return { error: "Failed to update password" };
  }
}
