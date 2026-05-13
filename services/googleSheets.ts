import { google } from "googleapis";
import { createPrivateKey } from "crypto";
import type { LicitacaoRow } from "@/types";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;
const CONSULTA_RANGE = "Consulta!A2:M";
const UPDATE_RANGE = "Atualização!A1";

function normalizePrivateKey(raw: string): string {
  // Remove aspas externas e normaliza \n literais para quebras de linha reais
  let key = raw.replace(/^"|"$/g, "").replace(/\\n/g, "\n");

  // Converte PKCS#1 → PKCS#8 via crypto para compatibilidade com Node 18+ / OpenSSL 3
  try {
    const keyObj = createPrivateKey({ key, format: "pem" });
    return keyObj.export({ type: "pkcs8", format: "pem" }) as string;
  } catch {
    // Se já estiver em formato aceitável, retorna como está
    return key;
  }
}

function getAuthClient() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? "";
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!rawKey || !clientEmail) {
    throw new Error("Missing Google credentials environment variables");
  }

  const privateKey = normalizePrivateKey(rawKey);

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getLastUpdateValue(): Promise<string> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: UPDATE_RANGE,
  });

  return response.data.values?.[0]?.[0] ?? "";
}

export async function getConsultaRows(): Promise<LicitacaoRow[]> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: CONSULTA_RANGE,
  });

  const rawRows = response.data.values ?? [];

  return rawRows
    .filter((row) => row.some((cell) => String(cell ?? "").trim()))
    .map((row) => ({
      abertura: String(row[0] ?? ""),
      encerramento: String(row[1] ?? ""),
      objeto: String(row[2] ?? ""),
      valorEstimado: String(row[3] ?? ""),
      unidade: String(row[4] ?? ""),
      cnpj: String(row[5] ?? ""),
      uf: String(row[6] ?? ""),
      municipio: String(row[7] ?? ""),
      processo: String(row[8] ?? ""),
      modalidade: String(row[9] ?? ""),
      disputa: String(row[10] ?? ""),
      anoCompra: String(row[11] ?? ""),
      sequencialCompra: String(row[12] ?? ""),
    }));
}
