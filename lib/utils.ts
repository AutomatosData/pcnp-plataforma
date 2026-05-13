import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const cleaned = dateStr.trim();

  // Tenta parse via Date nativo primeiro (cobre ISO 8601: 2025-09-04T08:30:00)
  const native = new Date(cleaned);
  if (isValid(native) && cleaned.includes("T")) {
    return format(native, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  const fmts = [
    "dd/MM/yyyy HH:mm:ss",
    "dd/MM/yyyy HH:mm",
    "yyyy-MM-dd HH:mm:ss",
    "dd/MM/yyyy",
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd-MM-yyyy",
  ];
  for (const fmt of fmts) {
    const parsed = parse(cleaned, fmt, new Date());
    if (isValid(parsed)) {
      const hasTime = fmt.includes("HH");
      return format(parsed, hasTime ? "dd/MM/yyyy 'às' HH:mm" : "dd/MM/yyyy", { locale: ptBR });
    }
  }
  return cleaned;
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-";
  const cleaned = dateStr.trim();
  const fmts = [
    "dd/MM/yyyy HH:mm:ss",
    "dd/MM/yyyy HH:mm",
    "yyyy-MM-dd HH:mm:ss",
    "yyyy-MM-dd'T'HH:mm:ss",
    "dd/MM/yyyy",
    "yyyy-MM-dd",
  ];
  for (const fmt of fmts) {
    const parsed = parse(cleaned, fmt, new Date());
    if (isValid(parsed)) {
      return format(parsed, "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
  }
  return cleaned;
}

export function formatCurrency(value: string): string {
  if (!value) return "-";
  const cleaned = value.replace(/[^\d,.]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function exportToCSV(rows: Record<string, string>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(";"),
    ...rows.map((row) =>
      headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(";")
    ),
  ].join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
