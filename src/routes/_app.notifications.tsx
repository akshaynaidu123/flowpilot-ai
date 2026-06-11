import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Briefcase, Mail, Wallet, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { notifications as seed, type Notification } from "@/lib/data";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — FlowPilot AI" }] }),
  component: NotificationsPage,
});

const ICONS: Record<Notification["type"], React.ComponentType<any>> = {
  risk: AlertTriangle,
  task: ListChecks,
  hiring: Briefcase,
  followup: Mail,
  finance: Wallet,
};
const COLORS: Record<Notification["type"], string> = {
  risk: "text-rose-500",
  task: "text-blue-500",
  hiring: "text-violet-500",
  followup: "text-amber-500",
  finance: "text-emerald-500",
};

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? items : items.filter((n) => n.type === filter);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Unified alerts from risk, hiring, follow-ups, finance, and tasks."
        actions={<Button variant="outline" size="sm" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>Mark all read</Button>}
      />
      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="hiring">Hiring</TabsTrigger>
          <TabsTrigger value="followup">Follow-ups</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-2">
        {visible.map((n, i) => {
          const Icon = ICONS[n.type];
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={n.read ? "" : "border-l-4 border-l-[var(--brand-from)]"}>
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${COLORS[n.type]}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{n.ago} ago</span>
                    {!n.read && <Badge variant="secondary" className="text-[10px]">new</Badge>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {visible.length === 0 && (
          <Card><CardContent className="p-12 text-center text-sm text-muted-foreground">You're all caught up.</CardContent></Card>
        )}
      </div>
    </div>
  );
}