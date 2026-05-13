"use client";

import { useCallback, useMemo } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
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
  const [palavras, setPalavras] = useQueryState(
    "palavras",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [ufs, setUfs] = useQueryState(
    "ufs",
    parseAsArrayOf(parseAsString).withDefault([])
  );
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
      palavras: palavras.length ? palavras : undefined,
      ufs: ufs.length ? ufs : undefined,
      municipios: municipios.length ? municipios : undefined,
      disputas: disputas.length ? disputas : undefined,
      modalidades: modalidades.length ? modalidades : undefined,
    }),
    [dataInicial, dataFinal, palavras, ufs, municipios, disputas, modalidades]
  );

  const hasActiveFilters = useMemo(
    () =>
      !!(
        dataInicial ||
        dataFinal ||
        palavras.length ||
        ufs.length ||
        municipios.length ||
        disputas.length ||
        modalidades.length
      ),
    [dataInicial, dataFinal, palavras, ufs, municipios, disputas, modalidades]
  );

  const clearFilters = useCallback(async () => {
    await Promise.all([
      setDataInicial(null),
      setDataFinal(null),
      setPalavras(null),
      setUfs(null),
      setMunicipios(null),
      setDisputas(null),
      setModalidades(null),
    ]);
  }, [setDataInicial, setDataFinal, setPalavras, setUfs, setMunicipios, setDisputas, setModalidades]);

  return {
    filters,
    hasActiveFilters,
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
    clearFilters,
  };
}
