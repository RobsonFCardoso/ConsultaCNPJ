import React, { useState } from 'react';
import { CnpjResponse, ScreenState } from '../types/cnpj';
import { cleanCnpj, formatCnpj, fetchCnpj, PRESET_COMPANIES } from '../services/cnpjService';
import { CompanyDetailsCard } from './CompanyDetailsCard';
import { 
  Search, 
  X, 
  AlertTriangle, 
  Building, 
  Sun, 
  Moon, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Props {
  initialCnpj?: string;
  onSelectCodeTab?: (tabId: string) => void;
}

export const AndroidEmulator: React.FC<Props> = ({ initialCnpj = '00000000000191' }) => {
  const [inputValue, setInputValue] = useState(formatCnpj(initialCnpj));
  const [state, setState] = useState<ScreenState>({ type: 'idle' });
  const [isDark, setIsDark] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = cleanCnpj(raw).slice(0, 14);
    setInputValue(formatCnpj(digits));
  };

  const handleSearch = async (cnpjToQuery?: string) => {
    const target = cnpjToQuery ? cleanCnpj(cnpjToQuery) : cleanCnpj(inputValue);
    if (target.length !== 14) {
      setState({
        type: 'error',
        message: 'O CNPJ deve conter exatamente 14 dígitos numéricos.',
      });
      return;
    }

    setState({ type: 'loading' });
    try {
      const data = await fetchCnpj(target);
      setState({ type: 'success', data });
    } catch (err: unknown) {
      setState({
        type: 'error',
        message: err instanceof Error ? err.message : 'Falha ao consultar CNPJ.',
      });
    }
  };

  const handlePresetSelect = (presetCnpj: string) => {
    setInputValue(formatCnpj(presetCnpj));
    handleSearch(presetCnpj);
  };

  const handleClear = () => {
    setInputValue('');
    setState({ type: 'idle' });
  };

  const isButtonEnabled = cleanCnpj(inputValue).length === 14 && state.type !== 'loading';

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-200 select-none ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* TopAppBar (Material 3) */}
      <div className={`px-4 py-3.5 border-b flex items-center justify-between sticky top-0 ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
      } backdrop-blur-md z-30`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none tracking-tight">Consulta CNPJ</h1>
            <span className={`text-[11px] font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              BrasilAPI • Real-time
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl transition ${
              isDark 
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={isDark ? 'Alternar para Tema Claro' : 'Alternar para Tema Escuro'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Screen Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-left max-w-2xl mx-auto w-full">
        {/* CNPJ Input Field */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Número do CNPJ
          </label>
          
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isButtonEnabled) {
                  handleSearch();
                }
              }}
              className={`w-full pl-10 pr-10 py-3.5 rounded-2xl border text-base font-mono tracking-wider font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Limpar campo"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center px-1 text-[11px] text-slate-400">
            <span>Formatação automática com máscara</span>
            <span>{cleanCnpj(inputValue).length} / 14 dígitos</span>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Exemplos rápidos para teste:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COMPANIES.map((preset) => (
              <button
                key={preset.cnpj}
                type="button"
                onClick={() => handlePresetSelect(preset.cnpj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  cleanCnpj(inputValue) === preset.cnpj
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consultar Button */}
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={!isButtonEnabled}
          className={`w-full py-4 px-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition shadow-sm ${
            isButtonEnabled
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Consultar CNPJ</span>
        </button>

        {/* Status Feedback Area */}
        <div className="pt-2">
          {state.type === 'idle' && (
            <div className={`p-8 text-center rounded-2xl border border-dashed ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-500'
            }`}>
              <Building className="w-10 h-10 mx-auto mb-2 text-indigo-400 opacity-60" />
              <p className="font-medium text-sm">Pronto para consultar</p>
              <p className="text-xs text-slate-400 mt-1">
                Digite um CNPJ válido com 14 dígitos ou selecione uma empresa acima.
              </p>
            </div>
          )}

          {state.type === 'loading' && (
            <div className={`p-8 text-center rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="font-semibold text-sm">Consultando base de dados pública...</p>
              <p className="text-xs text-slate-400 mt-1">Requisitando dados via BrasilAPI (HTTPS)</p>
            </div>
          )}

          {state.type === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Falha na Consulta</p>
                  <p className="leading-relaxed">{state.message}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tentar novamente</span>
                </button>
              </div>
            </div>
          )}

          {state.type === 'success' && (
            <CompanyDetailsCard empresa={state.data} isDark={isDark} />
          )}
        </div>
      </div>
    </div>
  );
};
