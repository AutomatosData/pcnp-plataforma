import { NextRequest, NextResponse } from "next/server";
import { getConsultaRows, getLastUpdateValue } from "@/services/googleSheets";
import type { LicitacaoRow } from "@/types";

let cachedRows: LicitacaoRow[] | null = null;
let cachedLastUpdate: string | null = null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const forceRefresh = searchParams.get("refresh") === "true";

    const currentLastUpdate = await getLastUpdateValue();

    if (forceRefresh || !cachedRows || cachedLastUpdate !== currentLastUpdate) {
      cachedRows = await getConsultaRows();
      cachedLastUpdate = currentLastUpdate;
    }

    const ufs = [...new Set(cachedRows.map((r) => r.uf).filter(Boolean))].sort();
    const municipios = [...new Set(cachedRows.map((r) => r.municipio).filter(Boolean))].sort();
    const disputas = [...new Set(cachedRows.map((r) => r.disputa).filter(Boolean))].sort();
    const modalidades = [...new Set(cachedRows.map((r) => r.modalidade).filter(Boolean))].sort();

    return NextResponse.json({
      rows: cachedRows,
      total: cachedRows.length,
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
