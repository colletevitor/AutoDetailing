# AutoDetailing Pro

Sistema de gestão para estética automotiva com login, banco de dados na nuvem e acesso multi-dispositivo.

## Stack
- **Next.js 14** — framework
- **Supabase** — banco PostgreSQL + autenticação
- **Vercel** — hospedagem

---

## ▶ Setup completo (passo a passo)

### 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta grátis
2. Clique em **New Project**
3. Dê um nome (ex: `autodetailing`) e crie uma senha forte para o banco
4. Aguarde o projeto iniciar (~1 minuto)

### 2. Criar as tabelas

1. No painel do Supabase, clique em **SQL Editor** no menu lateral
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run**

### 3. Pegar as credenciais

No painel do Supabase, vá em **Settings → API**:
- Copie a **Project URL** (ex: `https://xyzxyz.supabase.co`)
- Copie a **anon public key** (chave longa)

### 4. Cadastrar os gerentes

1. No Supabase, vá em **Authentication → Users**
2. Clique em **Add User → Create new user**
3. Informe o email e senha de cada gerente
4. Repita para cada pessoa (máximo 5)

### 5. Configurar variáveis no Vercel

1. No Vercel, abra seu projeto → **Settings → Environment Variables**
2. Adicione as duas variáveis:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | sua Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sua anon key |

3. Clique em **Save**
4. Vá em **Deployments** e clique em **Redeploy**

### 6. Pronto!

Acesse o site, faça login com o email/senha do gerente e tudo estará sincronizado em tempo real entre celular, tablet e PC.

---

## Desenvolvimento local

Crie um arquivo `.env.local` na raiz com:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

Depois:
```bash
npm install
npm run dev
```
