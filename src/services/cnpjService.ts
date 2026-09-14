import { CnpjResponse } from '../types/cnpj';

export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export function formatCnpj(value: string): string {
  const digits = cleanCnpj(value).slice(0, 14);
  let formatted = '';
  if (digits.length > 0) formatted += digits.substring(0, Math.min(2, digits.length));
  if (digits.length > 2) formatted += '.' + digits.substring(2, Math.min(5, digits.length));
  if (digits.length > 5) formatted += '.' + digits.substring(5, Math.min(8, digits.length));
  if (digits.length > 8) formatted += '/' + digits.substring(8, Math.min(12, digits.length));
  if (digits.length > 12) formatted += '-' + digits.substring(12, 14);
  return formatted;
}

export function formatCep(cep?: string): string {
  if (!cep) return 'Não informado';
  const clean = cep.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return cep;
}

export function formatPhone(phone?: string): string {
  if (!phone) return 'Não informado';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  return phone;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Não informado';
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateString;
}

export const PRESET_COMPANIES: { label: string; cnpj: string; tag: string }[] = [
  { label: 'Banco do Brasil S.A.', cnpj: '00000000000191', tag: 'Financeiro' },
  { label: 'Petrobras', cnpj: '33000167000101', tag: 'Energia' },
  { label: 'Google Brasil Internet Ltda', cnpj: '06990590000123', tag: 'Tecnologia' },
  { label: 'Nubank (Nu Pagamentos)', cnpj: '18236120000158', tag: 'Fintech' },
  { label: 'Magazine Luiza S.A.', cnpj: '47960950000121', tag: 'Varejo' },
];

export async function fetchCnpj(rawCnpj: string): Promise<CnpjResponse> {
  const digits = cleanCnpj(rawCnpj);
  
  if (digits.length !== 14) {
    throw new Error('O CNPJ deve conter exatamente 14 dígitos numéricos.');
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`CNPJ ${formatCnpj(digits)} não foi encontrado na base de dados da Receita Federal.`);
      }
      if (response.status === 400) {
        throw new Error(`O CNPJ informado (${formatCnpj(digits)}) é inválido segundo as regras de dígitos verificadores.`);
      }
      throw new Error(`Erro na consulta (Código ${response.status}). Tente novamente mais tarde.`);
    }

    const data = await response.json();
    return data as CnpjResponse;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Falha de conexão com a API de consulta. Verifique sua rede.');
  }
}
