export interface LicitacaoRow {
  abertura: string;
  encerramento: string;
  objeto: string;
  valorEstimado: string;
  unidade: string;
  cnpj: string;
  uf: string;
  municipio: string;
  processo: string;
  modalidade: string;
  disputa: string;
  anoCompra: string;
  sequencialCompra: string;
}

export interface LicitacaoFilters {
  dataInicial?: string;
  dataFinal?: string;
  objeto?: string;
  uf?: string;
  municipios?: string[];
  disputas?: string[];
  modalidades?: string[];
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface SortState {
  column: keyof LicitacaoRow | null;
  direction: "asc" | "desc";
}

export interface ConsultaData {
  rows: LicitacaoRow[];
  total: number;
  lastUpdate: string;
  cacheKey: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface FilterOptions {
  ufs: string[];
  municipios: string[];
  disputas: string[];
  modalidades: string[];
}
