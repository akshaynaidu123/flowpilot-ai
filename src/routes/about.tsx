import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Database, ShieldCheck, Workflow, Sparkles, Brain, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Agent — FlowPilot AI" },
      { name: "description", content: "How FlowPilot AI is architected: tools, AI layer, security, and human-review limitations." },
      { property: "og:title", content: "About FlowPilot AI" },
      { property: "og:description", content: "Agent logic, tools, AI architecture, and safety considerations." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 brand-gradient opacity-15 blur-3xl" />
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/dashboard"><ArrowLeft className="mr-1 h-3 w-3" /> Back to app</Link></Button>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-semibold tracking-tight">
          About <span className="brand-text">FlowPilot AI</span>
        </motion.h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">An AI-powered business automation agent unifying CRM, HR, project management, and finance. Built for the AI Model Development Contest 2026.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["React 19", "TypeScript", "TanStack Start", "Tailwind v4", "shadcn/ui", "Framer Motion", "Recharts"].map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> Agent logic</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>FlowPilot routes natural-language commands to specialized sub-agents (Sales, HR, Project, Finance). Each sub-agent retrieves the relevant slice of business state, applies a deterministic scoring or ranking model, then composes a reasoned response.</p>
              <p>Outputs include a transparent <em>reasoning trace</em> so users can audit how a recommendation was produced.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Workflow className="h-4 w-4" /> Tools used</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1.5">
              <p>• <strong>Lead scorer</strong> — stage × recency × value model</p>
              <p>• <strong>Email drafter</strong> — personalized follow-up generator</p>
              <p>• <strong>Resume screener</strong> — skill-overlap match scoring</p>
              <p>• <strong>Risk predictor</strong> — slip × blockers × workload model</p>
              <p>• <strong>Mitigation planner</strong> — generates prioritized action lists</p>
              <p>• <strong>Finance summarizer</strong> — aging + anomaly highlighter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bot className="h-4 w-4" /> AI architecture</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>A swappable <code>AIProvider</code> interface abstracts the model. The demo ships a deterministic Mock provider with simulated streaming. Stubs exist for OpenAI, Gemini, Groq, Qwen, and DeepSeek — drop in an API key and re-export from <code>src/lib/ai.ts</code>.</p>
              <pre className="bg-muted/40 rounded p-2 text-xs">UI → AIProvider.stream() → tokens → reasoning + answer</pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Security considerations</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1.5">
              <p>• Role-based access control (Admin / HR / Sales / PM / Employee)</p>
              <p>• Route-level guards on sensitive modules (Audit Logs is admin-only)</p>
              <p>• Audit trail for sensitive actions</p>
              <p>• AI outputs are drafts — never auto-sent to customers or candidates</p>
              <p>• No PII leaves the browser in the demo build</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Human review limitations</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>The agent is designed as a <strong>copilot</strong>, not an autopilot. Every customer email, candidate decision, project mitigation, and financial action requires explicit human approval before execution. The reasoning panel exists so the human reviewer can verify the logic — not rubber-stamp it.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4" /> Data & deployment</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Demo data is deterministic, generated at module-load. Auth and conversations persist in <code>localStorage</code>. The build is fully static-friendly and deploys to Vercel, Cloudflare, or any edge host out of the box.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild className="brand-gradient text-white shadow-elegant"><Link to="/command"><Sparkles className="mr-2 h-4 w-4" /> Try the agent</Link></Button>
        </div>
      </div>
    </div>
  );
}