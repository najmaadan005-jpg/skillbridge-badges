import { BadgeCheck } from "lucide-react";
import { skillName } from "@/lib/skills";

type B = { skill: string; score_percent: number; full_name: string; country: string; profession: string; years_experience: number; created_at: string; id: string };

export function BadgeCard({ b }: { b: B }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-card p-5 shadow-badge">
      <div className="rounded-2xl bg-brand-gradient p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <BadgeCheck className="size-10" />
          <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">Verified</span>
        </div>
        <p className="mt-6 text-sm opacity-90">SkillProof verified skill</p>
        <p className="font-display text-2xl font-bold">{skillName(b.skill)}</p>
        <p className="mt-3 font-display text-5xl font-extrabold">{b.score_percent}%</p>
      </div>
      <div className="mt-5 space-y-1 px-1">
        <p className="text-lg font-semibold">{b.full_name || "SkillProof candidate"}</p>
        <p className="text-sm text-muted-foreground">
          {[b.profession, b.country && `from ${b.country}`, `${b.years_experience} yrs experience`].filter(Boolean).join(" · ")}
        </p>
        <p className="pt-2 text-xs text-muted-foreground">
          Issued {new Date(b.created_at).toLocaleDateString()} · ID {b.id.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}
