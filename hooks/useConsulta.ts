"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { parse, isValid, isAfter, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import type { LicitacaoFilters, LicitacaoRow, FilterOptions } from "@/types";

interface ConsultaApiResponse {
  rows: LicitacaoRow[];
  total: number;
  lastUpdate: string;
  cacheKey: string;
  filterOptions: FilterOptions;
}

async function fetchConsulta(refresh = false): Promise<ConsultaApiResponse> {
  const url = `/api/consulta${refresh ? "?refresh=true" : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Erro ao buscar dados");
  }
  return res.json();
}

async function fetchLastUpdate(): Promise<string> {
  const res = await fetch("/api/last-update");
  if (!res.ok) throw new Error("Erro ao buscar última atualização");
  const data = await res.json();
  return data.lastUpdate ?? "";
}

function parseRowDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null;
  const cleaned = dateStr.trim();

  // ISO 8601 com hora: 2025-09-04T08:30:00
  if (cleaned.includes("T")) {
    const d = new Date(cleaned);
    if (isValid(d)) return d;
  }

  const formats = ["dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy", "yyyy-MM-dd HH:mm:ss"];
  for (const fmt of formats) {
    const d = parse(cleaned, fmt, new Date());
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
    if (filters.palavras?.length) {
      const objetoLower = row.objeto.toLowerCase();
      if (!filters.palavras.some((p) => objetoLower.includes(p.toLowerCase().trim()))) return false;
    }
    if (filters.ufs?.length) {
      const lower = filters.ufs.map((u) => u.toUpperCase());
      if (!lower.includes(row.uf.trim().toUpperCase())) return false;
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

export function useConsulta(filters: LicitacaoFilters) {
  const queryClient = useQueryClient();
  const lastKnownCacheKey = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ["consulta"],
    queryFn: () => fetchConsulta(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (query.data?.cacheKey) {
    lastKnownCacheKey.current = query.data.cacheKey;
  }

  const allRows = query.data?.rows ?? [];

  const filteredRows = useMemo(() => applyFilters(allRows, filters), [allRows, filters]);

  const handleRefresh = useCallback(async () => {
    const toastId = toast.loading("Verificando atualizações...");
    try {
      const currentKey = await fetchLastUpdate();
      if (currentKey === lastKnownCacheKey.current) {
        toast.dismiss(toastId);
        toast.info("Os dados já estão atualizados");
        return;
      }

      const newData = await fetchConsulta(true);
      queryClient.setQueryData(["consulta"], newData);
      lastKnownCacheKey.current = newData.cacheKey;
      toast.dismiss(toastId);
      toast.success("Dados atualizados com sucesso!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Erro ao verificar atualizações");
    }
  }, [queryClient]);

  return {
    rows: filteredRows,
    total: filteredRows.length,
    lastUpdate: query.data?.lastUpdate ?? "",
    filterOptions: query.data?.filterOptions ?? {
      ufs: [],
      municipios: [],
      disputas: [],
      modalidades: [],
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    handleRefresh,
  };
}
