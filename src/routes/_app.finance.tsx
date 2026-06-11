import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, Wallet, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { formatINR, invoiceAging, invoices } from "@/lib/data";
import { provider } from "@/lib/ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({ meta: [{ title: "Finance — FlowPilot AI" }] }),
  component: FinancePage,
});

function FinancePage() {
  const [summary, setSummary] = useState("");
  const [streaming, setStreaming] = useState(false);

  const totals = {
    outstanding: invoices.filter((i) => i.status !== "Paid").reduce((s, x) => s + x.amount, 0),
    overdue: invoices.filter((i) => i.status === "Overdue").reduce((s, x) => s + x.amount, 0),
    paid: invoices.filter((i) => i.status === "Paid").reduce((s, x) => s + x.amount, 0),
  };

  const runSummary = async () => {
    setStreaming(true); setSummary("");
    let acc = "";
    for await (const c of provider.stream([{ role: "user", content: "List overdue invoices and a monthly financial snapshot" }])) {
      acc += c; setSummary(acc);
    }
    setStreaming(false);
  };

  return (
    <div>
      <PageHeader title="Finance & Operations" description="Track invoices, chase payments, and surface operational bottlenecks." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Outstanding" value={formatINR(totals.outstanding)} icon={Wallet} accent />
        <StatCard label="Overdue" value={formatINR(totals.overdue)} icon={AlertOctagon} delay={0.05} />
        <StatCard label="Collected" value={formatINR(totals.paid)} icon={CheckCircle2} delay={0.1} />
        <StatCard label="Invoices" value={invoices.length} icon={Wallet} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Invoice aging</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceAging()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="range" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => formatINR(v)} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--brand-from)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI summary</CardTitle>
              <Button size="sm" onClick={runSummary} disabled={streaming} className="brand-gradient text-white">{streaming ? "…" : "Run"}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="AI monthly snapshot + bottlenecks…" className="min-h-[180px] font-mono text-xs" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell>{i.client}</TableCell>
                  <TableCell className="text-right">{formatINR(i.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={i.status === "Paid" ? "secondary" : i.status === "Overdue" ? "destructive" : "outline"}>{i.status}</Badge>
                  </TableCell>
                  <TableCell className={i.dueInDays < 0 ? "text-rose-500" : ""}>{i.dueInDays < 0 ? `${-i.dueInDays}d overdue` : `${i.dueInDays}d`}</TableCell>
                  <TableCell>
                    {i.status !== "Paid" && (
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Reminder sent to ${i.client}`)}>
                        <Send className="mr-1 h-3 w-3" /> Remind
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}