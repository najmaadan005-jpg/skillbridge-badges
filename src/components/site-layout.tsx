import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRole, useSession } from "@/hooks/use-auth";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-primary-foreground">
        <ShieldCheck className="size-5" />
      </span>
      SkillProof
    </Link>
  );
}

export function SiteHeader() {
  const { user, ready } = useSession();
  const role = useRole(user?.id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          {ready && user ? (
            <>
              {role.data === "employer" ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/employer">Candidates</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/test">Take a test</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/profile">My profile</Link>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : ready ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth" search={{ type: "employer" }}>Employers</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ type: "candidate" }}>Get started</Link>
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-lg font-bold">SkillProof</p>
          <p className="mt-2 max-w-md text-sm opacity-80">
            Practical skill tests and verified badges for people whose certificates were lost to displacement.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold">Supporting the UN Sustainable Development Goals</p>
          <p className="opacity-85">
            <span className="mr-2 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">SDG 4</span>
            Quality Education
          </p>
          <p className="opacity-85">
            <span className="mr-2 rounded bg-success px-2 py-0.5 text-xs font-bold text-success-foreground">SDG 8</span>
            Decent Work and Economic Growth
          </p>
        </div>
      </div>
      <p className="border-t border-navy-foreground/15 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} SkillProof
      </p>
    </footer>
  );
}
