import React, { useState } from 'react';
import { AndroidEmulator } from './components/AndroidEmulator';
import { CodeViewer } from './components/CodeViewer';
import { 
  Smartphone, 
  Code2, 
  SplitSquareVertical, 
  Layers, 
  CheckCircle, 
  Zap, 
  BookOpen, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'split' | 'phone' | 'code'>('split');
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Consulta CNPJ
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Android Jetpack Compose
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kotlin • Retrofit 2 • StateFlow • Material Design 3 • BrasilAPI
              </p>
            </div>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lado a Lado</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('phone')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  viewMode === 'phone'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulador</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                  viewMode === 'code'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Código Kotlin</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTutorial(!showTutorial)}
              className={`p-2 rounded-xl border transition text-xs flex items-center gap-1.5 ${
                showTutorial 
                  ? 'bg-slate-800 border-indigo-500/40 text-indigo-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Guia de Instalação e Execução"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline font-medium">Guia Android</span>
            </button>
          </div>
        </div>
      </header>

      {/* Optional Tutorial Banner */}
      {showTutorial && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Como rodar este aplicativo no Android Studio:</span>
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">Passo 1: Criar Projeto</span>
                <span>No Android Studio, escolha <b>Empty Compose Activity</b> (Material 3).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">Passo 2: build.gradle.kts</span>
                <span>Copie as dependências da aba <b>build.gradle.kts</b> (Retrofit, Gson, Lifecycle Compose) e sincronize (Sync Now).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">Passo 3: AndroidManifest.xml</span>
                <span>Adicione a permissão <code>&lt;uses-permission android:name="android.permission.INTERNET" /&gt;</code>.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">Passo 4: MainActivity.kt</span>
                <span>Cole o código da aba <b>MainActivity.kt (Arquivo Único)</b> e clique em <b>Run 'app'</b> no emulador ou celular!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Android Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full mb-2 flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  Simulador Android Live
                </span>
                <span className="text-[11px] bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                  API Real (BrasilAPI)
                </span>
              </div>
              <AndroidEmulator />
            </div>

            {/* Right Column: Code Viewer */}
            <div className="lg:col-span-7 h-[850px] sticky top-20">
              <CodeViewer />
            </div>
          </div>
        )}

        {viewMode === 'phone' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Simulador Android Completo
              </span>
              <span className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                Pronto para Testar
              </span>
            </div>
            <AndroidEmulator />
          </div>
        )}

        {viewMode === 'code' && (
          <div className="h-[800px] w-full">
            <CodeViewer />
          </div>
        )}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-500 text-xs py-4 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Consulta de CNPJ • Implementação em Kotlin &amp; Jetpack Compose com Material 3</span>
          <span>Consome a API pública e gratuita <a href="https://brasilapi.com.br" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">BrasilAPI</a></span>
        </div>
      </footer>
    </div>
  );
}
