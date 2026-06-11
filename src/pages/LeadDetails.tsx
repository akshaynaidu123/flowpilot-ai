import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Sparkles,
  Wand2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";

import { PageHeader } from "@/components/common/PageHeader";

import {
  formatINR,
  leads,
} from "@/lib/data";

import {
  generate,
  provider,
  scoreLead,
} from "@/lib/ai";

import { toast } from "sonner";

export default function LeadDetail() {
  const { leadId } = useParams();

  const lead = leads.find(
    (l) => l.id === leadId
  );

  const [draft, setDraft] =
    useState("");

  const [streaming, setStreaming] =
    useState(false);

  const [scored, setScored] =
    useState<{
      score: number;
      reasons: string[];
    } | null>(null);

  useEffect(() => {
    document.title =
      "Lead — FlowPilot AI";

    if (lead) {
      setScored(scoreLead(lead));
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="p-8">
        Lead not found.

        <Link
          to="/crm"
          className="ml-2 underline"
        >
          Back
        </Link>
      </div>
    );
  }

  const draftEmail = async () => {
    setStreaming(true);
    setDraft("");

    let output = "";

    for await (const chunk of provider.stream([
      {
        role: "user",
        content: `Draft a follow-up email for lead ${lead.name} at ${lead.company}`,
      },
    ])) {
      output += chunk;

      setDraft(
        output.replace(
          "{{name}}",
          lead.name.split(" ")[0]
        )
      );
    }

    setStreaming(false);

    toast.success(
      "Draft ready — review before sending"
    );
  };

  const rescore = async () => {
    toast("Scoring…");

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    setScored(scoreLead(lead));

    toast.success("Score updated");
  };

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-2"
      >
        <Link to="/crm">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to leads
        </Link>
      </Button>

      <PageHeader
        title={lead.name}
        description={`${lead.company} · ${lead.source} · Owner: ${lead.owner}`}
        actions={
          <Badge variant="outline">
            {lead.stage}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              Contact
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />

              {lead.email}
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />

              {lead.phone}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">
                  Deal value
                </p>

                <p className="font-semibold">
                  {formatINR(lead.value)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Last contact
                </p>

                <p className="font-semibold">
                  {lead.lastContactDays}d ago
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-1">
                Notes
              </p>

              <p>{lead.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />

                AI lead score
              </CardTitle>

              <Button
                size="sm"
                variant="outline"
                onClick={rescore}
              >
                Re-score
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {scored && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold brand-text">
                    {scored.score}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    / 100
                  </span>
                </div>

                <Progress
                  value={scored.score}
                />

                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  {scored.reasons.map(
                    (reason) => (
                      <li key={reason}>
                        {reason}
                      </li>
                    )
                  )}
                </ul>

                <div className="rounded-lg border p-3 bg-muted/40 text-sm">
                  <strong>
                    AI recommendation:
                  </strong>{" "}
                  {scored.score > 70
                    ? "Move to Negotiation; schedule decision-maker call within 48h."
                    : scored.score > 40
                    ? "Send a personalized follow-up with a case study from same vertical."
                    : "Nurture with monthly newsletter; revisit in 30 days."}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="h-4 w-4" />

                Follow-up email drafter
              </CardTitle>

              <Button
                onClick={draftEmail}
                disabled={streaming}
                className="brand-gradient text-white"
              >
                {streaming
                  ? "Drafting…"
                  : "Generate draft"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Textarea
              value={draft}
              onChange={(e) =>
                setDraft(
                  e.target.value
                )
              }
              placeholder="Click 'Generate draft' to compose an AI follow-up email…"
              className="min-h-[260px] font-mono text-sm"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              AI-generated draft.
              Review and personalize
              before sending.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* tree-shake guard */
void generate;