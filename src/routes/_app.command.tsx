import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, Brain, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { provider, type AIMessage } from "@/lib/ai";

export const Route = createFileRoute("/_app/command")({
  head: () => ({ meta: [{ title: "AI Command Center — FlowPilot AI" }] }),
  component: CommandPage,
});

const SUGGESTIONS = [
  "Draft a follow-up email for lead Rahul.",
  "Screen these resumes for a frontend role.",
  "Show projects at risk.",
  "Generate weekly business summary.",
  "Create onboarding checklist for new employee.",
  "List overdue invoices.",
];

type Conv = { id: string; title: string; messages: AIMessage[] };
const HIST_KEY = "flowpilot.conversations";

function loadConvs(): Conv[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HIST_KEY) ?? "[]"); } catch { return []; }
}
function saveConvs(c: Conv[]) { localStorage.setItem(HIST_KEY, JSON.stringify(c.slice(0, 20))); }

function CommandPage() {
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = loadConvs();
    if (c.length === 0) {
      const fresh: Conv = { id: crypto.randomUUID(), title: "New conversation", messages: [] };
      setConvs([fresh]); setActiveId(fresh.id);
    } else { setConvs(c); setActiveId(c[0].id); }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convs, streaming]);

  const active = convs.find((c) => c.id === activeId);

  const send = async (text: string) => {
    if (!active || !text.trim() || streaming) return;
    const userMsg: AIMessage = { role: "user", content: text };
    const aMsg: AIMessage = { role: "assistant", content: "" };
    const next = convs.map((c) =>
      c.id === activeId
        ? { ...c, title: c.messages.length === 0 ? text.slice(0, 40) : c.title, messages: [...c.messages, userMsg, aMsg] }
        : c,
    );
    setConvs(next); saveConvs(next); setInput(""); setStreaming(true);

    let acc = "";
    for await (const chunk of provider.stream([...active.messages, userMsg])) {
      acc += chunk;
      setConvs((prev) => {
        const u = prev.map((c) => {
          if (c.id !== activeId) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = { role: "assistant", content: acc };
          return { ...c, messages: msgs };
        });
        saveConvs(u);
        return u;
      });
    }
    setStreaming(false);
  };

  const newConv = () => {
    const fresh: Conv = { id: crypto.randomUUID(), title: "New conversation", messages: [] };
    const u = [fresh, ...convs]; setConvs(u); saveConvs(u); setActiveId(fresh.id);
  };
  const delConv = (id: string) => {
    const u = convs.filter((c) => c.id !== id);
    setConvs(u); saveConvs(u);
    if (activeId === id) setActiveId(u[0]?.id ?? "");
    if (u.length === 0) newConv();
  };

  return (
    <div>
      <PageHeader
        title="AI Command Center"
        description="Ask anything across CRM, HR, projects, and finance. Streams reasoning in real time."
        actions={
          <Tabs value={showReasoning ? "on" : "off"} onValueChange={(v) => setShowReasoning(v === "on")}>
            <TabsList>
              <TabsTrigger value="on"><Brain className="mr-1 h-3 w-3" /> Reasoning</TabsTrigger>
              <TabsTrigger value="off">Plain</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <Alert className="mb-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Outputs are AI-generated drafts. Always review before sending emails, scheduling interviews, or acting on financial guidance.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <Card className="h-fit">
          <CardContent className="p-3">
            <Button onClick={newConv} variant="outline" className="w-full justify-start"><Plus className="mr-2 h-4 w-4" /> New chat</Button>
            <div className="mt-3 space-y-1 max-h-[60vh] overflow-y-auto">
              {convs.map((c) => (
                <div key={c.id} className={`group flex items-center gap-1 rounded-md px-2 py-2 text-sm cursor-pointer ${activeId === c.id ? "bg-accent" : "hover:bg-accent/50"}`} onClick={() => setActiveId(c.id)}>
                  <span className="flex-1 truncate">{c.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); delConv(c.id); }} className="opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[70vh]">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {active?.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-2xl brand-gradient flex items-center justify-center shadow-elegant mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">How can I help today?</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Pick a suggestion or type your own command.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-2xl w-full">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-left text-sm rounded-lg border px-3 py-2 hover:bg-accent transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              active?.messages.map((m, i) => {
                const [main, reasoning] = m.content.split("— Reasoning —");
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                    {m.role === "assistant" && <div className="h-8 w-8 shrink-0 rounded-lg brand-gradient flex items-center justify-center"><Bot className="h-4 w-4 text-white" /></div>}
                    <div className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <div>{main || (streaming && i === active.messages.length - 1 ? "…" : "")}</div>
                      {showReasoning && reasoning && (
                        <div className="mt-3 pt-3 border-t border-foreground/10 text-xs text-muted-foreground whitespace-pre-wrap">
                          <Badge variant="outline" className="mb-2 gap-1"><Brain className="h-3 w-3" /> Reasoning</Badge>
                          <div>{reasoning.trim()}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={endRef} />
          </CardContent>
          <div className="border-t p-3">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask FlowPilot anything…" disabled={streaming} autoFocus />
              <Button type="submit" disabled={streaming || !input.trim()} className="brand-gradient text-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}