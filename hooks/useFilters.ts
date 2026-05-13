"use client";

import { useCallback, useMemo } from "react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import type { LicitacaoFilters } from "@/types";

export function useFilters() {
  const [dataInicial, setDataInicial] = useQueryState(
    "dataInicial",
    parseAsString.withDefault("")
  );
  const [dataFinal, setDataFinal] = useQueryState(
    "dataFinal",
    parseAsString.withDefault("")
  );
  const [objeto, setObjeto] = useQueryState("objeto", parseAsString.withDefault(""));
  const [uf, setUf] = useQueryState("uf", parseAsString.withDefault(""));
  const [municipios, setMunicipios] = useQueryState(
    "municipios",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [disputas, setDisputas] = useQueryState(
    "disputas",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [modalidades, setModalidades] = useQueryState(
    "modalidades",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const filters: LicitacaoFilters = useMemo(
    () => ({
      dataInicial: dataInicial || undefined,
      dataFinal: dataFinal || undefined,
      objeto: objeto || undefined,
      uf: uf || undefined,
      municipios: municipios.length ? municipios : undefined,
      disputas: disputas.length ? disputas : undefined,
      modalidades: modalidades.length ? modalidades : undefined,
    }),
    [dataInicial, dataFinal, objeto, uf, municipios, disputas, modalidades]
  );

  const hasActiveFilters = useMemo(
    () =>
      !!(
        dataInicial ||
        dataFinal ||
        objeto ||
        uf ||
        municipios.length ||
        disputas.length ||
        modalidades.length
      ),
    [dataInicial, dataFinal, objeto, uf, municipios, disputas, modalidades]
  );

  const clearFilters = useCallback(async () => {
    await Promise.all([
      setDataInicial(null),
      setDataFinal(null),
      setObjeto(null),
      setUf(null),
      setMunicipios(null),
      setDisputas(null),
      setModalidades(null),
    ]);
  }, [setDataInicial, setDataFinal, setObjeto, setUf, setMunicipios, setDisputas, setModalidades]);

  return {
    filters,
    hasActiveFilters,
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
    clearFilters,
  };
}
