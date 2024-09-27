"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// Constant for the access code required during signup
const ACCESS_CODE = "VeriScopeHacks";

// Login function that checks if both email and password are provided
export async function login(email: string, password: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Check if both email and password are provided
  if (!email || !password) {
    return { error: "Email and password are required!" };  // Explicit error if either field is missing
  }

  // Attempt to sign in with email and password
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);  // Log the actual error
    return { error: "Invalid login credentials!" };  // Specific error message for incorrect login
  }

  // If successful login
  revalidatePath("/");
  redirect("/");  // Redirect after successful login
  return { success: "Successfully logged in!" };  // Return success message
}

// Signup function with email, password, and access code validation
export async function signup(email: string, password: string, accessCode: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Check if all three fields (email, password, and access code) are provided
  if (!email || !password || !accessCode) {
    return { error: "Email, password, and access code are required!" };  // Error if any field is missing
  }

  // Check if the access code is correct
  if (accessCode !== ACCESS_CODE) {
    return { error: "Invalid access code!" };  // Error if the access code is incorrect
  }

  // Attempt to sign up with email and password
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error.message);  // Log the error for debugging
    return { error: "Something went wrong during signup!" };  // General error during signup
  }

  // If successful signup
  revalidatePath("/");
  return { success: "Successfully signed up! Confirmation link sent to your email." };  // Return success message
}

// Logout function with error handling
export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);  // Log the error for debugging
    throw new Error("Logout failed!");
  }

  // Revalidate and redirect after logout
  revalidatePath("/");
  redirect("/");
}
