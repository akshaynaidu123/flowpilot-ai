// Mock AI provider with streaming. Designed so a real provider
// (OpenAI/Gemini/Groq/Qwen/DeepSeek) can be dropped in by replacing `provider`.

export type AIMessage = { role: "user" | "assistant" | "system"; content: string };

export interface AIProvider {
  name: string;
  stream(messages: AIMessage[], opts?: { signal?: AbortSignal }): AsyncIterable<string>;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function templateFor(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("follow-up") || p.includes("email")) {
    return `Subject: Following up on our conversation\n\nHi {{name}},\n\nThanks for the chat earlier — I've pulled together a short proposal aligned to the goals you outlined (faster onboarding, ROI in 60 days, and the integrations you mentioned).\n\nWould Thursday at 11:00 IST work for a 20-min review? I'll bring two reference customers from your segment.\n\nBest,\n${currentSig()}\n\n— Reasoning —\n• Lead score is in the top quartile; prior engagement was warm.\n• Decision window is closing in ~14 days based on stated quarter close.\n• Tone matched to enterprise persona; concise + concrete next step.`;
  }
  if (p.includes("resume") || p.includes("screen") || p.includes("frontend")) {
    return `Top 3 candidates for the Frontend role:\n\n1. Neha Kapoor — Match 92%. Strong React/TS + design systems. Recommend onsite.\n2. Arjun Rao — Match 86%. Solid Next.js, lighter on testing. Recommend tech screen.\n3. Sara Mathew — Match 81%. Great accessibility + animation work. Recommend portfolio review.\n\n— Reasoning —\nWeighted skill overlap, recency of work, and project complexity vs. JD. All outputs require recruiter review before any candidate contact.`;
  }
  if (p.includes("risk") || p.includes("project")) {
    return `Projects at risk this week:\n\n• Atlas Migration — HIGH. 3 blockers, milestone slipped 6d. Mitigation: split scope, add backend pair, rebaseline on Friday.\n• Helios Mobile — MEDIUM. Designer at 110% load. Mitigation: reassign onboarding screens to Priya.\n• Orion Analytics — LOW. On track; watch QA capacity next sprint.\n\n— Reasoning —\nRisk = w1·schedule_slip + w2·blocker_count + w3·workload_variance. Thresholds tuned to historical delays.`;
  }
  if (p.includes("summary") || p.includes("weekly")) {
    return `Weekly Business Summary\n\nRevenue: ₹48.2L (+12% WoW)\nPipeline: 23 active leads, 4 in negotiation, expected close ₹18L\nHiring: 6 candidates in interview, 2 offers out\nProjects: 11 active, 2 at risk, 1 milestone completed\nFinance: 4 invoices overdue >30d (₹6.1L)\n\nRecommended focus: unblock Atlas Migration, accelerate Orion proposal, and chase Acme + Vertex invoices.`;
  }
  if (p.includes("onboarding")) {
    return `Onboarding Checklist (Engineering Hire)\n\nDay 0\n• Send welcome kit + laptop\n• Provision SSO, GitHub, Linear, Slack\n• Assign onboarding buddy\n\nWeek 1\n• Architecture walkthrough\n• Ship first PR (docs or test)\n• 1:1 with manager + skip-level\n\nWeek 2–4\n• Own a small feature end-to-end\n• Shadow on-call\n• Complete security & compliance training`;
  }
  if (p.includes("invoice") || p.includes("overdue")) {
    return `Overdue invoices (>30d):\n\n• INV-2041 — Acme Corp — ₹3.2L — 42d overdue\n• INV-2048 — Vertex Labs — ₹1.8L — 36d overdue\n• INV-2052 — Helios Health — ₹0.7L — 33d overdue\n• INV-2061 — Orion Bank — ₹0.4L — 31d overdue\n\nSuggested action: send reminder #2 to Acme, escalate Vertex to AM, offer 5% early-pay to Helios.`;
  }
  return `I can help with sales follow-ups, resume screening, project risk, financial summaries, and onboarding plans. Try one of the suggested prompts. (Mock AI — outputs are illustrative and require human review.)`;
}

function currentSig() {
  try {
    const v = localStorage.getItem("flowpilot.session");
    if (!v) return "Your name";
    const s = JSON.parse(v) as { userId: string };
    const u = ["Aanya Sharma", "Priya Verma", "Rohan Mehta", "Karan Iyer"][["u1", "u2", "u3", "u4"].indexOf(s.userId)];
    return u ?? "Your name";
  } catch {
    return "Your name";
  }
}

export const mockProvider: AIProvider = {
  name: "FlowPilot Mock",
  async *stream(messages, opts) {
    const last = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
    const out = templateFor(last);
    const chunks = out.match(/.{1,6}(\s|$)|\S+/g) ?? [out];
    for (const c of chunks) {
      if (opts?.signal?.aborted) return;
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
      yield c;
    }
  },
};

export const provider: AIProvider = mockProvider;

// Convenience non-streaming helpers
export async function generate(prompt: string): Promise<string> {
  let out = "";
  for await (const c of provider.stream([{ role: "user", content: prompt }])) out += c;
  return out;
}

export function scoreLead(l: { company: string; value: number; stage: string; lastContactDays: number }): {
  score: number;
  reasons: string[];
} {
  const stageWeight: Record<string, number> = {
    New: 10,
    Contacted: 25,
    Qualified: 50,
    Proposal: 70,
    Negotiation: 85,
    Won: 100,
    Lost: 0,
  };
  const recency = Math.max(0, 30 - l.lastContactDays);
  const valueScore = Math.min(40, Math.round(l.value / 25000));
  const stage = stageWeight[l.stage] ?? 10;
  const score = Math.min(100, Math.round(stage * 0.5 + recency + valueScore * 0.5));
  const reasons = [
    `Stage "${l.stage}" contributes ${Math.round(stage * 0.5)}`,
    `Recency (${l.lastContactDays}d) contributes ${recency}`,
    `Deal value ₹${(l.value / 100000).toFixed(1)}L contributes ${Math.round(valueScore * 0.5)}`,
  ];
  return { score, reasons };
}

export function projectRisk(p: { progress: number; daysLate: number; blockers: number }): {
  level: "Low" | "Medium" | "High";
  score: number;
} {
  const s = Math.min(100, p.daysLate * 4 + p.blockers * 15 + Math.max(0, 60 - p.progress));
  const level = s > 65 ? "High" : s > 35 ? "Medium" : "Low";
  return { level, score: s };
}