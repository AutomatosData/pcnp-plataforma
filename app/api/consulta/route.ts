import { NextRequest, NextResponse } from "next/server";
import { getConsultaRows, getLastUpdateValue } from "@/services/googleSheets";
import type { LicitacaoFilters, LicitacaoRow } from "@/types";
import { parse, isValid, isAfter, isBefore, startOfDay } from "date-fns";

let cachedRows: LicitacaoRow[] | null = null;
let cachedLastUpdate: string | null = null;

function parseRowDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null;
  const formats = ["dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
  for (const fmt of formats) {
    const d = parse(dateStr.trim(), fmt, new Date());
    if (isValid(d)) return d;
  }
  return null;
}

function applyFilters(rows: LicitacaoRow[], filters: LicitacaoFilters): LicitacaoRow[] {
  return rows.filter((row) => {
    if (filters.dataInicial) {
      const rowDate = parseRowDate(row.encerramento);
      const filterDate = parseRowDate(filters.dataInicial);
      if (rowDate && filterDate && isBefore(rowDate, startOfDay(filterDate))) return false;
    }

    if (filters.dataFinal) {
      const rowDate = parseRowDate(row.encerramento);
      const filterDate = parseRowDate(filters.dataFinal);
      if (rowDate && filterDate && isAfter(rowDate, startOfDay(filterDate))) return false;
    }

    if (filters.objeto?.trim()) {
      const search = filters.objeto.toLowerCase().trim();
      if (!row.objeto.toLowerCase().includes(search)) return false;
    }

    if (filters.uf?.trim()) {
      if (row.uf.trim().toUpperCase() !== filters.uf.trim().toUpperCase()) return false;
    }

    if (filters.municipios?.length) {
      const lower = filters.municipios.map((m) => m.toLowerCase());
      if (!lower.includes(row.municipio.toLowerCase())) return false;
    }

    if (filters.disputas?.length) {
      const lower = filters.disputas.map((d) => d.toLowerCase());
      if (!lower.includes(row.disputa.toLowerCase())) return false;
    }

    if (filters.modalidades?.length) {
      const lower = filters.modalidades.map((m) => m.toLowerCase());
      if (!lower.includes(row.modalidade.toLowerCase())) return false;
    }

    return true;
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const forceRefresh = searchParams.get("refresh") === "true";

    const currentLastUpdate = await getLastUpdateValue();

    if (forceRefresh || !cachedRows || cachedLastUpdate !== currentLastUpdate) {
      cachedRows = await getConsultaRows();
      cachedLastUpdate = currentLastUpdate;
    }

    const filters: LicitacaoFilters = {
      dataInicial: searchParams.get("dataInicial") ?? undefined,
      dataFinal: searchParams.get("dataFinal") ?? undefined,
      objeto: searchParams.get("objeto") ?? undefined,
      uf: searchParams.get("uf") ?? undefined,
      municipios: searchParams.getAll("municipios"),
      disputas: searchParams.getAll("disputas"),
      modalidades: searchParams.getAll("modalidades"),
    };

    const filteredRows = applyFilters(cachedRows, filters);

    const ufs = [...new Set(cachedRows.map((r) => r.uf).filter(Boolean))].sort();
    const municipios = [...new Set(cachedRows.map((r) => r.municipio).filter(Boolean))].sort();
    const disputas = [...new Set(cachedRows.map((r) => r.disputa).filter(Boolean))].sort();
    const modalidades = [...new Set(cachedRows.map((r) => r.modalidade).filter(Boolean))].sort();

    return NextResponse.json({
      rows: filteredRows,
      total: filteredRows.length,
      lastUpdate: currentLastUpdate,
      cacheKey: currentLastUpdate,
      filterOptions: { ufs, municipios, disputas, modalidades },
    });
  } catch (error) {
    console.error("[API /consulta] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da planilha" },
      { status: 500 }
    );
  }
}
