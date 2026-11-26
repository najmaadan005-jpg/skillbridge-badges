import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, Code2, HeartPulse, Headset } from "lucide-react";
import { SKILLS } from "@/lib/skills";

export const Route = createFileRoute("/_authenticated/test/")({
  head: () => ({
    meta: [
      { title: "Choose a skill test — SkillProof" },
      { name: "description", content: "Pick a skill and answer 10 practical questions." },
      { property: "og:title", content: "Choose a skill test — SkillProof" },
      { property: "og:description", content: "Pick a skill and answer 10 practical questions." },
    ],
  }),
  component: TestPicker,
});

const icons = { "web-development": Code2, bookkeeping: Calculator, "nursing-basics": HeartPulse, "customer-service": Headset };

function TestPicker() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Choose a skill</h1>
      <p className="mt-2 text-muted-foreground">10 practical questions · about 10 minutes · 70% to earn a verified badge</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SKILLS.map((s) => {
          const Icon = icons[s.slug];
          return (
            <Link
              key={s.slug}
              to="/test/$skill"
              params={{ skill: s.slug }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold">{s.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.questions.length} questions</p>
              <p className="mt-4 text-sm font-semibold text-primary group-hover:underline">Start test →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
