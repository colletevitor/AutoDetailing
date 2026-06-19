import { createClient } from "@supabase/supabase-js";
import { Service, Employee, Appointment } from "../types";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Services ──────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const { data } = await sb().from("services").select("*").order("name");
  return (data ?? []).map((r: any) => ({ id: r.id, name: r.name, price: r.price, duration: r.duration, description: r.description ?? "" }));
}
export async function createService(s: Omit<Service, "id">): Promise<void> {
  await sb().from("services").insert({ name: s.name, price: s.price, duration: s.duration, description: s.description });
}
export async function updateService(s: Service): Promise<void> {
  await sb().from("services").update({ name: s.name, price: s.price, duration: s.duration, description: s.description }).eq("id", s.id);
}
export async function deleteService(id: string): Promise<void> {
  await sb().from("services").delete().eq("id", id);
}

// ── Employees ─────────────────────────────────────────────────────────────
export async function getEmployees(): Promise<Employee[]> {
  const { data } = await sb().from("employees").select("*").order("name");
  return (data ?? []).map((r: any) => ({ id: r.id, name: r.name, role: r.role, color: r.color }));
}
export async function createEmployee(e: Omit<Employee, "id">): Promise<void> {
  await sb().from("employees").insert({ name: e.name, role: e.role, color: e.color });
}
export async function updateEmployee(e: Employee): Promise<void> {
  await sb().from("employees").update({ name: e.name, role: e.role, color: e.color }).eq("id", e.id);
}
export async function deleteEmployee(id: string): Promise<void> {
  await sb().from("employees").delete().eq("id", id);
}

// ── Appointments ──────────────────────────────────────────────────────────
export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await sb().from("appointments").select("*").order("date").order("time");
  return (data ?? []).map((r: any) => ({
    id: r.id, date: r.date, time: r.time,
    clientName: r.client_name, carPlate: r.car_plate, carModel: r.car_model,
    serviceId: r.service_id, employeeId: r.employee_id,
    status: r.status, notes: r.notes ?? "",
    createdAt: r.created_at, completedAt: r.completed_at,
  }));
}
export async function createAppointment(a: Omit<Appointment, "id" | "createdAt">): Promise<void> {
  await sb().from("appointments").insert({
    date: a.date, time: a.time, client_name: a.clientName,
    car_plate: a.carPlate, car_model: a.carModel,
    service_id: a.serviceId, employee_id: a.employeeId,
    status: a.status, notes: a.notes,
  });
}
export async function updateAppointment(a: Appointment): Promise<void> {
  await sb().from("appointments").update({
    date: a.date, time: a.time, client_name: a.clientName,
    car_plate: a.carPlate, car_model: a.carModel,
    service_id: a.serviceId, employee_id: a.employeeId,
    status: a.status, notes: a.notes, completed_at: a.completedAt,
  }).eq("id", a.id);
}
export async function deleteAppointment(id: string): Promise<void> {
  await sb().from("appointments").delete().eq("id", id);
}
