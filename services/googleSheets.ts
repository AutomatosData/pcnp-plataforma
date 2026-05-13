import { google } from "googleapis";
import type { LicitacaoRow } from "@/types";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;
const CONSULTA_RANGE = "Consulta!A2:K";
const UPDATE_RANGE = "Atualização!A1";

function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error("Missing Google credentials environment variables");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      private_key: privateKey,
      client_email: clientEmail,
    },
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
    }));
}
