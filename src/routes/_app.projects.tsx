import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Sparkles, Calendar, Users2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { employees, projects, tasks, type TaskStatus } from "@/lib/data";
import { projectRisk, provider } from "@/lib/ai";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({ meta: [{ title: "Project Risk Agent — FlowPilot AI" }] }),
  component: ProjectsPage,
});

const KANBAN: TaskStatus[] = ["Todo", "In Progress", "Review", "Done"];

const riskColor: Record<string, string> = {
  Low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  High: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

function ProjectsPage() {
  const [mitigation, setMitigation] = useState("");
  const [standup, setStandup] = useState("");
  const [streaming, setStreaming] = useState(false);

  const runMitigation = async () => {
    setStreaming(true); setMitigation("");
    let acc = "";
    for await (const c of provider.stream([{ role: "user", content: "Show projects at risk and recommend mitigation" }])) {
      acc += c; setMitigation(acc);
    }
    setStreaming(false);
  };
  const runStandup = async () => {
    setStreaming(true); setStandup("");
    let acc = "";
    for await (const c of provider.stream([{ role: "user", content: "Generate weekly business summary" }])) {
      acc += c; setStandup(acc);
    }
    setStreaming(false);
  };

  const workload = employees.slice(0, 10).map((e) => ({ name: e.name.split(" ")[0], util: e.utilization }));

  return (
    <div>
      <PageHeader title="Project Risk Agent" description="Predict delays, balance workload, and generate mitigation plans on demand." />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="risk">Risk & AI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p, i) => {
              const r = projectRisk(p);
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.client}</p>
                        </div>
                        <Badge variant="outline" className={riskColor[r.level]}>{r.level}</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{p.progress}% complete</span>
                        <span>Due in {p.dueIn}d</span>
                      </div>
                      <Progress value={p.progress} className="mt-1 h-1.5" />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.milestones.map((m) => (
                          <Badge key={m.name} variant={m.done ? "default" : "secondary"} className="text-[10px]">
                            {m.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users2 className="h-3 w-3" /> {p.team.length}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.daysLate ? `${p.daysLate}d late` : "On time"}</span>
                        {p.blockers > 0 && <span className="flex items-center gap-1 text-rose-500"><AlertTriangle className="h-3 w-3" /> {p.blockers} blockers</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Team workload</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="util" radius={[6, 6, 0, 0]} fill="var(--brand-to)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {KANBAN.map((col) => {
              const items = tasks.filter((t) => t.status === col);
              return (
                <div key={col} className="rounded-xl border bg-card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide">{col}</span>
                    <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <div key={t.id} className="rounded-lg border bg-background p-3 text-xs hover:shadow-elegant transition">
                        <p className="font-medium text-sm">{t.title}</p>
                        <p className="text-muted-foreground">{t.assignee}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant={t.priority === "High" ? "destructive" : "secondary"} className="text-[10px]">{t.priority}</Badge>
                          <span className="text-[10px] text-muted-foreground">{t.dueInDays}d</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Risk & mitigation</CardTitle>
                <Button onClick={runMitigation} disabled={streaming} className="brand-gradient text-white">{streaming ? "Generating…" : "Run agent"}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={mitigation} onChange={(e) => setMitigation(e.target.value)} placeholder="Click 'Run agent' to analyze projects and recommend mitigation steps…" className="min-h-[260px] font-mono text-xs" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Daily stand-up summary</CardTitle>
                <Button onClick={runStandup} disabled={streaming} variant="outline">{streaming ? "Generating…" : "Generate"}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={standup} onChange={(e) => setStandup(e.target.value)} placeholder="Auto-summarize yesterday/today/blockers…" className="min-h-[260px] font-mono text-xs" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}