"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Wrench, X, Check } from "lucide-react";
import { Service } from "../types";
import { getServices, saveServices } from "../lib/storage";

const EMPTY: Omit<Service, "id"> = { name: "", price: 0, duration: 60, description: "" };

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setServices(getServices()); }, []);

  function persist(data: Service[]) { setServices(data); saveServices(data); }

  function openAdd() { setForm(EMPTY); setModal("add"); }
  function openEdit(s: Service) { setEditing(s); setForm({ name: s.name, price: s.price, duration: s.duration, description: s.description ?? "" }); setModal("edit"); }
  function close() { setModal(null); setEditing(null); }

  function handleSave() {
    if (!form.name.trim()) return;
    if (modal === "add") {
      persist([...services, { ...form, id: `s${Date.now()}` }]);
    } else if (modal === "edit" && editing) {
      persist(services.map((s) => s.id === editing.id ? { ...editing, ...form } : s));
    }
    close();
  }

  function handleDelete(id: string) {
    if (confirm("Remover este serviço?")) persist(services.filter((s) => s.id !== id));
  }

  function fmt(n: number) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Serviços</h2>
          <p className="text-[#A1A1AA] text-sm mt-0.5">{services.length} serviço{services.length !== 1 ? "s" : ""} cadastrado{services.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((s) => (
          <div key={s.id} className="bg-[#111113] border border-[#27272A] rounded-xl p-4 hover:border-[#3F3F46] transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 flex items-center justify-center shrink-0">
                  <Wrench size={15} className="text-[#F97316]" />
                </div>
                <span className="font-semibold text-sm truncate">{s.name}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(s)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/15 text-[#A1A1AA] hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            {s.description && <p className="text-[#A1A1AA] text-xs mb-3 line-clamp-2">{s.description}</p>}
            <div className="flex items-center justify-between pt-3 border-t border-[#27272A]">
              <span className="text-[#F97316] font-bold">{fmt(s.price)}</span>
              <span className="text-[#52525B] text-xs">{s.duration < 60 ? `${s.duration}min` : `${s.duration / 60}h`}</span>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-[#52525B]">
            <Wrench size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Nenhum serviço cadastrado</p>
            <button onClick={openAdd} className="mt-3 text-[#F97316] text-sm hover:underline">Adicionar primeiro serviço</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
              <h3 className="font-bold">{modal === "add" ? "Novo Serviço" : "Editar Serviço"}</h3>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#27272A] transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Nome do Serviço *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Lavagem Completa" className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Preço (R$)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Duração (min)</label>
                  <input type="number" min="15" step="15" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })} className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Descrição</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Detalhes do serviço..." className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors resize-none" />
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
