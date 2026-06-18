# AutoDetailing Pro

Sistema de gestão para estética automotiva.

## Funcionalidades

- **Agenda** — Agendar carros por dia, com horário, cliente, placa e modelo
- **Status** — Mudar status do serviço: Aguardando → Em Andamento → Concluído / Cancelado
- **Funcionários** — Cadastro de funcionários com cargo e cor de identificação
- **Serviços** — Catálogo de serviços com preço e duração
- **Rendimentos** — Receita do dia, semana e mês (baseado em serviços concluídos)
- **Histórico** — Lista completa de serviços finalizados

## Deploy no Vercel

### Opção 1 — Via GitHub (Recomendado)

1. Crie um repositório no GitHub e faça push deste código
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Importe o repositório do GitHub
4. Clique em **Deploy** — o Vercel detecta Next.js automaticamente

### Opção 2 — Via CLI

```bash
npm install -g vercel
cd autodetailing-app
npm install
vercel
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- lucide-react (ícones)
- localStorage (dados persistem no navegador)
