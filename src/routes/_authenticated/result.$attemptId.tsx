import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCard } from "@/components/badge-card";
import { PASS_PERCENT, skillName } from "@/lib/skills";

export const Route = createFileRoute("/_authenticated/result/$attemptId")({
  head: () => ({
    meta: [
      { title: "Your result — SkillProof" },
      { name: "description", content: "Your skill test score and verified badge." },
      { property: "og:title", content: "Your result — SkillProof" },
      { property: "og:description", content: "Your skill test score and verified badge." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { attemptId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: async () => {
      const { data: a, error } = await supabase.from("test_attempts").select("*").eq("id", attemptId).single();
      if (error) throw error;
      const badge = a.badge_id ? (await supabase.from("badges").select("*").eq("id", a.badge_id).single()).data : null;
      return { a, badge };
    },
  });

  if (isLoading || !data) return <p className="py-20 text-center text-muted-foreground">Loading your result…</p>;
  const pct = Math.round((data.a.score / data.a.total) * 100);
  const passed = pct >= PASS_PERCENT;
  const link = data.badge ? `${window.location.origin}/badge/${data.badge.id}` : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <p className="text-sm font-semibold text-primary">{skillName(data.a.skill)}</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{passed ? "Congratulations — you passed!" : "Not quite there yet"}</h1>
      <p className="mt-3 text-muted-foreground">
        You answered {data.a.score} of {data.a.total} correctly.
      </p>
      <p className={`mt-4 font-display text-6xl font-extrabold ${passed ? "text-success" : "text-primary"}`}>{pct}%</p>

      {passed && data.badge ? (
        <div className="mt-10 space-y-6">
          <BadgeCard b={data.badge} />
          <div className="mx-auto flex max-w-md flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
            <code className="flex-1 truncate text-left text-sm">{link}</code>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Link copied");
              }}
            >
              <Copy /> Copy link
            </Button>
          </div>
          <Button asChild variant="outline">
            <Link to="/badge/$id" params={{ id: data.badge.id }}>Open public badge page</Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary p-6">
          <p>You need {PASS_PERCENT}% to earn a verified badge. Review the topic and try again — you can retake any time.</p>
          <Button asChild className="mt-4">
            <Link to="/test/$skill" params={{ skill: data.a.skill }}>
              <RotateCcw /> Try again
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
