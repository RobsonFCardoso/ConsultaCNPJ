export interface CnaeSecundario {
  codigo: number;
  descricao: string;
}

export interface Socio {
  nome_socio: string;
  cnpj_cpf_do_socio?: string;
  qualificacao_socio?: string;
  data_entrada_sociedade?: string;
  faixa_etaria?: string;
}

export interface CnpjResponse {
  cnpj: string;
  identificador_matriz_filial?: number;
  descricao_identificador_matriz_filial?: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao_cadastral?: number | string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral?: string;
  motivo_situacao_cadastral?: number;
  descricao_motivo_situacao_cadastral?: string;
  nome_cidade_no_exterior?: string;
  codigo_natureza_juridica?: number;
  natureza_juridica?: string;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_de_logradouro?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio?: number;
  municipio: string;
  email?: string | null;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  porte?: string;
  descricao_porte?: string;
  capital_social?: number;
  opcao_pelo_simples?: boolean;
  opcao_pelo_mei?: boolean;
  ente_federativo_responsavel?: string;
  situacao_especial?: string;
  data_situacao_especial?: string | null;
  cnaes_secundarios?: CnaeSecundario[];
  qsa?: Socio[];
}

export type ScreenState = 
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: CnpjResponse }
  | { type: 'error'; message: string };
