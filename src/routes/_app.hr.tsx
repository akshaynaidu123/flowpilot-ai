import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Upload, Sparkles, ListChecks, GraduationCap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { candidates, CANDIDATE_STAGES, employeeDistribution, hiringPipeline } from "@/lib/data";
import { provider } from "@/lib/ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/hr")({
  head: () => ({ meta: [{ title: "HR Assistant — FlowPilot AI" }] }),
  component: HrPage,
});

const COLORS = ["oklch(0.62 0.22 280)", "oklch(0.7 0.17 200)", "oklch(0.78 0.16 75)", "oklch(0.7 0.17 155)", "oklch(0.62 0.23 25)", "oklch(0.65 0.2 320)"];

function HrPage() {
  const [recommendation, setRecommendation] = useState("");
  const [onboarding, setOnboarding] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setUploaded((u) => [...u, ...names]);
    toast.success(`Parsed ${names.length} resume(s) — added to candidate pool`);
  };

  const screen = async () => {
    setStreaming(true); setRecommendation("");
    let acc = "";
    for await (const c of provider.stream([{ role: "user", content: "Screen these resumes for a frontend role" }])) {
      acc += c; setRecommendation(acc);
    }
    setStreaming(false);
  };

  const onboard = async () => {
    setStreaming(true); setOnboarding("");
    let acc = "";
    for await (const c of provider.stream([{ role: "user", content: "Create onboarding checklist for new employee" }])) {
      acc += c; setOnboarding(acc);
    }
    setStreaming(false);
  };

  const pipeline = hiringPipeline();
  const dist = employeeDistribution();

  return (
    <div>
      <PageHeader title="HR Recruitment Assistant" description="Screen candidates, manage the hiring pipeline, and auto-generate onboarding plans." />

      <Tabs defaultValue="candidates">
        <TabsList>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="mt-4 space-y-4">
          <Card className="border-dashed">
            <CardContent className="p-6">
              <label className="flex flex-col items-center justify-center cursor-pointer text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Drop resumes or click to upload</span>
                <span className="text-xs text-muted-foreground mt-1">PDF, DOCX (mock parse for demo)</span>
                <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
              </label>
              {uploaded.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {uploaded.map((n) => <Badge key={n} variant="secondary">{n}</Badge>)}
                </div>
              )}
              <div className="text-center mt-4">
                <Button onClick={screen} disabled={streaming} className="brand-gradient text-white">
                  <Sparkles className="mr-1 h-4 w-4" /> {streaming ? "Screening…" : "Run AI screening"}
                </Button>
              </div>
              {recommendation && (
                <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs">
                  {recommendation}
                </motion.pre>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {candidates.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="h-full hover:shadow-elegant transition">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role} · {c.experience}y · {c.source}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg brand-gradient text-white text-xs font-bold">{c.match}%</div>
                    </div>
                    <Progress value={c.match} className="mt-3 h-1.5" />
                    <div className="mt-3 flex flex-wrap gap-1">
                      {c.skills.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{c.summary}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">{c.stage}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Recommended ${c.name} for interview`)}>Recommend interview</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {CANDIDATE_STAGES.map((stage) => {
              const items = candidates.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="rounded-xl border bg-card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide">{stage}</span>
                    <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((c) => (
                      <div key={c.id} className="rounded-lg border bg-background p-2 text-xs">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-muted-foreground">{c.role}</p>
                        <p className="mt-1 font-mono text-[10px]">Match {c.match}%</p>
                      </div>
                    ))}
                    {items.length === 0 && <p className="text-xs text-muted-foreground italic">Empty</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4" /> Onboarding checklist generator</CardTitle>
                <Button onClick={onboard} disabled={streaming} className="brand-gradient text-white">
                  <GraduationCap className="mr-1 h-4 w-4" /> Generate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={onboarding} onChange={(e) => setOnboarding(e.target.value)} placeholder="Click 'Generate' to build a role-specific onboarding plan…" className="min-h-[320px] font-mono text-sm" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Hiring pipeline</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--brand-from)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Employee distribution</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" outerRadius={100} label>
                    {dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}