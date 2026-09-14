import React from 'react';
import { AndroidEmulator } from './components/AndroidEmulator';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <main className="flex-1 w-full h-full flex flex-col">
        <AndroidEmulator />
      </main>
    </div>
  );
}
