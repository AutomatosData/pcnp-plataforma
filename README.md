# PCNP Plataforma — Consulta de Licitações

Plataforma web moderna para consulta de processos licitatórios armazenados em Google Sheets.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS** + shadcn/ui
- **TanStack Query** (cache e revalidação)
- **nuqs** (filtros persistidos na URL)
- **Google Sheets API** (via conta de serviço)
- **date-fns** (formatação de datas)
- **sonner** (toasts)
- **next-themes** (dark mode)

## Funcionalidades

- Leitura de dados diretamente do Google Sheets
- Filtros avançados simultâneos (data, objeto, UF, município, modalidade, disputa)
- Tabela com paginação, ordenação e skeleton loading
- Modal de detalhes por registro
- Exportação CSV com BOM (compatível com Excel)
- Atualização manual com verificação inteligente de cache
- Footer com última atualização (célula `Atualização!A1`)
- Compartilhamento de filtros via URL
- Dark mode automático
- Responsivo

## Estrutura

```
/app
  /api/consulta       → API route principal (dados + filtros)
  /api/last-update    → API route para verificar atualização
  /consulta           → Página de consulta
  layout.tsx
  page.tsx            → Landing page
  providers.tsx       → QueryClient + Theme + Toaster + Nuqs

/components
  /ui                 → Componentes base (Button, Card, Badge, etc.)
  /consulta           → FilterPanel, DataTable, DetailModal
  /layout             → Navbar

/hooks
  useConsulta.ts      → Busca dados + lógica de refresh
  useFilters.ts       → Estado dos filtros sincronizado com URL

/services
  googleSheets.ts     → Integração Google Sheets API

/types
  index.ts            → Tipagens globais

/lib
  utils.ts            → cn, formatDate, formatCurrency, exportToCSV
```

## Configuração

### 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
```

> **Importante:** A chave privada deve ter os `\n` literais (não quebras de linha reais).

### 2. Instalação

```bash
npm install
```

### 3. Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Deploy na Vercel

### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Via GitHub

1. Suba o projeto para um repositório GitHub (o arquivo `pcnp-credencials.json` está no `.gitignore`)
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repositório
3. Configure as variáveis de ambiente no painel da Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SPREADSHEET_ID`
4. Clique em **Deploy**

> **Atenção com `GOOGLE_PRIVATE_KEY` na Vercel:** Cole o valor com as aspas `"..."` incluídas, ou use o formato raw com `\n` mantidos.

## Planilha esperada

| Aba | Conteúdo |
|-----|----------|
| `Consulta` | Dados a partir da linha 2. Colunas A–K: Abertura, Encerramento, Objeto, Valor Estimado, Unidade, CNPJ, UF, Município, Processo, Modalidade, Disputa |
| `Atualização` | Célula A1 com timestamp de última atualização automática |

## Segurança

- Credenciais Google nunca expostas no frontend
- Apenas as API routes do Next.js acessam o Google Sheets
- `.env.local` e `pcnp-credencials.json` no `.gitignore`
