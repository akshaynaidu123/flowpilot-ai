import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

import {
  Wallet,
  Users,
  KanbanSquare,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";

import {
  activityFeed,
  formatINR,
  kpis,
  projectStatusSplit,
  revenueSeries,
} from "@/lib/data";

import { useAuth } from "@/lib/auth";

const STATUS_COLORS: Record<string, string> = {
  "On Track": "oklch(0.7 0.17 155)",
  "At Risk": "oklch(0.78 0.16 75)",
  Delayed: "oklch(0.62 0.23 25)",
  Completed: "oklch(0.62 0.22 280)",
};

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard — FlowPilot AI";
  }, []);

  const k = kpis();
  const rev = revenueSeries();
  const status = projectStatusSplit();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${
          user?.name.split(" ")[0] ?? "there"
        } 👋`}
        description="Here's the pulse across sales, hiring, projects and finance — with AI-flagged priorities."
        actions={
          <Button
            asChild
            className="brand-gradient text-white hover:opacity-90"
          >
            <Link to="/command">
              <Sparkles className="mr-1 h-4 w-4" />
              Ask FlowPilot
            </Link>
          </Button>
        }
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Revenue (YTD)"
          value={formatINR(k.revenue)}
          hint="+12% WoW"
          icon={Wallet}
          accent
          delay={0}
        />

        <StatCard
          label="Open Leads"
          value={k.openLeads}
          hint="4 in negotiation"
          icon={Users}
          delay={0.05}
        />

        <StatCard
          label="Active Projects"
          value={k.activeProjects}
          hint="2 at risk"
          icon={KanbanSquare}
          delay={0.1}
        />

        <StatCard
          label="Employees"
          value={k.employees}
          hint="Across 6 depts"
          icon={Briefcase}
          delay={0.15}
        />

        <StatCard
          label="Tasks Due Today"
          value={k.tasksDueToday}
          hint={`${k.overdueInvoices} invoices overdue`}
          icon={CheckCircle2}
          delay={0.2}
        />
      </div>

      {/* Revenue + Project Status */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Revenue trend
              </CardTitle>

              <Badge variant="secondary">
                Monthly · ₹ thousands
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={rev}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="rev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--brand-from)"
                      stopOpacity={0.6}
                    />

                    <stop
                      offset="95%"
                      stopColor="var(--brand-to)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />

                <XAxis
                  dataKey="m"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />

                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "var(--color-popover)",
                    border:
                      "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--brand-from)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Project status
            </CardTitle>
          </CardHeader>

          <CardContent className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={status}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {status.map((s) => (
                    <Cell
                      key={s.name}
                      fill={
                        STATUS_COLORS[s.name] ??
                        "var(--brand-from)"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background:
                      "var(--color-popover)",
                    border:
                      "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 -mt-4">
              {status.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background:
                        STATUS_COLORS[s.name],
                    }}
                  />

                  <span className="text-muted-foreground">
                    {s.name}
                  </span>

                  <span className="ml-auto font-medium">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Recent activity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {activityFeed().map((a, i) => (
                <motion.li
                  key={i}
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.05,
                  }}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-1 h-2 w-2 rounded-full brand-gradient" />

                  <div className="flex-1">
                    <p>
                      <span className="font-medium">
                        {a.who}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {a.what}
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {a.when} ago
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* AI Insights */}

        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI business insights
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              {
                icon: AlertTriangle,
                color: "text-amber-500",
                text:
                  "Atlas Migration slipped 6 days. Suggested: split scope, add pair, rebaseline Friday.",
              },
              {
                icon: TrendingUp,
                color: "text-emerald-500",
                text:
                  "4 leads sit in Negotiation > 10d. Drafting follow-ups likely lifts close-rate ~18%.",
              },
              {
                icon: Briefcase,
                color: "text-violet-500",
                text:
                  "Hiring backlog: 6 candidates in Interview stage. Recommend interview slots this week.",
              },
              {
                icon: Wallet,
                color: "text-rose-500",
                text:
                  "₹6.1L invoices >30d overdue. Send reminder #2 to Acme, escalate Vertex.",
              },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.06,
                }}
                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/40 transition"
              >
                <insight.icon
                  className={`h-4 w-4 mt-0.5 ${insight.color}`}
                />

                <p className="text-sm flex-1">
                  {insight.text}
                </p>

                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                >
                  <Link to="/command">
                    Ask
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Showcase Workflows */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          {
            title:
              "Lead → Score → Email",
            desc:
              "Run the CRM workflow end-to-end.",
            to: "/crm",
          },
          {
            title:
              "Resume → Screen → Interview",
            desc:
              "Try the HR recruiting workflow.",
            to: "/hr",
          },
          {
            title:
              "Project Delay → Mitigation",
            desc:
              "See the risk agent in action.",
            to: "/projects",
          },
        ].map((w, i) => (
          <motion.div
            key={w.to}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.05,
            }}
          >
            <Card className="h-full hover:shadow-elegant transition">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 brand-text" />

                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Showcase
                  </span>
                </div>

                <h3 className="font-semibold">
                  {w.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {w.desc}
                </p>

                <Button
                  asChild
                  size="sm"
                  variant="link"
                  className="px-0 mt-2"
                >
                  <Link to={w.to}>
                    Open workflow
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}