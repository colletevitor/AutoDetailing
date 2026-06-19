# AutoDetailing Pro

## Setup

### 1. Supabase (banco de dados)
1. Crie conta grátis em [supabase.com](https://supabase.com) → New Project
2. Vá em **SQL Editor → New Query**, cole o conteúdo de `supabase-schema.sql` e clique em **Run**
3. Vá em **Settings → API** e copie:
   - **Project URL**
   - **anon public key**

### 2. Vercel (variáveis de ambiente)
Em **Settings → Environment Variables** adicione:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key do Supabase |
| `ADMIN_USERNAME` | usuário desejado (ex: `admin`) |
| `ADMIN_PASSWORD` | senha desejada (ex: `admin123`) |

Depois vá em **Deployments → Redeploy**.

### 3. Pronto!
Acesse o site, faça login com o usuário/senha configurados e tudo estará sincronizado entre todos os dispositivos.

---

## Desenvolvimento local
Crie `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```
```bash
npm install && npm run dev
```
