"use client";
import { useState } from "react";
import { Car, CalendarDays, Users, Wrench, TrendingUp, Menu, X, LogOut } from "lucide-react";
import AgendaTab from "./components/AgendaTab";
import ServicesTab from "./components/ServicesTab";
import EmployeesTab from "./components/EmployeesTab";
import RevenueTab from "./components/RevenueTab";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "agenda",    label: "Agenda",       icon: CalendarDays },
  { id: "revenue",   label: "Rendimentos",  icon: TrendingUp },
  { id: "services",  label: "Serviços",     icon: Wrench },
  { id: "employees", label: "Funcionários", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("agenda");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center shrink-0">
                <Car size={16} className="text-white" />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight">
                AutoDetailing <span className="text-[#F97316]">Pro</span>
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? "bg-[#F97316]/15 text-[#F97316]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]"}`}>
                  <Icon size={15} />{label}
                </button>
              ))}
              <button onClick={handleLogout} className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut size={15} /> Sair
              </button>
            </nav>

            <button className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#27272A] transition-colors" onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-[#27272A] bg-[#111113] pb-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setActiveTab(id); setMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === id ? "text-[#F97316] bg-[#F97316]/10" : "text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>
                <Icon size={18} />{label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#52525B] hover:text-red-400 transition-colors">
              <LogOut size={18} /> Sair
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeTab === "agenda"    && <AgendaTab />}
        {activeTab === "revenue"   && <RevenueTab />}
        {activeTab === "services"  && <ServicesTab />}
        {activeTab === "employees" && <EmployeesTab />}
      </main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111113] border-t border-[#27272A] grid grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setMenuOpen(false); }} className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors ${activeTab === id ? "text-[#F97316]" : "text-[#52525B]"}`}>
            <Icon size={20} />{label}
          </button>
        ))}
      </nav>
      <div className="h-16 sm:h-0" />
    </div>
  );
}
