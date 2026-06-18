"use client";
import { useState, useEffect, useMemo } from "react";
import { TrendingUp, DollarSign, Calendar, ChevronDown, Car, History, Loader2 } from "lucide-react";
import { Appointment, Service, Employee } from "../types";
import { getAppointments, getServices, getEmployees } from "../lib/db";

type Period = "dia" | "semana" | "mes";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmt(n: number) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function fmtDate(iso: string) { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; }

export default function RevenueTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("dia");
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [appts, svcs, emps] = await Promise.all([getAppointments(), getServices(), getEmployees()]);
      setAppointments(appts); setServices(svcs); setEmployees(emps);
      setLoading(false);
    })();
  }, []);

  const completed = useMemo(() => appointments.filter((a) => a.status === "concluido"), [appointments]);
  const todayStr = today();
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  function getService(id: string) { return services.find((s) => s.id === id); }
  function getEmployee(id: string) { return employees.find((e) => e.id === id); }

  const filtered = useMemo(() => {
    if (period === "dia") return completed.filter((a) => a.date === todayStr);
    if (period === "semana") return completed.filter((a) => a.date >= weekStart && a.date <= todayStr);
    return completed.filter((a) => a.date >= monthStart && a.date <= todayStr);
  }, [completed, period, todayStr, weekStart, monthStart]);

  const revenue = useMemo(() => filtered.reduce((s, a) => s + (getService(a.serviceId)?.price ?? 0), 0), [filtered, services]);

  const totalDay   = useMemo(() => completed.filter((a) => a.date === todayStr).reduce((s, a) => s + (getService(a.serviceId)?.price ?? 0), 0), [completed, todayStr, services]);
  const totalWeek  = useMemo(() => completed.filter((a) => a.date >= weekStart && a.date <= todayStr).reduce((s, a) => s + (getService(a.serviceId)?.price ?? 0), 0), [completed, weekStart, todayStr, services]);
  const totalMonth = useMemo(() => completed.filter((a) => a.date >= monthStart && a.date <= todayStr).reduce((s, a) => s + (getService(a.serviceId)?.price ?? 0), 0), [completed, monthStart, todayStr, services]);

  const byEmployee = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filtered.forEach((a) => { const svc = getService(a.serviceId); if (!map[a.employeeId]) map[a.employeeId] = { count: 0, total: 0 }; map[a.employeeId].count++; map[a.employeeId].total += svc?.price ?? 0; });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filtered, services]);

  const byService = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filtered.forEach((a) => { const svc = getService(a.serviceId); if (!svc) return; if (!map[a.serviceId]) map[a.serviceId] = { count: 0, total: 0 }; map[a.serviceId].count++; map[a.serviceId].total += svc.price; });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filtered, services]);

  const history = useMemo(() => [...completed].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)), [completed]);

  if (loading) return <div className="flex items-center justify-center py-24 text-[#52525B]"><Loader2 size={24} className="animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Rendimentos</h2>
        <p className="text-[#A1A1AA] text-sm mt-0.5">Baseado nos serviços concluídos</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {([["dia","Hoje",totalDay],["semana","Semana",totalWeek],["mes","Mês",totalMonth]] as [Period,string,number][]).map(([p,label,val]) => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-xl p-3 sm:p-4 text-left transition-all border ${period === p ? "border-[#F97316] bg-[#F97316]/10" : "border-[#27272A] bg-[#111113] hover:border-[#3F3F46]"}`}>
            <p className={`text-xs font-medium mb-1 ${period === p ? "text-[#F97316]" : "text-[#52525B]"}`}>{label}</p>
            <p className={`font-bold text-sm sm:text-base ${period === p ? "text-[#F97316]" : "text-[#FAFAFA]"}`}>{fmt(val)}</p>
          </button>
        ))}
      </div>

      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-1 text-[#A1A1AA] text-sm"><DollarSign size={15} /><span>{{ dia: "Hoje", semana: "Esta semana", mes: "Este mês" }[period]}</span></div>
        <p className="text-3xl sm:text-4xl font-bold text-[#F97316]">{fmt(revenue)}</p>
        <p className="text-[#52525B] text-sm mt-1">{filtered.length} serviço{filtered.length !== 1 ? "s" : ""} concluído{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {byEmployee.length > 0 && (
        <div className="bg-[#111113] border border-[#27272A] rounded-xl mb-4">
          <div className="p-4 border-b border-[#27272A]"><p className="font-semibold text-sm">Por Funcionário</p></div>
          <div className="divide-y divide-[#27272A]">
            {byEmployee.map(([empId, data]) => {
              const emp = getEmployee(empId);
              const pct = revenue > 0 ? (data.total / revenue) * 100 : 0;
              return (
                <div key={empId} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: emp?.color ?? "#52525B" }} /><span className="text-sm font-medium">{emp?.name ?? "—"}</span><span className="text-[#52525B] text-xs">{data.count}x</span></div>
                    <span className="font-bold text-sm text-[#F97316]">{fmt(data.total)}</span>
                  </div>
                  <div className="h-1.5 bg-[#27272A] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#F97316]" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {byService.length > 0 && (
        <div className="bg-[#111113] border border-[#27272A] rounded-xl mb-6">
          <div className="p-4 border-b border-[#27272A]"><p className="font-semibold text-sm">Por Serviço</p></div>
          <div className="divide-y divide-[#27272A]">
            {byService.map(([svcId, data]) => {
              const svc = getService(svcId);
              const pct = revenue > 0 ? (data.total / revenue) * 100 : 0;
              return (
                <div key={svcId} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium">{svc?.name ?? "—"}</span><span className="text-[#52525B] text-xs">{data.count}x</span></div>
                    <span className="font-bold text-sm">{fmt(data.total)}</span>
                  </div>
                  <div className="h-1.5 bg-[#27272A] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#3B82F6]" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-[#52525B] mb-6">
          <TrendingUp size={36} className="mb-3 opacity-30" />
          <p className="text-sm">Nenhum serviço concluído {period === "dia" ? "hoje" : period === "semana" ? "esta semana" : "este mês"}</p>
        </div>
      )}

      <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-[#18181B] transition-colors" onClick={() => setHistoryOpen((v) => !v)}>
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#A1A1AA]" />
            <span className="font-semibold text-sm">Histórico Completo</span>
            <span className="text-xs text-[#52525B] bg-[#27272A] px-2 py-0.5 rounded-full">{history.length}</span>
          </div>
          <ChevronDown size={16} className={`text-[#52525B] transition-transform ${historyOpen ? "rotate-180" : ""}`} />
        </button>
        {historyOpen && (
          <div className="border-t border-[#27272A]">
            {history.length === 0 ? (
              <div className="p-6 text-center text-[#52525B] text-sm">Nenhum serviço concluído ainda</div>
            ) : (
              <div className="divide-y divide-[#27272A] max-h-[400px] overflow-y-auto">
                {history.map((a) => {
                  const svc = getService(a.serviceId);
                  const emp = getEmployee(a.employeeId);
                  return (
                    <div key={a.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{a.carModel}</span>
                            <span className="text-xs bg-[#27272A] px-1.5 py-0.5 rounded font-mono">{a.carPlate.toUpperCase()}</span>
                          </div>
                          <p className="text-[#A1A1AA] text-xs mt-0.5">{a.clientName}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-[#52525B]">
                            <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(a.date)} {a.time}</span>
                            {svc && <span>{svc.name}</span>}
                            {emp && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: emp.color }} />{emp.name}</span>}
                          </div>
                        </div>
                        {svc && <span className="text-[#F97316] font-bold text-sm shrink-0">{fmt(svc.price)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
