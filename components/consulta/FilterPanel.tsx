"use client";

import * as React from "react";
import { X, SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        >
          <span className="text-muted-foreground truncate">
            {selected.length > 0 ? `${selected.length} selecionado(s)` : placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full min-w-[200px] rounded-md border border-border bg-popover shadow-md">
            {options.length > 6 && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full h-7 pl-7 pr-2 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">Nenhuma opção</p>
              ) : (
                filtered.map((opt) => {
                  const checked = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => toggle(opt)}
                      className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-muted/60 transition-colors ${checked ? "font-medium text-primary" : ""}`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "bg-primary border-primary" : "border-muted-foreground"}`}
                      >
                        {checked && (
                          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" />
                          </svg>
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })
              )}
            </div>
            {selected.length > 0 && (
              <div className="border-t border-border p-1.5">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onChange([])}
                  className="w-full text-xs text-muted-foreground hover:text-destructive py-1 transition-colors"
                >
                  Limpar seleção
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
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

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

function TagInput({ label, tags, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = () => {
    const val = input.trim();
    if (!val) return;
    if (!tags.map((t) => t.toLowerCase()).includes(val.toLowerCase())) {
      onChange([...tags, val]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <div
        className="min-h-9 w-full rounded-md border border-input bg-background px-2 py-1 flex flex-wrap gap-1 items-center cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 bg-primary/10 text-primary text-xs font-medium rounded px-1.5 py-0.5 shrink-0"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="ml-0.5 hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground py-0.5"
        />
      </div>
      {tags.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded border border-border text-[10px]">Enter</kbd> para adicionar · resultados contêm <strong>qualquer</strong> palavra · <X className="inline h-2.5 w-2.5" /> para remover
        </p>
      )}
    </div>
  );
}

export function FilterPanel({ filterState, filterOptions }: FilterPanelProps) {
  const {
    dataInicial,
    dataFinal,
    palavras,
    ufs,
    municipios,
    disputas,
    modalidades,
    setDataInicial,
    setDataFinal,
    setPalavras,
    setUfs,
    setMunicipios,
    setDisputas,
    setModalidades,
    hasActiveFilters,
    clearFilters,
  } = filterState;

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

          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 2xl:col-span-2">
            <TagInput
              label="Palavras no objeto"
              tags={palavras}
              onChange={(v) => setPalavras(v.length ? v : null)}
              placeholder="Digite e pressione Enter..."
            />
          </div>

          <MultiSelect
            label="Estado (UF)"
            options={filterOptions.ufs}
            selected={ufs}
            onChange={(v) => setUfs(v.length ? v : null)}
            placeholder="Todos os estados"
          />

          <MultiSelect
            label="Município"
            options={filterOptions.municipios}
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
