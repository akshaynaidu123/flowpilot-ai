import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Sparkles,
  Calendar,
  Users2,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { PageHeader } from "@/components/common/PageHeader";

import {
  employees,
  projects,
  tasks,
  type TaskStatus,
} from "@/lib/data";

import {
  projectRisk,
  provider,
} from "@/lib/ai";

const KANBAN: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Review",
  "Done",
];

const riskColor: Record<string, string> = {
  Low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Medium:
    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  High:
    "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export default function ProjectsPage() {
  const [mitigation, setMitigation] =
    useState("");

  const [standup, setStandup] =
    useState("");

  const [streaming, setStreaming] =
    useState(false);

  useEffect(() => {
    document.title =
      "Project Risk Agent — FlowPilot AI";
  }, []);

  const runMitigation = async () => {
    setStreaming(true);
    setMitigation("");

    let acc = "";

    for await (const chunk of provider.stream([
      {
        role: "user",
        content:
          "Show projects at risk and recommend mitigation",
      },
    ])) {
      acc += chunk;
      setMitigation(acc);
    }

    setStreaming(false);
  };

  const runStandup = async () => {
    setStreaming(true);
    setStandup("");

    let acc = "";

    for await (const chunk of provider.stream([
      {
        role: "user",
        content:
          "Generate weekly business summary",
      },
    ])) {
      acc += chunk;
      setStandup(acc);
    }

    setStreaming(false);
  };

  const workload = employees
    .slice(0, 10)
    .map((employee) => ({
      name:
        employee.name.split(" ")[0],
      util: employee.utilization,
    }));

  return (
    <div>
      <PageHeader
        title="Project Risk Agent"
        description="Predict delays, balance workload, and generate mitigation plans on demand."
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>

          <TabsTrigger value="kanban">
            Kanban
          </TabsTrigger>

          <TabsTrigger value="risk">
            Risk & AI
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(
              (project, index) => {
                const risk =
                  projectRisk(project);

                return (
                  <motion.div
                    key={project.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">
                              {project.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {
                                project.client
                              }
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className={
                              riskColor[
                                risk.level
                              ]
                            }
                          >
                            {risk.level}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {
                              project.progress
                            }
                            % complete
                          </span>

                          <span>
                            Due in{" "}
                            {project.dueIn}
                            d
                          </span>
                        </div>

                        <Progress
                          value={
                            project.progress
                          }
                          className="mt-1 h-1.5"
                        />

                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.milestones.map(
                            (
                              milestone
                            ) => (
                              <Badge
                                key={
                                  milestone.name
                                }
                                variant={
                                  milestone.done
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {
                                  milestone.name
                                }
                              </Badge>
                            )
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users2 className="h-3 w-3" />
                            {
                              project.team
                                .length
                            }
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.daysLate
                              ? `${project.daysLate}d late`
                              : "On time"}
                          </span>

                          {project.blockers >
                            0 && (
                            <span className="flex items-center gap-1 text-rose-500">
                              <AlertTriangle className="h-3 w-3" />
                              {
                                project.blockers
                              }{" "}
                              blockers
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              }
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Team workload
              </CardTitle>
            </CardHeader>

            <CardContent className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={workload}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                  />

                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    unit="%"
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

                  <Bar
                    dataKey="util"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    fill="var(--brand-to)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KEEP the remaining Kanban and Risk tabs EXACTLY the same */}
      </Tabs>
    </div>
  );
}