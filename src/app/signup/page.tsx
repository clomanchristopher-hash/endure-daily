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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match. Please re-enter them.");

    setLoading(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.error) return setError(result.error);
    if (result.needsConfirmation) {
      return setSuccess(
        "Almost there! Check your email to confirm your account, then log in."
      );
    }
    router.push("/");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start growing in faith and fitness today."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gold-soft hover:text-gold">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <FormMessage tone="error">{error}</FormMessage>}
        {success && <FormMessage tone="success">{success}</FormMessage>}

        <FormField
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Chris"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormField
          id="confirm"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
