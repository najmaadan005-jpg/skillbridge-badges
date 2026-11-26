import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useRole, useSession } from "@/hooks/use-auth";
import { SKILLS, skillName } from "@/lib/skills";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/employer")({
  head: () => ({
    meta: [
      { title: "Verified candidates — SkillProof" },
      { name: "description", content: "Browse and search verified candidates by skill and score." },
      { property: "og:title", content: "Verified candidates — SkillProof" },
      { property: "og:description", content: "Browse verified candidates by skill and score." },
    ],
  }),
  component: EmployerPage,
});

type Badge = Tables<"badges">;

function EmployerPage() {
  const { user } = useSession();
  const role = useRole(user?.id);
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("all");
  const [minScore, setMinScore] = useState("70");
  const [contact, setContact] = useState<Badge | null>(null);

  const badges = useQuery({
    queryKey: ["all-badges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("*").order("score_percent", { ascending: false }).limit(500);
      if (error) throw error;
      return data;
    },
  });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (badges.data ?? []).filter(
      (b) =>
        (skill === "all" || b.skill === skill) &&
        b.score_percent >= Number(minScore) &&
        (!term || [b.full_name, b.country, b.profession].some((v) => v.toLowerCase().includes(term))),
    );
  }, [badges.data, q, skill, minScore]);

  if (role.data === "candidate")
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Employers only</h1>
        <p className="mt-2 text-muted-foreground">This dashboard is for employer accounts.</p>
        <Button asChild className="mt-4"><Link to="/profile">Go to my profile</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Verified candidates</h1>
      <p className="mt-1 text-muted-foreground">Every candidate here passed a practical test with 70% or more.</p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[1fr_200px_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, country, profession" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger aria-label="Skill"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {SKILLS.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={minScore} onValueChange={setMinScore}>
          <SelectTrigger aria-label="Minimum score"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["70", "80", "90", "100"].map((s) => <SelectItem key={s} value={s}>{s}%+ score</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{list.length} candidate{list.length === 1 ? "" : "s"}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => (
          <article key={b.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{b.full_name || "Candidate"}</h2>
                <p className="text-sm text-muted-foreground">{b.profession} · {b.country}</p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 font-display text-sm font-bold text-accent-foreground">{b.score_percent}%</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary">
              <BadgeCheck className="size-4 text-success" /> {skillName(b.skill)}
            </p>
            <p className="text-sm text-muted-foreground">{b.years_experience} years experience</p>
            <div className="mt-4 flex gap-2 pt-1">
              <Button className="flex-1" onClick={() => setContact(b)}>Contact</Button>
              <Button asChild variant="outline"><Link to="/badge/$id" params={{ id: b.id }}>Badge</Link></Button>
            </div>
          </article>
        ))}
      </div>
      {!badges.isLoading && list.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">No candidates match these filters yet.</p>
      )}

      <ContactDialog badge={contact} onClose={() => setContact(null)} employerId={user?.id} defaultEmail={user?.email ?? ""} />
    </div>
  );
}

function ContactDialog({ badge, onClose, employerId, defaultEmail }: { badge: Badge | null; onClose: () => void; employerId: string | undefined; defaultEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!badge || !employerId) return;
    setSending(true);
    const { error } = await supabase.from("contact_requests").insert({
      employer_id: employerId,
      candidate_id: badge.user_id,
      badge_id: badge.id,
      employer_name: name,
      reply_email: email,
      message: msg,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message sent to the candidate");
    setMsg("");
    onClose();
  }

  return (
    <Dialog open={!!badge} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact {badge?.full_name}</DialogTitle>
          <DialogDescription>Your message and reply email will appear in their SkillProof profile.</DialogDescription>
        </DialogHeader>
        <form onSubmit={send} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="en">Your name and company</Label>
            <Input id="en" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Lind, Nordic Care AB" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ee">Reply email</Label>
            <Input id="ee" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="em">Message</Label>
            <Textarea id="em" required rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="We'd like to invite you to an interview…" />
          </div>
          <Button type="submit" className="w-full" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
