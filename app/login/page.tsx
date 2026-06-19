"use client";
import { useState } from "react";
import { Car, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!username || !password) { setError("Preencha usuário e senha."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(data.error ?? "Usuário ou senha incorretos.");
    }
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center mb-4 shadow-lg shadow-[#F97316]/20">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">AutoDetailing <span className="text-[#F97316]">Pro</span></h1>
          <p className="text-[#52525B] text-sm mt-1">Acesso restrito a administradores</p>
        </div>

        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Usuário</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKey}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">Senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="w-full bg-[#F97316] hover:bg-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
