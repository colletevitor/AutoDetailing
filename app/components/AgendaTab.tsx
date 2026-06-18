"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight, Car, X, Check, Clock, User } from "lucide-react";
import { Appointment, Service, Employee, ServiceStatus } from "../types";
import { getAppointments, saveAppointments, getServices, getEmployees } from "../lib/storage";

const STATUS_CONFIG: Record<ServiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  aguardando:   { label: "Aguardando",    bg: "bg-yellow-500/15",  text: "text-yellow-400",  dot: "bg-yellow-400" },
  em_andamento: { label: "Em Andamento",  bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-400" },
  concluido:    { label: "Concluído",     bg: "bg-green-500/15",   text: "text-green-400",   dot: "bg-green-400" },
  cancelado:    { label: "Cancelado",     bg: "bg-red-500/15",     text: "text-red-400",     dot: "bg-red-400" },
};

const STATUSES = Object.entries(STATUS_CONFIG) as [ServiceStatus, (typeof STATUS_CONFIG)[ServiceStatus]][];

const EMPTY_FORM = {
  clientName: "", carPlate: "", carModel: "",
  serviceId: "", employeeId: "", date: "", time: "09:00", notes: "",
};

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function AgendaTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [modal, setModal] = useState<"add" | "edit" | "status" | null>(null);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, date: today() });

  useEffect(() => {
    setAppointments(getAppointments());
    setServices(getServices());
    setEmployees(getEmployees());
  }, []);

  function persist(data: Appointment[]) { setAppointments(data); saveAppointments(data); }

  const dayAppts = appointments.filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  function shiftDate(days: number) {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }

  function openAdd() { setForm({ ...EMPTY_FORM, date: selectedDate }); setModal("add"); }
  function openEdit(a: Appointment) {
    setEditing(a);
    setForm({ clientName: a.clientName, carPlate: a.carPlate, carModel: a.carModel, serviceId: a.serviceId, employeeId: a.employeeId, date: a.date, time: a.time, notes: a.notes ?? "" });
    setModal("edit");
  }
  function openStatus(a: Appointment) { setEditing(a); setModal("status"); }
  function close() { setModal(null); setEditing(null); }

  function handleSave() {
    if (!form.clientName.trim() || !form.carPlate.trim() || !form.carModel.trim() || !form.serviceId || !form.employeeId || !form.date) return;
    if (modal === "add") {
      const appt: Appointment = { ...form, id: `a${Date.now()}`, status: "aguardando", createdAt: new Date().toISOString() };
      persist([...appointments, appt]);
    } else if (modal === "edit" && editing) {
      persist(appointments.map((a) => a.id === editing.id ? { ...editing, ...form } : a));
    }
    close();
  }

  function handleStatusChange(status: ServiceStatus) {
    if (!editing) return;
    const completedAt = status === "concluido" ? new Date().toISOString() : undefined;
    persist(appointments.map((a) => a.id === editing.id ? { ...a, status, ...(completedAt ? { completedAt } : {}) } : a));
    close();
  }

  function handleDelete(id: string) {
    if (confirm("Remover este agendamento?")) persist(appointments.filter((a) => a.id !== id));
  }

  function getService(id: string) { return services.find((s) => s.id === id); }
  function getEmployee(id: string) { return employees.find((e) => e.id === id); }

  const isToday = selectedDate === today();
  const [yyyy, mm, dd] = selectedDate.split("-");
  const dateObj = new Date(`${selectedDate}T12:00:00`);
  const weekday = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });

  return (
    <div>
      {/* Date navigator */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => shiftDate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-bold capitalize">{isToday ? "Hoje" : weekday}</p>
          <p className="text-[#A1A1AA] text-sm">{fmtDate(selectedDate)}</p>
        </div>
        <button onClick={() => shiftDate(1)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["aguardando","em_andamento","concluido"] as ServiceStatus[]).map((s) => {
          const count = dayAppts.filter((a) => a.status === s).length;
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className="bg-[#111113] border border-[#27272A] rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${cfg.text}`}>{count}</p>
              <p className="text-[#52525B] text-xs mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* List header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#A1A1AA]">{dayAppts.length} agendamento{dayAppts.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} /> Agendar
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {dayAppts.map((a) => {
          const svc = getService(a.serviceId);
          const emp = getEmployee(a.employeeId);
          const cfg = STATUS_CONFIG[a.status];
          return (
            <div key={a.id} className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden hover:border-[#3F3F46] transition-colors">
              {/* Status bar */}
              <div className={`h-1 ${cfg.dot}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{a.carModel}</span>
                      <span className="text-xs bg-[#27272A] px-2 py-0.5 rounded font-mono tracking-widest">{a.carPlate.toUpperCase()}</span>
                    </div>
                    <p className="text-[#A1A1AA] text-xs mt-1">{a.clientName}</p>
                  </div>
                  <button onClick={() => openStatus(a)} className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.text} hover:opacity-80 transition-opacity`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#A1A1AA]">
                  <span className="flex items-center gap-1.5"><Clock size={11} />{a.time}</span>
                  {svc && <span className="flex items-center gap-1.5"><Car size={11} />{svc.name}</span>}
                  {emp && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: emp.color }} />
                      {emp.name}
                    </span>
                  )}
                  {svc && <span className="text-[#F97316] font-medium ml-auto">{svc.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
                </div>

                {a.notes && <p className="text-[#52525B] text-xs mt-2 pt-2 border-t border-[#27272A]">{a.notes}</p>}

                <div className="flex gap-2 mt-3 pt-3 border-t border-[#27272A]">
                  <button onClick={() => openEdit(a)} className="flex-1 text-xs py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors">Editar</button>
                  <button onClick={() => handleDelete(a.id)} className="flex-1 text-xs py-1.5 rounded-lg hover:bg-red-500/15 text-[#A1A1AA] hover:text-red-400 transition-colors">Remover</button>
                </div>
              </div>
            </div>
          );
        })}

        {dayAppts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#52525B]">
            <Car size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Nenhum agendamento para {isToday ? "hoje" : fmtDate(selectedDate)}</p>
            <button onClick={openAdd} className="mt-3 text-[#F97316] text-sm hover:underline">Criar agendamento</button>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ─────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#27272A] sticky top-0 bg-[#111113] z-10">
              <h3 className="font-bold">{modal === "add" ? "Novo Agendamento" : "Editar Agendamento"}</h3>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#27272A] transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Data *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Horário</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Nome do Cliente *</label>
                <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Nome do cliente" className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Placa *</label>
                  <input value={form.carPlate} onChange={(e) => setForm({ ...form, carPlate: e.target.value.toUpperCase() })} placeholder="ABC-1234" maxLength={8} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#F97316] transition-colors uppercase" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Modelo *</label>
                  <input value={form.carModel} onChange={(e) => setForm({ ...form, carModel: e.target.value })} placeholder="Ex: Civic 2022" className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Serviço *</label>
                <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors">
                  <option value="">Selecione...</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Funcionário *</label>
                <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors">
                  <option value="">Selecione...</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Detalhes adicionais..." className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0 sticky bottom-0 bg-[#111113]">
              <button onClick={close} className="flex-1 bg-[#27272A] hover:bg-[#3F3F46] rounded-lg py-2.5 text-sm font-medium transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-[#F97316] hover:bg-[#FB923C] text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Check size={15} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Modal ───────────────────────────────────────── */}
      {modal === "status" && editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
              <h3 className="font-bold">Mudar Status</h3>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#27272A] transition-colors"><X size={16} /></button>
            </div>
            <div className="p-4 space-y-2">
              {STATUSES.map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${editing.status === key ? `${cfg.bg} ${cfg.text}` : "hover:bg-[#27272A] text-[#A1A1AA]"}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-sm font-medium">{cfg.label}</span>
                  {editing.status === key && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
