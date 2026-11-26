import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Briefcase, ClipboardCheck, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillProof — Prove your skills without certificates" },
      { name: "description", content: "Skilled refugees are ignored because their certificates are missing. Take a practical test, earn a verified badge, get hired." },
      { property: "og:title", content: "SkillProof — Prove your skills without certificates" },
      { property: "og:description", content: "Practical skill tests and verified badges employers can trust." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: ClipboardCheck, title: "Take a practical test", text: "10 real-world questions in your field. No paperwork needed." },
  { icon: BadgeCheck, title: "Earn a verified badge", text: "Score 70% or more and get a badge with a public link." },
  { icon: Share2, title: "Share it with employers", text: "Send your link or get discovered in our candidate search." },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-glow">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <ShieldCheck className="size-3.5" /> Skills over paperwork
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Skilled refugees are ignored because their{" "}
              <span className="text-brand-gradient">certificates are missing.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              SkillProof lets you show what you can do. Pass a practical test, earn a verified badge, and let employers see your real ability.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth" search={{ type: "candidate" }}>Get started — it's free</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/auth" search={{ type: "employer" }}>
                  <Briefcase /> Employer login
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rotate-1 rounded-3xl bg-card p-6 shadow-badge">
            <div className="rounded-2xl bg-brand-gradient p-6 text-primary-foreground">
              <BadgeCheck className="size-10" />
              <p className="mt-6 text-sm opacity-90">Verified skill</p>
              <p className="font-display text-2xl font-bold">Bookkeeping</p>
              <p className="mt-4 font-display text-5xl font-extrabold">90%</p>
            </div>
            <div className="mt-5 space-y-1">
              <p className="font-semibold">Amina Y.</p>
              <p className="text-sm text-muted-foreground">Accountant · from Sudan · 8 years</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <s.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
