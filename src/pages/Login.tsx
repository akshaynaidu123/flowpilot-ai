import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  DEMO_USERS,
  login,
  useAuth,
} from "@/lib/auth";

import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();

  const { refresh } = useAuth();

  const [email, setEmail] = useState(
    "admin@flowpilot.ai"
  );

  const [password, setPassword] =
    useState("password123");

  useEffect(() => {
    document.title =
      "Sign in — FlowPilot AI";
  }, []);

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const user = login(
      email,
      password
    );

    if (!user) {
      toast.error(
        "Invalid credentials. Try one of the demo accounts."
      );

      return;
    }

    refresh();

    toast.success(
      `Welcome back, ${
        user.name.split(" ")[0]
      }`
    );

    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden grid lg:grid-cols-2">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full brand-gradient opacity-30 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient shadow-elegant">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            FlowPilot AI
          </span>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h1 className="text-5xl font-semibold tracking-tight leading-tight">
            Automate Business.
            <br />

            <span className="brand-text">
              Amplify Teams.
            </span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            One AI assistant across CRM,
            HR, projects, and finance.
            Stream natural-language
            commands, score leads,
            screen resumes, flag
            project risk, and chase
            invoices — all in one
            workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "CRM",
              "Recruiting",
              "Projects",
              "Finance",
              "Audit",
            ].map((item) => (
              <Badge
                key={item}
                variant="secondary"
              >
                {item}
              </Badge>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground">
          © 2026 FlowPilot AI ·
          Contest demo
        </p>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="w-full max-w-md"
        >
          <Card className="glass shadow-elegant">
            <CardContent className="p-8">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>

                <span className="font-semibold">
                  FlowPilot AI
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Sign in
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Use a demo account to
                explore the workspace.
              </p>

              <form
                onSubmit={submit}
                className="mt-6 space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full brand-gradient text-white hover:opacity-90"
                >
                  Sign in

                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Demo accounts
                  (click to fill)
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {DEMO_USERS.map(
                    (user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setEmail(
                            user.email
                          );

                          setPassword(
                            user.password
                          );
                        }}
                        className="text-left rounded-md border px-3 py-2 hover:bg-accent transition"
                      >
                        <div className="text-xs font-medium">
                          {user.name}
                        </div>

                        <div className="text-[10px] text-muted-foreground">
                          {user.email}
                        </div>
                      </button>
                    )
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground mt-3">
                  Password for all
                  demo accounts:{" "}
                  <code>
                    password123
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}