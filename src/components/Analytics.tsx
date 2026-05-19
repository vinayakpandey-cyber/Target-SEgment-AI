import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, Zap, TrendingUp, Monitor } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [activeSegment, setActiveSegment] = useState('All Traffic');

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData);

    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.conversions += Math.random() > 0.7 ? 1 : 0;
        last.clicks += Math.floor(Math.random() * 3);
        return [...prev.slice(0, -1), last];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Network Latency', val: '12ms', icon: Activity, color: 'text-emerald-500' },
    { label: 'Attribution Delta', val: '+4.2%', icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Heuristic Drift', val: 'Optimal', icon: Zap, color: 'text-amber-500' },
    { label: 'Neural Integrity', val: '99.9%', icon: Monitor, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif italic text-white tracking-tight leading-none mb-1">Heuristic Analytics</h1>
          <p className="text-sm text-gray-500">Quantifying cognitive flow and matrix throughput.</p>
        </div>
        <div className="flex bg-white/5 p-1 border border-white/10 rounded-full overflow-hidden">
          {['24h', '7d', '30d', '90d'].map(t => (
            <button key={t} className={cn("px-6 py-2 text-[10px] font-bold uppercase transition-all rounded-full tracking-widest", t === '30d' ? "bg-amber-600 text-black" : "text-gray-500 hover:text-white hover:bg-white/5")}>{t}</button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card-dark flex flex-col gap-2 group hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="col-header">{s.label}</span>
              <s.icon size={14} className={cn(s.color, "opacity-70 group-hover:opacity-100 transition-opacity")} />
            </div>
            <span className="text-2xl font-mono text-white tracking-tighter">{s.val}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="card-dark bg-white/[0.02]">
          <div className="flex items-center justify-between mb-12">
             <div>
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Conversion Neural Flow</h2>
               <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Temporal distribution of signal conversion</p>
             </div>
             <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Impressions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Conversions</span>
                </div>
             </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#6B7280' }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ fontFamily: 'monospace' }}
                  cursor={{ stroke: 'rgba(217,119,6,0.3)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="impressions" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" animationDuration={1500} />
                <Area type="monotone" dataKey="conversions" stroke="rgba(255,255,255,0.5)" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-7 card-dark bg-white/[0.02]">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Segment Velocity</h2>
             <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.slice(-14)}>
                   <XAxis 
                     dataKey="date" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#4B5563' }}
                   />
                   <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                     {data.map((entry, index) => (
                       <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#D97706' : '#92400E'} 
                        fillOpacity={0.4 + (index / 20)} 
                       />
                     ))}
                   </Bar>
                   <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                   />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="lg:col-span-5 bg-amber-600 text-black p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-amber-900/40 relative overflow-hidden group">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60 border-b border-black/10 pb-4">Matrix Synthesis</h2>
              
              <div className="py-8">
                 <p className="text-2xl font-serif italic font-bold leading-tight">
                   "Organic engagement has deviated from the median by +8.4% in high-tier clusters."
                 </p>
                 <p className="text-xs font-bold uppercase tracking-widest mt-6 opacity-60">
                   Anomaly detected in 'Tokyo' cluster during evening hours. Bias adjustment recommended for UTC+9.
                 </p>
              </div>
              
              <button className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-900 transition-all shadow-lg active:scale-[0.98]">
                Generate Heuristic Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
