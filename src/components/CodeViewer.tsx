import React, { useState } from 'react';
import { CODE_FILES, CodeFile } from '../data/androidCode';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Search, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [activeFileId, setActiveFileId] = useState<string>('single_file');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeFile = CODE_FILES.find((f) => f.id === activeFileId) || CODE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeFile.name.split(' ')[0];
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Kotlin + Jetpack Compose
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Material 3 + Retrofit 2
            </span>
          </div>
          <h2 className="text-xl font-bold mt-2 text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <span>Código-Fonte para Android Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Código modularizado e versão em arquivo único pronta para compilar e executar.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copiado com sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Arquivo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            title="Baixar arquivo de código"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Baixar</span>
          </button>
        </div>
      </div>

      {/* File Tabs Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/40 px-3 py-2 gap-1.5 scrollbar-thin">
        {CODE_FILES.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition ${
                isActive
                  ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* File Path & Description Bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-500">Local:</span>
          <span className="text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{activeFile.path}</span>
        </div>
        <p className="text-slate-400 text-xs hidden lg:block">
          {activeFile.description}
        </p>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed select-text">
        <pre className="overflow-x-auto whitespace-pre">
          <code>{activeFile.code}</code>
        </pre>
      </div>

      {/* Footer Info / Architecture Notes */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Permissão de Internet</span>
            <span>Declarada em AndroidManifest.xml para acessar a BrasilAPI.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Arquitetura Moderna</span>
            <span>MVI / MVVM com StateFlow, Coroutines e Jetpack Compose Material 3.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">API Pública BrasilAPI</span>
            <span className="font-mono text-[11px] text-amber-300/80">https://brasilapi.com.br/api/cnpj/v1/</span>
          </div>
        </div>
      </div>
    </div>
  );
};
