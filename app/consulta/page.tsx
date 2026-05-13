"use client";

import * as React from "react";
import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { FilterPanel } from "@/components/consulta/FilterPanel";
import { DataTable } from "@/components/consulta/DataTable";
import { DetailModal } from "@/components/consulta/DetailModal";
import { useConsulta } from "@/hooks/useConsulta";
import { useFilters } from "@/hooks/useFilters";
import { formatDateTime } from "@/lib/utils";
import type { LicitacaoRow } from "@/types";

function ConsultaContent() {
  const filterState = useFilters();
  const { rows, total, lastUpdate, filterOptions, isLoading, isFetching, isError, handleRefresh } =
    useConsulta(filterState.filters);

  const [selectedRow, setSelectedRow] = React.useState<LicitacaoRow | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Consulta de Licitações</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pesquise e filtre os processos licitatórios disponíveis.
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isFetching}
            variant="outline"
            className="gap-2 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Atualizar Dados
          </Button>
        </div>

        <FilterPanel filterState={filterState} filterOptions={filterOptions} />

        <DataTable
          rows={rows}
          total={total}
          isLoading={isLoading}
          isError={isError}
          onViewDetail={setSelectedRow}
        />

        <DetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      </main>

      <footer className="border-t border-border/60 bg-muted/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {lastUpdate
                ? `Última atualização dos dados: ${formatDateTime(lastUpdate)}`
                : "Carregando informações de atualização..."}
            </span>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Atualizando...
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ConsultaPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    }>
      <ConsultaContent />
    </React.Suspense>
  );
}
