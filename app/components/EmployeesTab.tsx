"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users, X, Check } from "lucide-react";
import { Employee } from "../types";
import { getEmployees, saveEmployees } from "../lib/storage";

const COLORS = ["#F97316","#3B82F6","#10B981","#8B5CF6","#EC4899","#EAB308","#14B8A6","#F43F5E"];
const EMPTY: Omit<Employee, "id"> = { name: "", role: "", color: COLORS[0] };

export default function EmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setEmployees(getEmployees()); }, []);

  function persist(data: Employee[]) { setEmployees(data); saveEmployees(data); }
  function openAdd() { setForm(EMPTY); setModal("add"); }
  function openEdit(e: Employee) { setEditing(e); setForm({ name: e.name, role: e.role, color: e.color }); setModal("edit"); }
  function close() { setModal(null); setEditing(null); }

  function handleSave() {
    if (!form.name.trim()) return;
    if (modal === "add") {
      persist([...employees, { ...form, id: `e${Date.now()}` }]);
    } else if (modal === "edit" && editing) {
      persist(employees.map((e) => e.id === editing.id ? { ...editing, ...form } : e));
    }
    close();
  }

  function handleDelete(id: string) {
    if (confirm("Remover este funcionário?")) persist(employees.filter((e) => e.id !== id));
  }

  function initials(name: string) { return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase(); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Funcionários</h2>
          <p className="text-[#A1A1AA] text-sm mt-0.5">{employees.length} funcionário{employees.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Novo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {employees.map((e) => (
          <div key={e.id} className="bg-[#111113] border border-[#27272A] rounded-xl p-4 hover:border-[#3F3F46] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: e.color }}>
                {initials(e.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{e.name}</p>
                <p className="text-[#A1A1AA] text-xs">{e.role || "—"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(e.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/15 text-[#A1A1AA] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-[#52525B]">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Nenhum funcionário cadastrado</p>
            <button onClick={openAdd} className="mt-3 text-[#F97316] text-sm hover:underline">Adicionar primeiro funcionário</button>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
              <h3 className="font-bold">{modal === "add" ? "Novo Funcionário" : "Editar Funcionário"}</h3>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#27272A] transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Nome *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Cargo / Função</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ex: Lavador, Polidor..." className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-2 block">Cor de identificação</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? "ring-2 ring-offset-2 ring-offset-[#111113] scale-110" : "hover:scale-110"}`} style={{ backgroundColor: c, ringColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={close} className="flex-1 bg-[#27272A] hover:bg-[#3F3F46] rounded-lg py-2.5 text-sm font-medium transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-[#F97316] hover:bg-[#FB923C] text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Check size={15} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
