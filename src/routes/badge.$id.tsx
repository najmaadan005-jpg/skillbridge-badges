import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCard } from "@/components/badge-card";

export const Route = createFileRoute("/badge/$id")({
  head: () => ({
    meta: [
      { title: "Verified skill badge — SkillProof" },
      { name: "description", content: "This skill was verified by a practical SkillProof test." },
      { property: "og:title", content: "Verified skill badge — SkillProof" },
      { property: "og:description", content: "This skill was verified by a practical SkillProof test." },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: BadgePage,
});

function BadgePage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["badge", id],
    queryFn: async () => {
      const { data: b } = await supabase.from("badges").select("*").eq("id", id).maybeSingle();
      return b;
    },
  });

  return (
    <div className="bg-hero-glow">
      <div className="mx-auto max-w-xl px-4 py-14 text-center">
        {isLoading ? (
          <p className="text-muted-foreground">Checking badge…</p>
        ) : data ? (
          <>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              <ShieldCheck className="size-4" /> Authentic SkillProof badge
            </p>
            <div className="mt-8">
              <BadgeCard b={data} />
            </div>
            <p className="mx-auto mt-8 max-w-md text-sm text-muted-foreground">
              Earned by passing a 10-question practical test, scored automatically by SkillProof. Employers can find this candidate in our dashboard.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/auth" search={{ type: "employer" }}>I'm an employer</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Badge not found</h1>
            <p className="mt-2 text-muted-foreground">This link is not a valid SkillProof badge.</p>
          </>
        )}
      </div>
    </div>
  );
}
