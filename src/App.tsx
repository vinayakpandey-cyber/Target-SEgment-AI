/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation, { View } from './components/Navigation';
import Dashboard from './components/Dashboard';
import Segmentation from './components/Segmentation';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'segmentation': return <Segmentation />;
      case 'campaigns': return <Campaigns />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[--color-bg-deep] text-gray-300">
      {/* Header matching Design HTML */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[--color-bg-elevated] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-amber-200 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
            <span className="text-black font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-serif italic text-white tracking-tight">Sovereign Segment</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">System Status</p>
            <p className="text-xs text-white">Real-time Processing Active</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="btn-secondary">Export CSV</button>
             <button className="btn-primary">Launch Campaign</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 pb-20"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer matching Design HTML */}
      <footer className="px-8 py-3 bg-[--color-bg-elevated] border-t border-white/10 flex items-center justify-between text-[10px] tracking-widest uppercase font-bold text-gray-500 z-50">
        <div className="flex gap-8">
          <span>Session: 4882-901-X</span>
          <span>Cloud Sync: Active</span>
        </div>
        <div className="flex gap-8 items-center">
          <span className="text-amber-500">Logic: 2.1.4-stable</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span>Latency: 12ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
