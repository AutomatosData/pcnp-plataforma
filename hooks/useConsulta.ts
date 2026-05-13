"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import type { LicitacaoFilters, LicitacaoRow, FilterOptions } from "@/types";

interface ConsultaApiResponse {
  rows: LicitacaoRow[];
  total: number;
  lastUpdate: string;
  cacheKey: string;
  filterOptions: FilterOptions;
}

function buildQueryString(filters: LicitacaoFilters): string {
  const params = new URLSearchParams();
  if (filters.dataInicial) params.set("dataInicial", filters.dataInicial);
  if (filters.dataFinal) params.set("dataFinal", filters.dataFinal);
  if (filters.objeto) params.set("objeto", filters.objeto);
  if (filters.uf) params.set("uf", filters.uf);
  filters.municipios?.forEach((m) => params.append("municipios", m));
  filters.disputas?.forEach((d) => params.append("disputas", d));
  filters.modalidades?.forEach((m) => params.append("modalidades", m));
  return params.toString();
}

async function fetchConsulta(
  filters: LicitacaoFilters,
  refresh = false
): Promise<ConsultaApiResponse> {
  const qs = buildQueryString(filters);
  const url = `/api/consulta${qs ? `?${qs}` : ""}${refresh ? `${qs ? "&" : "?"}refresh=true` : ""}`;
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

export function useConsulta(filters: LicitacaoFilters) {
  const queryClient = useQueryClient();
  const lastKnownCacheKey = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ["consulta", filters],
    queryFn: () => fetchConsulta(filters),
    staleTime: 1000 * 60 * 5,
  });

  if (query.data?.cacheKey) {
    lastKnownCacheKey.current = query.data.cacheKey;
  }

  const handleRefresh = useCallback(async () => {
    const toastId = toast.loading("Verificando atualizações...");
    try {
      const currentKey = await fetchLastUpdate();
      if (currentKey === lastKnownCacheKey.current) {
        toast.dismiss(toastId);
        toast.info("Os dados já estão atualizados");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["consulta"] });
      const newData = await fetchConsulta(filters, true);
      queryClient.setQueryData(["consulta", filters], newData);
      lastKnownCacheKey.current = newData.cacheKey;
      toast.dismiss(toastId);
      toast.success("Dados atualizados com sucesso!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Erro ao verificar atualizações");
    }
  }, [filters, queryClient]);

  return {
    data: query.data,
    rows: query.data?.rows ?? [],
    total: query.data?.total ?? 0,
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
