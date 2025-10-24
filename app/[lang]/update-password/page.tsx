"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/lib/supabase/actions";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validators } from "@/lib/utils/validation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingSession, setValidatingSession] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link",
          variant: "destructive",
        });
        router.push(`/${lang}/reset-password`);
        return;
      }

      setValidatingSession(false);
    };

    checkSession();
  }, [router, lang, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password
      const passwordValidation = validators.password(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      // Check passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const formData = new FormData();
      formData.append("password", password);

      const result = await updatePassword(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });

      // Redirect to login after successful password update
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 1500);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingSession) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Set new password</h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, and a number
            </p>
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>

        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-500">
            Password requirements:
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase letter (A-Z)</li>
            <li>• Contains lowercase letter (a-z)</li>
            <li>• Contains number (0-9)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
