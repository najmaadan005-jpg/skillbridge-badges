import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { skillName } from "@/lib/skills";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile — SkillProof" },
      { name: "description", content: "Your SkillProof profile, badges and employer messages." },
      { property: "og:title", content: "My profile — SkillProof" },
      { property: "og:description", content: "Your SkillProof profile and verified badges." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useSession();
  const qc = useQueryClient();
  const uid = user?.id;

  const profile = useQuery({
    queryKey: ["profile", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", uid!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const badges = useQuery({
    queryKey: ["my-badges", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("*").eq("user_id", uid!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const messages = useQuery({
    queryKey: ["my-messages", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_requests").select("*").eq("candidate_id", uid!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [f, setF] = useState({ full_name: "", country: "", profession: "", years_experience: 0 });
  useEffect(() => {
    if (profile.data)
      setF({
        full_name: profile.data.full_name,
        country: profile.data.country,
        profession: profile.data.profession,
        years_experience: profile.data.years_experience,
      });
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").upsert({ id: uid!, ...f });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["profile", uid] });
    },
    onError: (e) => toast.error(e.message),
  });

  const complete = !!(profile.data?.full_name && profile.data.country && profile.data.profession);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h1 className="text-2xl font-bold">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">This appears on your verified badges.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="n">Full name</Label>
            <Input id="n" required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c">Country of origin</Label>
            <Input id="c" required placeholder="e.g. Syria" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Profession</Label>
            <Input id="p" required placeholder="e.g. Nurse" value={f.profession} onChange={(e) => setF({ ...f, profession: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="y">Years of experience</Label>
            <Input id="y" type="number" min={0} max={60} required value={f.years_experience} onChange={(e) => setF({ ...f, years_experience: Number(e.target.value) })} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</Button>
            {complete && (
              <Button asChild variant="hero">
                <Link to="/test">Take a skill test</Link>
              </Button>
            )}
          </div>
        </form>
      </section>

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold">My badges</h2>
          {badges.data?.length ? (
            <ul className="mt-4 space-y-3">
              {badges.data.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                  <span className="flex items-center gap-2 font-semibold">
                    <BadgeCheck className="size-5 text-success" /> {skillName(b.skill)} · {b.score_percent}%
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/badge/$id" params={{ id: b.id }}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No badges yet. Pass a test with 70% or more to earn one.</p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold">Messages from employers</h2>
          {messages.data?.length ? (
            <ul className="mt-4 space-y-3">
              {messages.data.map((m) => (
                <li key={m.id} className="rounded-xl border border-border p-4">
                  <p className="font-semibold">{m.employer_name}</p>
                  <p className="mt-1 whitespace-pre-line text-sm">{m.message}</p>
                  <a href={`mailto:${m.reply_email}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <Mail className="size-4" /> {m.reply_email}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">When an employer contacts you, their message will appear here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
