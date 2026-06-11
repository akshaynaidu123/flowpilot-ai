import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { PageHeader } from "@/components/common/PageHeader";
import { ROLE_LABEL, useAuth } from "@/lib/auth";

import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Settings — FlowPilot AI";
  }, []);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Profile, AI provider, and demo data controls."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>

              <Input
                defaultValue={user?.name}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>

              <Input
                defaultValue={user?.email}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>

              <div>
                <Badge>
                  {user
                    ? ROLE_LABEL[user.role]
                    : ""}
                </Badge>
              </div>
            </div>

            <Button
              onClick={() =>
                toast.success(
                  "Profile saved (demo)"
                )
              }
            >
              Save
            </Button>
          </CardContent>
        </Card>

        {/* AI Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              AI Provider
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              defaultValue="mock"
              className="space-y-2"
            >
              {[
                {
                  v: "mock",
                  label:
                    "FlowPilot Mock (active)",
                  hint:
                    "No keys required",
                },
                {
                  v: "openai",
                  label: "OpenAI",
                  hint:
                    "Add OPENAI_API_KEY to enable",
                },
                {
                  v: "gemini",
                  label:
                    "Google Gemini",
                  hint:
                    "Add GEMINI_API_KEY to enable",
                },
                {
                  v: "groq",
                  label: "Groq",
                  hint:
                    "Add GROQ_API_KEY to enable",
                },
                {
                  v: "qwen",
                  label: "Qwen",
                  hint:
                    "Add QWEN_API_KEY to enable",
                },
                {
                  v: "deepseek",
                  label: "DeepSeek",
                  hint:
                    "Add DEEPSEEK_API_KEY to enable",
                },
              ].map((option) => (
                <label
                  key={option.v}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    option.v !== "mock"
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={option.v}
                    disabled={
                      option.v !== "mock"
                    }
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {option.label}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {option.hint}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Demo Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Demo Data
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Conversation history is stored in
              your browser. Clear it to start
              fresh.
            </p>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem(
                  "flowpilot.conversations"
                );

                toast.success(
                  "Conversation history cleared"
                );
              }}
            >
              Clear Conversations
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Appearance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Toggle dark mode from the
              top bar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}