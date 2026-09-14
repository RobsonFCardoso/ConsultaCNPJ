import React, { useState } from 'react';
import { CnpjResponse, ScreenState } from '../types/cnpj';
import { cleanCnpj, formatCnpj, fetchCnpj, PRESET_COMPANIES } from '../services/cnpjService';
import { CompanyDetailsCard } from './CompanyDetailsCard';
import { 
  Search, 
  X, 
  AlertTriangle, 
  Wifi, 
  Battery, 
  Signal, 
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
  const [currentTime] = useState('09:41');

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
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Phone Hardware Mockup */}
      <div 
        className={`w-full max-w-[420px] rounded-[42px] p-3 shadow-2xl border-[8px] transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-950 border-slate-800 shadow-slate-900/50' 
            : 'bg-slate-900 border-slate-700 shadow-xl'
        }`}
      >
        {/* Screen Bezel and Display Area */}
        <div 
          className={`relative rounded-[32px] overflow-hidden flex flex-col h-[740px] sm:h-[780px] select-none transition-colors duration-200 ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
          }`}
        >
          {/* Top Notch & Camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>

          {/* Android Status Bar */}
          <div className={`pt-2.5 px-6 pb-2 flex items-center justify-between text-xs font-medium z-40 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* TopAppBar (Material 3) */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
          } backdrop-blur-md z-30`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none tracking-tight">Consulta CNPJ</h1>
                <span className={`text-[11px] font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  Jetpack Compose Material 3
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

          {/* Screen Content Scrollable Area (Compose LazyColumn representation) */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-left">
            {/* CNPJ Input Field (OutlinedTextField) */}
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
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm font-mono tracking-wider font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
            <div className="space-y-1">
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
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

            {/* Consultar Button (Material 3 Filled Button) */}
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={!isButtonEnabled}
              className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                isButtonEnabled
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Consultar CNPJ</span>
            </button>

            {/* Status Feedback Area */}
            <div className="pt-1">
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
                  {/* CircularProgressIndicator Material 3 imitation */}
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

          {/* Android 3-Button Navigation Bar Mockup */}
          <div className={`h-11 flex items-center justify-around px-12 border-t z-30 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <button type="button" className="p-1 hover:opacity-75 active:scale-95" title="Voltar (Back)">
              <div className="w-3.5 h-3.5 border-l-2 border-b-2 border-current -rotate-45" />
            </button>
            <button type="button" className="p-1 hover:opacity-75 active:scale-95" title="Início (Home)">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
            </button>
            <button type="button" className="p-1 hover:opacity-75 active:scale-95" title="Aplicativos Recentes">
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
