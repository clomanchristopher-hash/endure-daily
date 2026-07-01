"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match. Please re-enter them.");

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) return setError(result.error);
    setDone(true);
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/login" className="font-semibold text-gold-soft hover:text-gold">
          Back to login
        </Link>
      }
    >
      {done ? (
        <FormMessage tone="success">
          Password updated. Taking you to Endure Daily...
        </FormMessage>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <FormField
            id="password"
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormField
            id="confirm"
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
