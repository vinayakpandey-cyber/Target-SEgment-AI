import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Share2, Play, Pause, Wand2, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { Campaign } from '../types';
import { cn } from '../lib/utils';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(setCampaigns);
  }, []);

  const handleOptimize = async (id: string) => {
    setOptimizing(id);
    const res = await fetch(`/api/campaigns/${id}/optimize`, { method: 'POST' });
    if (res.ok) {
      const { campaign, recommendation } = await res.json();
      setCampaigns(prev => prev.map(c => c.id === id ? campaign : c));
      alert(`Optimization complete!\nReason: ${recommendation.adjustmentReason}\nAction: ${recommendation.recommendedAction}`);
    }
    setOptimizing(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-serif italic text-white tracking-tight leading-none mb-1">Matrix Factory</h1>
        <p className="text-sm text-gray-500">Deploy multi-channel engagements and apply cognitive heuristics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white px-2">Active Channels</h2>
          <div className="card-dark p-0 overflow-hidden bg-white/[0.02]">
            {campaigns.map((camp) => (
              <div 
                key={camp.id} 
                onClick={() => setSelectedCampaign(camp)}
                className={cn(
                  "border-b border-white/5 p-6 cursor-pointer transition-all flex items-center justify-between group",
                  selectedCampaign?.id === camp.id ? "bg-white/5" : "hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    selectedCampaign?.id === camp.id ? "bg-amber-600 text-black shadow-lg shadow-amber-600/20" : "bg-white/5 text-gray-400 border border-white/5"
                  )}>
                    {camp.type === 'email' && <Mail size={20} />}
                    {camp.type === 'sms' && <MessageSquare size={20} />}
                    {camp.type === 'social' && <Share2 size={20} />}
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-bold uppercase tracking-widest text-xs transition-colors",
                      selectedCampaign?.id === camp.id ? "text-amber-500" : "text-white"
                    )}>{camp.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-full border",
                        camp.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-white/10"
                      )}>
                        {camp.status}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{camp.type}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className={cn(
                  "text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-amber-500",
                  selectedCampaign?.id === camp.id && "text-amber-500 opacity-100"
                )} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-7">
          {selectedCampaign ? (
            <div className="card-dark space-y-8 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap size={120} className="text-white" />
               </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-serif italic text-white tracking-tight">{selectedCampaign.name}</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Operational Telemetry</p>
                </div>
                <div className="flex gap-2 relative z-10 transition-opacity">
                  <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-all"><Pause size={16} /></button>
                  <button className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all"><Play size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                   { label: 'Network Reach', val: selectedCampaign.performance.sent.toLocaleString(), sub: 'Stable' },
                   { label: 'Cognitive Open', val: `${(selectedCampaign.performance.opened / selectedCampaign.performance.sent * 100).toFixed(1)}%`, sub: '+1.2% Drift' },
                   { label: 'Neural CTR', val: `${(selectedCampaign.performance.clicked / selectedCampaign.performance.sent * 100).toFixed(1)}%`, sub: 'Peak Flow' },
                   { label: 'Attributed Conv.', val: `${(selectedCampaign.performance.converted / selectedCampaign.performance.sent * 100).toFixed(1)}%`, sub: 'Optimal' },
                 ].map((s, i) => (
                   <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                     <span className="col-header !text-[9px]">{s.label}</span>
                     <div className="text-xl font-mono text-white mt-1 font-bold tracking-tighter">{s.val}</div>
                     <span className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest mt-1 block">{s.sub}</span>
                   </div>
                 ))}
              </div>

              {selectedCampaign.abTest && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">A/B Cognitive Variance</h3>
                  <div className="space-y-3">
                    {[
                      { variant: 'ALPHA', name: selectedCampaign.abTest.variantA.subject, rate: selectedCampaign.abTest.variantA.conversionRate, color: 'bg-white/10' },
                      { variant: 'BETA', name: selectedCampaign.abTest.variantB.subject, rate: selectedCampaign.abTest.variantB.conversionRate, color: 'bg-amber-600/50' }
                    ].map((v, i) => (
                      <div key={i} className="relative rounded-xl bg-white/[0.02] border border-white/5 p-4 flex items-center justify-between overflow-hidden group">
                        <div className={cn("absolute top-0 left-0 bottom-0 transition-all duration-1000", v.color)} style={{ width: `${v.rate * 1000}%` }} />
                        <div className="relative flex items-center gap-4">
                          <span className="font-black text-[10px] text-gray-400 group-hover:text-white transition-colors tracking-widest">{v.variant}</span>
                          <span className="text-xs font-serif italic text-white/80">{v.name}</span>
                        </div>
                        <span className="relative font-mono text-sm font-bold text-white tracking-tighter">{(v.rate * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/5">
                <div className="bg-amber-600/10 border border-amber-600/30 rounded-2xl p-8 space-y-6 relative overflow-hidden group">
                   <div className="absolute top-[-50%] left-[-20%] w-60 h-60 bg-amber-600/10 blur-[80px] rounded-full"></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 text-amber-500">
                      <Wand2 size={18} className="animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Autonomous Model Optimization</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Logic Active</span>
                  </div>
                  
                  <p className="text-sm font-serif italic text-white/80 leading-relaxed relative z-10">
                    "Detected statistical significance in cognitive response between variants. The model recommends re-biasing the transmission matrix toward Variant BETA for maximum saturation."
                  </p>
                  
                  <button 
                    onClick={() => handleOptimize(selectedCampaign.id)}
                    disabled={optimizing === selectedCampaign.id}
                    className="w-full bg-amber-600 text-black py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-amber-500 active:scale-95 transition-all shadow-xl shadow-amber-900/20 relative z-10"
                  >
                    {optimizing === selectedCampaign.id ? 'Recomputing Matrix Logic...' : (
                      <>
                        Commit Bias Shift <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full card-dark border-dashed border-white/10 flex flex-col items-center justify-center p-16 text-center bg-transparent group">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700">
                <Zap size={32} className="text-gray-700 group-hover:text-amber-500 transition-colors" />
              </div>
              <p className="font-serif italic text-gray-500 max-w-xs">Select an operational stream to visualize neural telemetry and A/B drift.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

