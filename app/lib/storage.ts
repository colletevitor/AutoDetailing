import { Service, Employee, Appointment } from "../types";

const KEYS = {
  services: "autodetail_services",
  employees: "autodetail_employees",
  appointments: "autodetail_appointments",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Services ──────────────────────────────────────────────────────────────
const defaultServices: Service[] = [
  { id: "s1", name: "Lavagem Simples", price: 50, duration: 60 },
  { id: "s2", name: "Lavagem Completa", price: 120, duration: 120 },
  { id: "s3", name: "Polimento", price: 350, duration: 240 },
  { id: "s4", name: "Vitrificação", price: 800, duration: 480 },
  { id: "s5", name: "Higienização Interna", price: 200, duration: 180 },
];

export function getServices(): Service[] {
  return load<Service[]>(KEYS.services, defaultServices);
}
export function saveServices(data: Service[]): void {
  save(KEYS.services, data);
}

// ── Employees ─────────────────────────────────────────────────────────────
const defaultEmployees: Employee[] = [
  { id: "e1", name: "Carlos", role: "Lavador", color: "#3B82F6" },
  { id: "e2", name: "Rafael", role: "Polidor", color: "#10B981" },
  { id: "e3", name: "Marcelo", role: "Gerente", color: "#F97316" },
];

export function getEmployees(): Employee[] {
  return load<Employee[]>(KEYS.employees, defaultEmployees);
}
export function saveEmployees(data: Employee[]): void {
  save(KEYS.employees, data);
}

// ── Appointments ──────────────────────────────────────────────────────────
export function getAppointments(): Appointment[] {
  return load<Appointment[]>(KEYS.appointments, []);
}
export function saveAppointments(data: Appointment[]): void {
  save(KEYS.appointments, data);
}
