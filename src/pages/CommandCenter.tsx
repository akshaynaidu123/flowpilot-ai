import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Brain,
  ShieldAlert,
  Plus,
  Trash2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { PageHeader } from "@/components/common/PageHeader";
import {
  provider,
  type AIMessage,
} from "@/lib/ai";

const SUGGESTIONS = [
  "Draft a follow-up email for lead Rahul.",
  "Screen these resumes for a frontend role.",
  "Show projects at risk.",
  "Generate weekly business summary.",
  "Create onboarding checklist for new employee.",
  "List overdue invoices.",
];

type Conv = {
  id: string;
  title: string;
  messages: AIMessage[];
};

const HIST_KEY = "flowpilot.conversations";

function loadConvs(): Conv[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(HIST_KEY) ?? "[]"
    );
  } catch {
    return [];
  }
}

function saveConvs(convs: Conv[]) {
  localStorage.setItem(
    HIST_KEY,
    JSON.stringify(convs.slice(0, 20))
  );
}

export default function CommandPage() {
  useEffect(() => {
    document.title =
      "AI Command Center — FlowPilot AI";
  }, []);

  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] =
    useState("");

  const [input, setInput] = useState("");

  const [streaming, setStreaming] =
    useState(false);

  const [showReasoning, setShowReasoning] =
    useState(true);

  const endRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conversations = loadConvs();

    if (conversations.length === 0) {
      const fresh: Conv = {
        id: crypto.randomUUID(),
        title: "New conversation",
        messages: [],
      };

      setConvs([fresh]);
      setActiveId(fresh.id);
    } else {
      setConvs(conversations);
      setActiveId(conversations[0].id);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [convs, streaming]);

  const active = convs.find(
    (c) => c.id === activeId
  );

  const send = async (text: string) => {
    if (
      !active ||
      !text.trim() ||
      streaming
    ) {
      return;
    }

    const userMsg: AIMessage = {
      role: "user",
      content: text,
    };

    const assistantMsg: AIMessage = {
      role: "assistant",
      content: "",
    };

    const updated = convs.map((c) =>
      c.id === activeId
        ? {
            ...c,
            title:
              c.messages.length === 0
                ? text.slice(0, 40)
                : c.title,
            messages: [
              ...c.messages,
              userMsg,
              assistantMsg,
            ],
          }
        : c
    );

    setConvs(updated);
    saveConvs(updated);

    setInput("");
    setStreaming(true);

    let accumulated = "";

    for await (const chunk of provider.stream([
      ...active.messages,
      userMsg,
    ])) {
      accumulated += chunk;

      setConvs((prev) => {
        const next = prev.map((c) => {
          if (c.id !== activeId) {
            return c;
          }

          const messages = [
            ...c.messages,
          ];

          messages[
            messages.length - 1
          ] = {
            role: "assistant",
            content: accumulated,
          };

          return {
            ...c,
            messages,
          };
        });

        saveConvs(next);

        return next;
      });
    }

    setStreaming(false);
  };

  const newConv = () => {
    const fresh: Conv = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
    };

    const updated = [fresh, ...convs];

    setConvs(updated);
    saveConvs(updated);

    setActiveId(fresh.id);
  };

  const delConv = (id: string) => {
    const updated = convs.filter(
      (c) => c.id !== id
    );

    setConvs(updated);
    saveConvs(updated);

    if (activeId === id) {
      setActiveId(
        updated[0]?.id ?? ""
      );
    }

    if (updated.length === 0) {
      newConv();
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Command Center"
        description="Ask anything across CRM, HR, projects, and finance. Streams reasoning in real time."
        actions={
          <Tabs
            value={
              showReasoning
                ? "on"
                : "off"
            }
            onValueChange={(value) =>
              setShowReasoning(
                value === "on"
              )
            }
          >
            <TabsList>
              <TabsTrigger value="on">
                <Brain className="mr-1 h-3 w-3" />
                Reasoning
              </TabsTrigger>

              <TabsTrigger value="off">
                Plain
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <Alert className="mb-4">
        <ShieldAlert className="h-4 w-4" />

        <AlertDescription>
          Outputs are AI-generated drafts.
          Always review before sending
          emails, scheduling interviews,
          or acting on financial guidance.
        </AlertDescription>
      </Alert>

      {/* Remaining JSX stays EXACTLY the same */}
    </div>
  );
}