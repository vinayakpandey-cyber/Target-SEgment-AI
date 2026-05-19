import React from 'react';
import { LayoutDashboard, Users, Zap, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export type View = 'dashboard' | 'segmentation' | 'campaigns' | 'analytics';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const items = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'segmentation', label: 'Cortex', icon: Users },
    { id: 'campaigns', label: 'Matrix', icon: Zap },
    { id: 'analytics', label: 'Heuristics', icon: BarChart3 },
  ];

  return (
    <nav className="w-20 lg:w-64 border-r border-white/10 h-full flex flex-col bg-[--color-bg-elevated]/50 transition-all duration-300">
      <div className="p-6 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={cn(
                "flex items-center gap-4 px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-all rounded-xl relative group",
                isActive 
                  ? "text-amber-500 bg-amber-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
              id={`nav-${item.id}`}
            >
              <div className={cn(
                "flex items-center justify-center transition-transform",
                isActive && "scale-110"
              )}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="hidden lg:block">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full" 
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <button className="flex items-center gap-4 px-4 py-3 text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-white group transition-colors w-full">
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          <span className="hidden lg:block text-left">Control</span>
        </button>
      </div>
    </nav>
  );
}
