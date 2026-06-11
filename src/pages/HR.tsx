import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Upload,
  Sparkles,
  ListChecks,
  GraduationCap,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
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
  candidates,
  CANDIDATE_STAGES,
  employeeDistribution,
  hiringPipeline,
} from "@/lib/data";

import { provider } from "@/lib/ai";

import { toast } from "sonner";

const COLORS = [
  "oklch(0.62 0.22 280)",
  "oklch(0.7 0.17 200)",
  "oklch(0.78 0.16 75)",
  "oklch(0.7 0.17 155)",
  "oklch(0.62 0.23 25)",
  "oklch(0.65 0.2 320)",
];

export default function HrPage() {
  const [recommendation, setRecommendation] =
    useState("");

  const [onboarding, setOnboarding] =
    useState("");

  const [streaming, setStreaming] =
    useState(false);

  const [uploaded, setUploaded] = useState<
    string[]
  >([]);

  useEffect(() => {
    document.title =
      "HR Assistant — FlowPilot AI";
  }, []);

  const handleUpload = (
    files: FileList | null
  ) => {
    if (!files) return;

    const names = Array.from(files).map(
      (file) => file.name
    );

    setUploaded((prev) => [...prev, ...names]);

    toast.success(
      `Parsed ${names.length} resume(s) — added to candidate pool`
    );
  };

  const screen = async () => {
    setStreaming(true);
    setRecommendation("");

    let output = "";

    for await (const chunk of provider.stream([
      {
        role: "user",
        content:
          "Screen these resumes for a frontend role",
      },
    ])) {
      output += chunk;
      setRecommendation(output);
    }

    setStreaming(false);
  };

  const onboard = async () => {
    setStreaming(true);
    setOnboarding("");

    let output = "";

    for await (const chunk of provider.stream([
      {
        role: "user",
        content:
          "Create onboarding checklist for new employee",
      },
    ])) {
      output += chunk;
      setOnboarding(output);
    }

    setStreaming(false);
  };

  const pipeline = hiringPipeline();

  const distribution =
    employeeDistribution();

  return (
    <div>
      <PageHeader
        title="HR Recruitment Assistant"
        description="Screen candidates, manage the hiring pipeline, and auto-generate onboarding plans."
      />

      <Tabs defaultValue="candidates">
        <TabsList>
          <TabsTrigger value="candidates">
            Candidates
          </TabsTrigger>

          <TabsTrigger value="pipeline">
            Pipeline
          </TabsTrigger>

          <TabsTrigger value="onboarding">
            Onboarding
          </TabsTrigger>

          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Candidates */}

        <TabsContent
          value="candidates"
          className="mt-4 space-y-4"
        >
          <Card className="border-dashed">
            <CardContent className="p-6">
              <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />

                <span className="text-sm font-medium">
                  Drop resumes or click to upload
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  PDF, DOCX (mock parse for demo)
                </span>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    handleUpload(
                      e.target.files
                    )
                  }
                />
              </label>

              {uploaded.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {uploaded.map((name) => (
                    <Badge
                      key={name}
                      variant="secondary"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <Button
                  onClick={screen}
                  disabled={streaming}
                  className="brand-gradient text-white"
                >
                  <Sparkles className="mr-1 h-4 w-4" />

                  {streaming
                    ? "Screening…"
                    : "Run AI screening"}
                </Button>
              </div>

              {recommendation && (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs"
                >
                  {recommendation}
                </motion.pre>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map(
              (candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                >
                  <Card className="h-full transition hover:shadow-elegant">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">
                            {candidate.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {candidate.role} ·{" "}
                            {
                              candidate.experience
                            }
                            y ·{" "}
                            {candidate.source}
                          </p>
                        </div>

                        <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white">
                          {candidate.match}%
                        </div>
                      </div>

                      <Progress
                        value={candidate.match}
                        className="mt-3 h-1.5"
                      />

                      <div className="mt-3 flex flex-wrap gap-1">
                        {candidate.skills.map(
                          (skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {skill}
                            </Badge>
                          )
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                        {candidate.summary}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {candidate.stage}
                        </Badge>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.success(
                              `Recommended ${candidate.name} for interview`
                            )
                          }
                        >
                          Recommend interview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </TabsContent>

        {/* Pipeline */}

        <TabsContent
          value="pipeline"
          className="mt-4"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {CANDIDATE_STAGES.map(
              (stage) => {
                const items =
                  candidates.filter(
                    (candidate) =>
                      candidate.stage ===
                      stage
                  );

                return (
                  <div
                    key={stage}
                    className="rounded-xl border bg-card p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {stage}
                      </span>

                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {items.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {items.map(
                        (candidate) => (
                          <div
                            key={
                              candidate.id
                            }
                            className="rounded-lg border bg-background p-2 text-xs"
                          >
                            <p className="font-medium">
                              {
                                candidate.name
                              }
                            </p>

                            <p className="text-muted-foreground">
                              {
                                candidate.role
                              }
                            </p>

                            <p className="mt-1 font-mono text-[10px]">
                              Match{" "}
                              {
                                candidate.match
                              }
                              %
                            </p>
                          </div>
                        )
                      )}

                      {items.length ===
                        0 && (
                        <p className="text-xs italic text-muted-foreground">
                          Empty
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </TabsContent>

        {/* Onboarding */}

        <TabsContent
          value="onboarding"
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="h-4 w-4" />
                  Onboarding checklist generator
                </CardTitle>

                <Button
                  onClick={onboard}
                  disabled={streaming}
                  className="brand-gradient text-white"
                >
                  <GraduationCap className="mr-1 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Textarea
                value={onboarding}
                onChange={(e) =>
                  setOnboarding(
                    e.target.value
                  )
                }
                placeholder="Click 'Generate' to build a role-specific onboarding plan…"
                className="min-h-[320px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}

        <TabsContent
          value="analytics"
          className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Hiring pipeline
              </CardTitle>
            </CardHeader>

            <CardContent className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={pipeline}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />

                  <XAxis
                    dataKey="stage"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                  />

                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    allowDecimals={false}
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
                    dataKey="count"
                    radius={[
                      6, 6, 0, 0,
                    ]}
                    fill="var(--brand-from)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Employee distribution
              </CardTitle>
            </CardHeader>

            <CardContent className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {distribution.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}