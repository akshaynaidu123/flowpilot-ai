// Deterministic seed data for FlowPilot AI demo. All in-memory.

export type LeadStage = "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export const LEAD_STAGES: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  value: number;
  stage: LeadStage;
  owner: string;
  lastContactDays: number;
  notes: string;
};

export type CandidateStage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
export const CANDIDATE_STAGES: CandidateStage[] = ["Applied", "Screening", "Interview", "Offer", "Hired"];

export type Candidate = {
  id: string;
  name: string;
  role: string;
  email: string;
  experience: number;
  skills: string[];
  match: number;
  stage: CandidateStage;
  summary: string;
  source: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: "Engineering" | "Sales" | "HR" | "Design" | "Finance" | "Operations";
  joinedDays: number;
  utilization: number;
};

export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed";
export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  daysLate: number;
  blockers: number;
  team: string[];
  dueIn: number;
  budget: number;
  milestones: { name: string; done: boolean; due: string }[];
};

export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";
export type Task = {
  id: string;
  title: string;
  projectId: string;
  assignee: string;
  status: TaskStatus;
  priority: "Low" | "Med" | "High";
  dueInDays: number;
};

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export type Invoice = {
  id: string;
  client: string;
  amount: number;
  issuedDays: number;
  dueInDays: number;
  status: InvoiceStatus;
};

export type Notification = {
  id: string;
  type: "risk" | "task" | "hiring" | "followup" | "finance";
  title: string;
  body: string;
  ago: string;
  read: boolean;
};

export type AuditEntry = {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  at: string;
};

const leadNames = [
  ["Rahul Khanna", "Acme Industries"],
  ["Sneha Reddy", "Vertex Labs"],
  ["Vikram Singh", "Helios Health"],
  ["Pooja Nair", "Orion Bank"],
  ["Aditya Joshi", "Nova Retail"],
  ["Meera Patel", "Cobalt Logistics"],
  ["Aman Gupta", "Lumen Media"],
  ["Tanvi Shah", "Quartz Energy"],
  ["Arjun Pillai", "Sable Foods"],
  ["Isha Bose", "Pinnacle Realty"],
  ["Karthik Menon", "Brio Auto"],
  ["Divya Saxena", "Halo Telecom"],
  ["Nikhil Banerjee", "Forge Steel"],
  ["Riya Kapoor", "Indigo Cloud"],
];
const sources = ["Website", "Referral", "LinkedIn", "Event", "Cold Outreach"];
const owners = ["Rohan Mehta", "Aanya Sharma", "Priya Verma"];
const stagesPool: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export const leads: Lead[] = leadNames.map(([n, c], i) => ({
  id: `L-${1000 + i}`,
  name: n,
  company: c,
  email: `${n.split(" ")[0].toLowerCase()}@${c.toLowerCase().replace(/\s+/g, "")}.com`,
  phone: `+91 9${String(800000000 + i * 11317).slice(0, 9)}`,
  source: sources[i % sources.length],
  value: 150000 + ((i * 73) % 18) * 90000,
  stage: stagesPool[i % stagesPool.length],
  owner: owners[i % owners.length],
  lastContactDays: (i * 3) % 21,
  notes: "Engaged on email; asked for case study and pricing breakdown.",
}));

const skillBank = ["React", "TypeScript", "Node.js", "Python", "GraphQL", "AWS", "GCP", "Figma", "Testing", "Next.js", "Tailwind", "Postgres", "Docker", "K8s", "CI/CD", "Accessibility"];
const candidateNames = ["Neha Kapoor", "Arjun Rao", "Sara Mathew", "Devansh Jain", "Ananya Roy", "Yash Bhatia", "Ira Khanna", "Rohit Sen", "Mira Das", "Vivaan Shetty"];
const roles = ["Frontend Engineer", "Backend Engineer", "Product Designer", "Data Analyst", "DevOps Engineer"];
const candStages: CandidateStage[] = ["Applied", "Screening", "Interview", "Offer", "Hired"];

export const candidates: Candidate[] = candidateNames.map((n, i) => ({
  id: `C-${200 + i}`,
  name: n,
  role: roles[i % roles.length],
  email: `${n.split(" ")[0].toLowerCase()}.${n.split(" ")[1].toLowerCase()}@mail.com`,
  experience: 2 + (i % 8),
  skills: Array.from({ length: 4 + (i % 3) }, (_, k) => skillBank[(i * 3 + k) % skillBank.length]),
  match: 95 - i * 4,
  stage: candStages[i % candStages.length],
  summary: `${2 + (i % 8)}y experience. Strong portfolio with measurable impact. Communication clear; collaborated across product + design.`,
  source: ["LinkedIn", "Referral", "Career Site", "Naukri"][i % 4],
}));

