"use client";

import * as React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  FileX,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LicitacaoRow, SortState } from "@/types";
import { formatDate, formatCurrency, exportToCSV } from "@/lib/utils";

interface DataTableProps {
  rows: LicitacaoRow[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  onViewDetail: (row: LicitacaoRow) => void;
}

const COLUMNS: { key: keyof LicitacaoRow; label: string; className?: string }[] = [
  { key: "encerramento", label: "Encerramento", className: "w-32" },
  { key: "abertura", label: "Abertura", className: "w-32" },
  { key: "objeto", label: "Objeto", className: "min-w-[280px]" },
  { key: "valorEstimado", label: "Valor Estimado", className: "w-36 text-right" },
  { key: "modalidade", label: "Modalidade", className: "w-40" },
  { key: "disputa", label: "Disputa", className: "w-32" },
  { key: "uf", label: "UF", className: "w-16" },
  { key: "municipio", label: "Município", className: "w-40" },
];

const PAGE_SIZES = [10, 25, 50, 100];

function SortIcon({ column, sort }: { column: keyof LicitacaoRow; sort: SortState }) {
  if (sort.column !== column) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return sort.direction === "asc" ? (
    <ChevronUp className="h-3 w-3 text-primary" />
  ) : (
    <ChevronDown className="h-3 w-3 text-primary" />
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/40">
          {COLUMNS.map((col) => (
            <td key={col.key} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
          <td className="px-4 py-3">
            <Skeleton className="h-8 w-20" />
          </td>
        </tr>
      ))}
    </>
  );
}

function getModalidadeVariant(modalidade: string): "default" | "secondary" | "outline" | "info" | "success" | "warning" {
  const lower = modalidade.toLowerCase();
  if (lower.includes("pregão")) return "info";
  if (lower.includes("concorrência")) return "warning";
  if (lower.includes("dispensa")) return "success";
  return "secondary";
}

export function DataTable({ rows, total, isLoading, isError, onViewDetail }: DataTableProps) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [sort, setSort] = React.useState<SortState>({ column: null, direction: "asc" });

  React.useEffect(() => {
    setPage(1);
  }, [rows]);

  const sortedRows = React.useMemo(() => {
    if (!sort.column) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sort.column!] ?? "";
      const bVal = b[sort.column!] ?? "";
      const cmp = aVal.localeCompare(bVal, "pt-BR", { sensitivity: "base", numeric: true });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [rows, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const paginatedRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col: keyof LicitacaoRow) => {
    setSort((prev) => ({
      column: col,
      direction: prev.column === col && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleExport = () => {
    exportToCSV(
      sortedRows.map((r) => ({
        Abertura: r.abertura,
        Encerramento: r.encerramento,
        Objeto: r.objeto,
        "Valor Estimado": r.valorEstimado,
        Unidade: r.unidade,
        CNPJ: r.cnpj,
        UF: r.uf,
        Município: r.municipio,
        Processo: r.processo,
        Modalidade: r.modalidade,
        Disputa: r.disputa,
      })),
      `pcnp-licitacoes-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive/60 mb-3" />
        <p className="font-medium text-destructive">Erro ao carregar dados</p>
        <p className="text-sm text-muted-foreground mt-1">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>
                <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span>
                {" "}registro{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
              </>
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isLoading || rows.length === 0}
          className="h-8 text-xs gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/60 transition-colors select-none ${col.className ?? ""}`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon column={col.key} sort={sort} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-24">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton rows={pageSize} />
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-16 text-center">
                    <FileX className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="font-medium text-muted-foreground">Nenhum registro encontrado</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      Tente ajustar os filtros aplicados.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-4 py-3 text-sm font-medium tabular-nums">
                      {formatDate(row.encerramento)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">
                      {formatDate(row.abertura)}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-sm">
                      <span className="line-clamp-2 leading-snug" title={row.objeto}>
                        {row.objeto || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">
                      {row.valorEstimado ? formatCurrency(row.valorEstimado) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {row.modalidade ? (
                        <Badge variant={getModalidadeVariant(row.modalidade)} className="text-xs whitespace-nowrap">
                          {row.modalidade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {row.disputa || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {row.uf || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {row.municipio || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(row)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && paginatedRows.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Linhas por página:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground mr-2">
              Página <span className="font-medium text-foreground">{page}</span> de{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
