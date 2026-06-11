import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { auditLog } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/audit")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = getCurrentUser();
    if (!u || u.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Audit Logs — FlowPilot AI" }] }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div>
      <PageHeader title="Audit Logs" description="Admin-only activity trail across the workspace." actions={<Badge variant="secondary">Admin only</Badge>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.actor}</TableCell>
                  <TableCell><Badge variant="outline">{a.role}</Badge></TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell className="text-muted-foreground">{a.target}</TableCell>
                  <TableCell className="text-muted-foreground">{a.at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}