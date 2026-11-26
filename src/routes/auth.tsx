import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Search = { type: "candidate" | "employer" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: s["type"] === "employer" ? "employer" : "candidate",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — SkillProof" },
      { name: "description", content: "Create your SkillProof account or sign in as a candidate or employer." },
      { property: "og:title", content: "Sign in — SkillProof" },
      { property: "og:description", content: "Create your SkillProof account or sign in." },
    ],
  }),
  component: AuthPage,
});

async function goHome(navigate: ReturnType<typeof useNavigate>) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  const employer = data?.some((r) => r.role === "employer");
  navigate({ to: employer ? "/employer" : "/profile" });
}

function AuthPage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">(type === "employer" ? "signin" : "signup");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const isEmployer = type === "employer";

  useEffect(() => {
    goHome(navigate);
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: {
            emailRedirectTo: window.location.origin + "/auth?type=" + type,
            data: { full_name: f.name, account_type: type },
          },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        await goHome(navigate);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (r.redirected) return;
    await goHome(navigate);
  }

  return (
    <div className="bg-hero-glow">
      <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:py-20">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          {(["candidate", "employer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => navigate({ to: "/auth", search: { type: t } })}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
                type === t ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
              }`}
            >
              {t === "candidate" ? <UserRound className="size-4" /> : <Briefcase className="size-4" />}
              {t === "candidate" ? "I'm a candidate" : "I'm an employer"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          {sent ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="mt-2 text-muted-foreground">
                We sent a confirmation link to <strong>{f.email}</strong>. Open it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">
                {mode === "signup" ? (isEmployer ? "Create employer account" : "Create your account") : isEmployer ? "Employer login" : "Welcome back"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEmployer ? "Find verified, skilled candidates." : "Prove your skills in minutes."}
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{isEmployer ? "Your name" : "Full name"}</Label>
                    <Input id="name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>
              {!isEmployer && (
                <>
                  <div className="my-4 text-center text-xs text-muted-foreground">or</div>
                  <Button type="button" variant="outline" size="lg" className="w-full bg-card" onClick={google}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                    Continue with Google
                  </Button>
                </>
              )}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New to SkillProof?"}{" "}
                <button className="font-semibold text-primary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
                  {mode === "signup" ? "Sign in" : "Create an account"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