const empNames = ["Aanya Sharma", "Priya Verma", "Rohan Mehta", "Karan Iyer", "Devansh Jain", "Ananya Roy", "Yash Bhatia", "Ira Khanna", "Rohit Sen", "Mira Das", "Vivaan Shetty", "Neha Kapoor", "Arjun Rao", "Sara Mathew", "Tanvi Shah", "Aditya Joshi"];
const depts: Employee["department"][] = ["Engineering", "Sales", "HR", "Design", "Finance", "Operations"];
export const employees: Employee[] = empNames.map((n, i) => ({
  id: `E-${10 + i}`,
  name: n,
  role: ["Engineer", "Manager", "Designer", "Analyst", "Specialist"][i % 5],
  department: depts[i % depts.length],
  joinedDays: 30 + i * 47,
  utilization: 55 + ((i * 13) % 50),
}));

const projectNames = [
  ["Atlas Migration", "Acme Industries"],
  ["Helios Mobile", "Helios Health"],
  ["Orion Analytics", "Orion Bank"],
  ["Nova Storefront", "Nova Retail"],
  ["Vertex Data Pipeline", "Vertex Labs"],
  ["Cobalt Routing", "Cobalt Logistics"],
  ["Lumen Studio CMS", "Lumen Media"],
  ["Quartz Grid", "Quartz Energy"],
  ["Sable POS", "Sable Foods"],
  ["Pinnacle Portal", "Pinnacle Realty"],
  ["Brio Connect", "Brio Auto"],
];
const statuses: ProjectStatus[] = ["On Track", "At Risk", "Delayed", "On Track", "Completed", "On Track", "At Risk", "On Track", "Delayed", "On Track", "Completed"];
export const projects: Project[] = projectNames.map(([n, c], i) => ({
  id: `P-${30 + i}`,
  name: n,
  client: c,
  status: statuses[i],
  progress: [42, 68, 80, 55, 100, 35, 60, 75, 25, 50, 100][i],
  daysLate: [6, 0, 0, 0, 0, 0, 4, 0, 9, 0, 0][i],
  blockers: [3, 1, 0, 2, 0, 1, 2, 0, 4, 1, 0][i],
  team: empNames.slice(i % 4, (i % 4) + 4),
  dueIn: 5 + i * 7,
  budget: 500000 + i * 175000,
  milestones: [
    { name: "Discovery", done: true, due: "Apr 12" },
    { name: "Design", done: i !== 0 && i !== 8, due: "May 10" },
    { name: "Build", done: i === 4 || i === 10, due: "Jun 22" },
    { name: "Launch", done: i === 4 || i === 10, due: "Jul 30" },
  ],
}));

const taskTitles = [
  "Migrate auth service",
  "Design dashboard v2",
  "Refactor billing module",
  "QA mobile onboarding",
  "Set up staging pipeline",
  "Write API documentation",
  "Customer interview synthesis",
  "Pricing experiment review",
  "Accessibility audit",
  "Performance budgets",
  "Standup automation",
  "Quarterly OKR draft",
];
const taskStatuses: TaskStatus[] = ["Todo", "In Progress", "Review", "Done"];
export const tasks: Task[] = taskTitles.map((t, i) => ({
  id: `T-${500 + i}`,
  title: t,
  projectId: projects[i % projects.length].id,
  assignee: empNames[i % empNames.length],
  status: taskStatuses[i % taskStatuses.length],
  priority: (["Low", "Med", "High"] as const)[i % 3],
  dueInDays: (i * 2) % 14,
}));

const invClients = ["Acme Corp", "Vertex Labs", "Helios Health", "Orion Bank", "Nova Retail", "Cobalt Logistics", "Lumen Media", "Quartz Energy"];
const invStatuses: InvoiceStatus[] = ["Overdue", "Pending", "Paid", "Overdue", "Paid", "Pending", "Overdue", "Paid"];
export const invoices: Invoice[] = invClients.map((c, i) => ({
  id: `INV-${2040 + i}`,
  client: c,
  amount: 70000 + i * 95000,
  issuedDays: 50 - i * 5,
  dueInDays: invStatuses[i] === "Overdue" ? -(30 + i * 3) : 15 - i,
  status: invStatuses[i],
}));

