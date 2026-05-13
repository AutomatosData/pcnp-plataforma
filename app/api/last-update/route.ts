import { NextResponse } from "next/server";
import { getLastUpdateValue } from "@/services/googleSheets";

export async function GET() {
  try {
    const lastUpdate = await getLastUpdateValue();
    return NextResponse.json({ lastUpdate });
  } catch (error) {
    console.error("[API /last-update] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar data de atualização" },
      { status: 500 }
    );
  }
}
