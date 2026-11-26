import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { SKILLS } from "@/lib/skills";

export const Route = createFileRoute("/_authenticated/test/$skill")({
  loader: ({ params }) => {
    const skill = SKILLS.find((s) => s.slug === params.skill);
    if (!skill) throw notFound();
    return { skill };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.skill.name ?? "Skill"} test — SkillProof` },
      { name: "description", content: "Answer 10 practical multiple-choice questions." },
      { property: "og:title", content: `${loaderData?.skill.name ?? "Skill"} test — SkillProof` },
      { property: "og:description", content: "Answer 10 practical multiple-choice questions." },
    ],
  }),
  component: TestPage,
});

function TestPage() {
  const { skill } = Route.useLoaderData();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => skill.questions.map(() => null));
  const [submitting, setSubmitting] = useState(false);
  const q = skill.questions[i]!;
  const total = skill.questions.length;
  const answered = answers.filter((a) => a !== null).length;
  const last = i === total - 1;

  async function submit() {
    setSubmitting(true);
    const { data, error } = await supabase.rpc("submit_skill_test", { _skill: skill.slug, _answers: answers as number[] });
    setSubmitting(false);
    if (error || !data) {
      toast.error(error?.message ?? "Could not submit");
      return;
    }
    navigate({ to: "/result/$attemptId", params: { attemptId: data } });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-primary">{skill.name}</span>
        <span className="text-muted-foreground">Question {i + 1} of {total}</span>
      </div>
      <Progress value={(answered / total) * 100} className="mt-3 h-2.5" />

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
        <h1 className="text-xl font-bold leading-snug sm:text-2xl">{q.q}</h1>
        <div className="mt-6 space-y-3" role="radiogroup">
          {q.options.map((opt, idx) => {
            const selected = answers[i] === idx;
            return (
              <button
                key={idx}
                role="radio"
                aria-checked={selected}
                onClick={() => setAnswers((a) => a.map((v, k) => (k === i ? idx : v)))}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  selected ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                }`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${selected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="outline" size="lg" disabled={i === 0} onClick={() => setI(i - 1)}>Back</Button>
        {last ? (
          <Button variant="hero" size="lg" disabled={answered < total || submitting} onClick={submit}>
            {submitting ? "Scoring…" : answered < total ? `Answer all (${answered}/${total})` : "Submit test"}
          </Button>
        ) : (
          <Button size="lg" disabled={answers[i] === null} onClick={() => setI(i + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}
