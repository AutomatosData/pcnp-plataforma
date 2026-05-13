"use client";

import * as React from "react";
import { X, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FilterOptions } from "@/types";
import type { useFilters } from "@/hooks/useFilters";

type FilterState = ReturnType<typeof useFilters>;

interface FilterPanelProps {
  filterState: FilterState;
  filterOptions: FilterOptions;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

function MultiSelect({ label, options, selected, onChange, placeholder }: MultiSelectProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <div className="relative">
        <Select
          value=""
          onValueChange={toggle}
        >
          <SelectTrigger className="h-9 text-sm">
            <span className="text-muted-foreground text-sm">
              {selected.length > 0 ? `${selected.length} selecionado(s)` : placeholder}
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className={selected.includes(opt) ? "bg-primary/10 font-medium" : ""}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${selected.includes(opt) ? "bg-primary" : "bg-transparent border border-muted-foreground"}`}
                  />
                  {opt}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selected.map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => toggle(v)}
            >
              {v}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterPanel({ filterState, filterOptions }: FilterPanelProps) {
  const {
    dataInicial,
    dataFinal,
    objeto,
    uf,
    municipios,
    disputas,
    modalidades,
    setDataInicial,
    setDataFinal,
    setObjeto,
    setUf,
    setMunicipios,
    setDisputas,
    setModalidades,
    hasActiveFilters,
    clearFilters,
  } = filterState;

  const [debounceTimer, setDebounceTimer] = React.useState<ReturnType<typeof setTimeout> | null>(null);
  const [localObjeto, setLocalObjeto] = React.useState(objeto);

  React.useEffect(() => {
    setLocalObjeto(objeto);
  }, [objeto]);

  const handleObjetoChange = (value: string) => {
    setLocalObjeto(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setObjeto(value || null);
    }, 400);
    setDebounceTimer(timer);
  };

  const municipioOptions = uf
    ? filterOptions.municipios.filter((m) => {
        return true;
      })
    : filterOptions.municipios;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="default" className="text-xs px-1.5 py-0 h-5">
                Ativos
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Encerramento de
            </Label>
            <Input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value || null)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Encerramento até
            </Label>
            <Input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value || null)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pesquisar objeto
            </Label>
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Digite para pesquisar..."
                value={localObjeto}
                onChange={(e) => handleObjetoChange(e.target.value)}
                className="h-9 text-sm pl-8"
              />
              {localObjeto && (
                <button
                  onClick={() => handleObjetoChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Estado (UF)
            </Label>
            <Select
              value={uf || ""}
              onValueChange={(v) => setUf(v === "__all__" ? null : v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os estados</SelectItem>
                {filterOptions.ufs.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <MultiSelect
            label="Município"
            options={municipioOptions}
            selected={municipios}
            onChange={(v) => setMunicipios(v.length ? v : null)}
            placeholder="Todos os municípios"
          />

          <MultiSelect
            label="Modalidade"
            options={filterOptions.modalidades}
            selected={modalidades}
            onChange={(v) => setModalidades(v.length ? v : null)}
            placeholder="Todas as modalidades"
          />

          <MultiSelect
            label="Disputa"
            options={filterOptions.disputas}
            selected={disputas}
            onChange={(v) => setDisputas(v.length ? v : null)}
            placeholder="Todos os tipos"
          />
        </div>
      </CardContent>
    </Card>
  );
}
