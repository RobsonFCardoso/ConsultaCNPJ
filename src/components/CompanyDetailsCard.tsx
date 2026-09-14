import React, { useState } from 'react';
import { CnpjResponse } from '../types/cnpj';
import { formatCnpj, formatCep, formatPhone, formatDate } from '../services/cnpjService';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  Scale, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check 
} from 'lucide-react';

interface Props {
  empresa: CnpjResponse;
  isDark?: boolean;
}

export const CompanyDetailsCard: React.FC<Props> = ({ empresa, isDark = false }) => {
  const [showAllSecundarias, setShowAllSecundarias] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const statusCadastral = (empresa.descricao_situacao_cadastral || 'NÃO INFORMADA').toUpperCase();
  const isAtiva = statusCadastral === 'ATIVA';
  const isBaixada = ['BAIXADA', 'INAPTA', 'NULA'].includes(statusCadastral);

  const statusBadgeBg = isAtiva 
    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800' 
    : isBaixada 
      ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800' 
      : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const subtextCol = isDark ? 'text-slate-400' : 'text-slate-500';
  const dividerCol = isDark ? 'border-slate-800' : 'border-slate-100';

  const logradouroCompleto = [
    empresa.descricao_tipo_de_logradouro,
    empresa.logradouro
  ].filter(Boolean).join(' ');

  const telefones = [empresa.ddd_telefone_1, empresa.ddd_telefone_2]
    .filter(Boolean)
    .map(t => formatPhone(t))
    .join(' / ');

  const secundarias = empresa.cnaes_secundarios || [];
  const displayedSecundarias = showAllSecundarias ? secundarias : secundarias.slice(0, 3);

  return (
    <div className="space-y-4 text-sm">
      {/* 1. Identificação Principal & Porte */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-inherit">
          <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-5 h-5 shrink-0" />
            <span>Identificação da Empresa</span>
          </div>
          <button
            onClick={() => copyToClipboard(empresa.cnpj, 'cnpj')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Copiar CNPJ"
          >
            {copiedField === 'cnpj' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{formatCnpj(empresa.cnpj)}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="md:col-span-2">
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Razão Social / Nome</span>
            <span className="font-semibold text-base tracking-tight leading-snug">{empresa.razao_social || 'Não informada'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Nome Fantasia</span>
            <span className="font-medium">{empresa.nome_fantasia || 'Não informado'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Data de Abertura</span>
            <span className="font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(empresa.data_inicio_atividade)}
            </span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Porte da Empresa</span>
            <span className="inline-flex items-center gap-1 font-medium mt-0.5">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              {empresa.descricao_porte || empresa.porte || 'Não especificado'}
            </span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Ente Federativo Responsável</span>
            <span className="font-medium">{empresa.ente_federativo_responsavel || 'Não se aplica'}</span>
          </div>
        </div>
      </div>

      {/* 2. Situação Cadastral & Situação Especial */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-inherit">
          <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400">
            {isAtiva ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />}
            <span>Situação Cadastral</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeBg}`}>
            {statusCadastral}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Data da Situação Cadastral</span>
            <span className="font-medium">{formatDate(empresa.data_situacao_cadastral)}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Motivo da Situação Cadastral</span>
            <span className="font-medium">
              {empresa.descricao_motivo_situacao_cadastral || (empresa.motivo_situacao_cadastral !== undefined ? String(empresa.motivo_situacao_cadastral) : 'Sem motivo informado')}
            </span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Situação Especial</span>
            <span className="font-medium">{empresa.situacao_especial || 'Nenhuma'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Data da Situação Especial</span>
            <span className="font-medium">{formatDate(empresa.data_situacao_especial)}</span>
          </div>
        </div>
      </div>

      {/* 3. Atividades Econômicas (CNAEs) */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400 pb-3 mb-3 border-b border-inherit">
          <Briefcase className="w-5 h-5 shrink-0" />
          <span>Atividades Econômicas</span>
        </div>

        <div className="space-y-3">
          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Atividade Econômica Principal</span>
            <div className="mt-1 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <span className="font-semibold text-indigo-900 dark:text-indigo-200">
                CNAE {empresa.cnae_fiscal}:
              </span>{' '}
              <span className="text-slate-800 dark:text-slate-200">
                {empresa.cnae_fiscal_descricao || 'Não informada'}
              </span>
            </div>
          </div>

          <div className={`pt-2 border-t ${dividerCol}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium uppercase tracking-wider ${subtextCol}`}>
                Atividades Secundárias ({secundarias.length})
              </span>
              {secundarias.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllSecundarias(!showAllSecundarias)}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  {showAllSecundarias ? (
                    <>
                      <span>Ver menos</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Ver todas ({secundarias.length})</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

            {secundarias.length === 0 ? (
              <p className={`text-xs italic ${subtextCol}`}>Nenhuma atividade secundária cadastrada.</p>
            ) : (
              <ul className="space-y-1.5">
                {displayedSecundarias.map((item, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-500 font-mono font-semibold shrink-0">• {item.codigo}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.descricao}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 4. Natureza Jurídica */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400 pb-3 mb-3 border-b border-inherit">
          <Scale className="w-5 h-5 shrink-0" />
          <span>Natureza Jurídica</span>
        </div>

        <div>
          <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Código e Descrição</span>
          <div className="mt-1 font-medium">
            {empresa.codigo_natureza_juridica ? (
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs mr-2 font-semibold">
                {empresa.codigo_natureza_juridica}
              </span>
            ) : null}
            <span>{empresa.natureza_juridica || 'Não informada'}</span>
          </div>
        </div>
      </div>

      {/* 5. Endereço e Localização */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400 pb-3 mb-3 border-b border-inherit">
          <MapPin className="w-5 h-5 shrink-0" />
          <span>Endereço e Localização</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="md:col-span-2">
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Logradouro</span>
            <span className="font-medium">{logradouroCompleto || 'Não informado'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Número</span>
            <span className="font-medium">{empresa.numero || 'S/N'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Complemento</span>
            <span className="font-medium">{empresa.complemento || 'Não informado'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Bairro</span>
            <span className="font-medium">{empresa.bairro || 'Não informado'}</span>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>CEP</span>
            <span className="font-medium font-mono">{formatCep(empresa.cep)}</span>
          </div>

          <div className="md:col-span-3">
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Município / UF</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {empresa.municipio ? `${empresa.municipio} - ${empresa.uf}` : 'Não informado'}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Contatos & Comunicação */}
      <div className={`p-4 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 font-semibold text-base text-indigo-600 dark:text-indigo-400 pb-3 mb-3 border-b border-inherit">
          <Phone className="w-5 h-5 shrink-0" />
          <span>Contatos e Comunicação</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Endereço Eletrônico (E-mail)</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {empresa.email ? (
                <a
                  href={`mailto:${empresa.email}`}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                >
                  {empresa.email.toLowerCase()}
                </a>
              ) : (
                <span className="font-medium text-slate-400">Não informado</span>
              )}
            </div>
          </div>

          <div>
            <span className={`block text-xs font-medium uppercase tracking-wider ${subtextCol}`}>Telefone</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium">{telefones || 'Não informado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
