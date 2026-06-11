<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
=======
import { Link, useNavigate } from "@tanstack/react-router";
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
import { Bell, LogOut, Moon, Sun, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout, ROLE_LABEL, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { notifications } from "@/lib/data";

export function Topbar() {
  const { user, refresh } = useAuth();
<<<<<<< HEAD

  const navigate = useNavigate();

  const [dark, setDark] = useState(false);

=======
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const isDark =
      localStorage.getItem("flowpilot.theme") === "dark" ||
      (!localStorage.getItem("flowpilot.theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
<<<<<<< HEAD

    document.documentElement.classList.toggle("dark", isDark);

=======
    document.documentElement.classList.toggle("dark", isDark);
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
<<<<<<< HEAD

    setDark(next);

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem(
      "flowpilot.theme",
      next ? "dark" : "light"
    );
=======
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("flowpilot.theme", next ? "dark" : "light");
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b glass px-4">
      <SidebarTrigger />
<<<<<<< HEAD

      <div className="relative hidden md:block flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search leads, projects, candidates…"
          className="pl-8 h-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Link to="/notifications">
            <Bell className="h-4 w-4" />

=======
      <div className="relative hidden md:block flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search leads, projects, candidates…" className="pl-8 h-9" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Link to="/notifications">
            <Bell className="h-4 w-4" />
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full brand-gradient px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        </Button>
<<<<<<< HEAD

=======
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-accent">
                <Avatar className="h-7 w-7">
<<<<<<< HEAD
                  <AvatarFallback className="text-[10px] brand-gradient text-white">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium">
                    {user.name}
                  </span>

                  <Badge
                    variant="secondary"
                    className="h-4 px-1 text-[9px]"
                  >
                    {ROLE_LABEL[user.role]}
                  </Badge>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel className="text-xs">
                {user.email}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  navigate("/settings")
                }
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate("/about")
                }
              >
                About the Agent
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  logout();

                  refresh();

                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
=======
                  <AvatarFallback className="text-[10px] brand-gradient text-white">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium">{user.name}</span>
                  <Badge variant="secondary" className="h-4 px-1 text-[9px]">{ROLE_LABEL[user.role]}</Badge>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => nav({ to: "/settings" })}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => nav({ to: "/about" })}>About the Agent</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  refresh();
                  nav({ to: "/login" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
>>>>>>> b6e0b305167355c2b8303e0f25f8e87c90700d5c
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}