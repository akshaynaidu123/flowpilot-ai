import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Sparkles, TrendingUp, ArrowRight, Filter } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { formatINR, leadFunnel, leads, LEAD_STAGES, revenueSeries, type LeadStage } from "@/lib/data";
import { scoreLead } from "@/lib/ai";

export const Route = createFileRoute("/_app/crm")({
  head: () => ({ meta: [{ title: "CRM Copilot — FlowPilot AI" }] }),
  component: CrmPage,
});

const stageColor: Record<LeadStage, string> = {
  New: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  Contacted: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Qualified: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  Proposal: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Negotiation: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Won: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Lost: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

function CrmPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => leads.filter((l) => `${l.name} ${l.company}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const funnel = leadFunnel();
  const topPriority = [...leads]
    .map((l) => ({ ...l, score: scoreLead(l).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="CRM Sales Copilot"
        description="Manage leads, run the pipeline, and let AI prioritize follow-ups."
        actions={<Badge variant="secondary"><TrendingUp className="mr-1 h-3 w-3" /> {leads.length} leads</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Lead funnel</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnel.map((_, i) => <Cell key={i} fill="var(--brand-from)" fillOpacity={0.55 + i * 0.06} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI prioritization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topPriority.map((l, i) => (
              <motion.div key={l.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-white text-xs font-bold">{l.score}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.company} · {formatINR(l.value)}</p>
                </div>
                <Button asChild size="sm" variant="ghost"><Link to="/crm/$leadId" params={{ leadId: l.id }}>Open <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter leads…" className="pl-8 h-9 w-64" />
          </div>
        </div>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => {
                    const s = scoreLead(l).score;
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.name}</TableCell>
                        <TableCell>{l.company}</TableCell>
                        <TableCell><Badge className={stageColor[l.stage]} variant="outline">{l.stage}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{l.owner}</TableCell>
                        <TableCell className="text-right">{formatINR(l.value)}</TableCell>
                        <TableCell className="text-right font-mono">{s}</TableCell>
                        <TableCell><Button asChild size="sm" variant="ghost"><Link to="/crm/$leadId" params={{ leadId: l.id }}>Open</Link></Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-3 overflow-x-auto">
            {LEAD_STAGES.map((stage) => {
              const items = filtered.filter((l) => l.stage === stage);
              return (
                <div key={stage} className="rounded-xl border bg-card p-3 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide">{stage}</span>
                    <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((l) => (
                      <Link key={l.id} to="/crm/$leadId" params={{ leadId: l.id }} className="block rounded-lg border bg-background p-3 text-xs hover:shadow-elegant transition">
                        <p className="font-medium text-sm">{l.name}</p>
                        <p className="text-muted-foreground truncate">{l.company}</p>
                        <p className="mt-1 font-mono">{formatINR(l.value)}</p>
                      </Link>
                    ))}
                    {items.length === 0 && <p className="text-xs text-muted-foreground italic">Empty</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-xs text-muted-foreground">YTD revenue trend last 12mo: {revenueSeries().slice(-3).map((r) => `${r.m} ${r.revenue}k`).join(" · ")}</div>
    </div>
  );
}