export const notifications: Notification[] = [
  { id: "N1", type: "risk", title: "Atlas Migration moved to HIGH risk", body: "Milestone slipped 6 days; 3 blockers open.", ago: "2h", read: false },
  { id: "N2", type: "hiring", title: "2 candidates ready for interview", body: "Neha Kapoor and Arjun Rao cleared screening.", ago: "5h", read: false },
  { id: "N3", type: "followup", title: "Follow up with Rahul Khanna", body: "Proposal sent 7 days ago, no reply.", ago: "8h", read: false },
  { id: "N4", type: "finance", title: "Acme invoice 42 days overdue", body: "INV-2041 — ₹3.2L. Suggest reminder #2.", ago: "1d", read: true },
  { id: "N5", type: "task", title: "QA mobile onboarding due today", body: "Owner: Ananya Roy", ago: "1d", read: true },
  { id: "N6", type: "risk", title: "Sable POS marked Delayed", body: "9 days behind plan.", ago: "2d", read: true },
];

export const auditLog: AuditEntry[] = [
  { id: "A1", actor: "Aanya Sharma", role: "admin", action: "Updated lead stage", target: "Rahul Khanna → Proposal", at: "Today 10:24" },
  { id: "A2", actor: "Priya Verma", role: "hr", action: "Advanced candidate", target: "Neha Kapoor → Interview", at: "Today 09:51" },
  { id: "A3", actor: "Rohan Mehta", role: "sales", action: "Drafted email", target: "Lead L-1003", at: "Yesterday 17:12" },
  { id: "A4", actor: "Karan Iyer", role: "pm", action: "Flagged risk", target: "Atlas Migration", at: "Yesterday 14:03" },
  { id: "A5", actor: "Aanya Sharma", role: "admin", action: "Reset demo data", target: "system", at: "Mon 11:09" },
];

// Aggregates / chart data
export function revenueSeries() {
  return [
    { m: "Jan", revenue: 320 },
    { m: "Feb", revenue: 410 },
    { m: "Mar", revenue: 380 },
    { m: "Apr", revenue: 470 },
    { m: "May", revenue: 520 },
    { m: "Jun", revenue: 610 },
    { m: "Jul", revenue: 680 },
    { m: "Aug", revenue: 720 },
    { m: "Sep", revenue: 800 },
    { m: "Oct", revenue: 870 },
    { m: "Nov", revenue: 940 },
    { m: "Dec", revenue: 1020 },
  ];
}

export function leadFunnel() {
  const counts = LEAD_STAGES.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));
  return counts;
}

export function hiringPipeline() {
  return CANDIDATE_STAGES.map((s) => ({ stage: s, count: candidates.filter((c) => c.stage === s).length }));
}

export function projectStatusSplit() {
  const m = new Map<string, number>();
  projects.forEach((p) => m.set(p.status, (m.get(p.status) ?? 0) + 1));
  return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
}

export function employeeDistribution() {
  const m = new Map<string, number>();
  employees.forEach((e) => m.set(e.department, (m.get(e.department) ?? 0) + 1));
  return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
}

export function invoiceAging() {
  const buckets = [
    { range: "0-30d", value: 0 },
    { range: "31-60d", value: 0 },
    { range: "61-90d", value: 0 },
    { range: "90d+", value: 0 },
  ];
  invoices.forEach((i) => {
    if (i.status === "Paid") return;
    const d = Math.max(0, -i.dueInDays);
    if (d <= 30) buckets[0].value += i.amount;
    else if (d <= 60) buckets[1].value += i.amount;
    else if (d <= 90) buckets[2].value += i.amount;
    else buckets[3].value += i.amount;
  });
  return buckets;
}

export function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function kpis() {
  const revenue = revenueSeries().reduce((s, x) => s + x.revenue, 0) * 1000;
  return {
    revenue,
    openLeads: leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length,
    activeProjects: projects.filter((p) => p.status !== "Completed").length,
    employees: employees.length,
    tasksDueToday: tasks.filter((t) => t.dueInDays <= 1 && t.status !== "Done").length,
    overdueInvoices: invoices.filter((i) => i.status === "Overdue").length,
  };
}

export function activityFeed() {
  return [
    { who: "Rohan Mehta", what: "moved Rahul Khanna to Proposal", when: "10m" },
    { who: "Priya Verma", what: "scheduled interview with Neha Kapoor", when: "32m" },
    { who: "Karan Iyer", what: "raised risk flag on Atlas Migration", when: "1h" },
    { who: "Aanya Sharma", what: "approved hiring plan for Q3", when: "3h" },
    { who: "System", what: "generated weekly business summary", when: "6h" },
  ];
}