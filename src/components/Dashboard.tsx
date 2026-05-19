import React, { useState, useEffect } from 'react';
import { Target, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Globe, Wand2, CheckCircle2, Plus } from 'lucide-react';
import { Campaign, Segment, SegmentFilter } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SiteAnalysis {
  name: string;
  rationale: string;
  filters: SegmentFilter;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 500,
    activeCampaigns: 0,
    conversionRate: 0,
    revenue: 124500
  });

  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SiteAnalysis[] | null>(null);
  const [committedIds, setCommittedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        setActiveCampaigns(data.filter((c: any) => c.status === 'active'));
        setStats(prev => ({
          ...prev,
          activeCampaigns: data.filter((c: any) => c.status === 'active').length,
          conversionRate: 4.2 
        }));
      });
  }, []);

  const handleAnalyze = async () => {
    if (!websiteUrl) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const commitSegment = async (item: SiteAnalysis, index: number) => {
    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name,
        websiteUrl: websiteUrl,
        filters: item.filters
      })
    });
    if (res.ok) {
      setCommittedIds([...committedIds, `${index}`]);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-serif italic text-white tracking-tight leading-none mb-1">Operational Monitor</h1>
          <p className="text-sm text-gray-500">Neural telemetry and autonomous segment synthesis.</p>
        </div>
        
        <div className="flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
            <Globe size={18} className={cn("transition-colors", websiteUrl && "text-amber-500")} />
          </div>
          <input 
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Input Intelligence Root (URL)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-sm text-white focus:outline-none focus:border-amber-600 font-mono transition-all group-hover:border-white/20"
          />
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !websiteUrl}
            className="absolute right-2 top-2 bottom-2 bg-amber-600 text-black px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full" />
            ) : <Wand2 size={12} />}
            Synchronize
          </button>
        </div>
      </header>

      <AnimatePresence>
        {analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Synthesized Segmentation Report
              </h2>
              <span className="text-[10px] text-gray-500 font-mono italic">Source: {websiteUrl}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysisResult.map((item, i) => (
                <div key={i} className="card-dark flex flex-col justify-between bg-white/[0.03] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-125 duration-700">
                    <Users size={60} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-white mb-2 leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 font-serif mb-6 leading-relaxed italic">{item.rationale}</p>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex flex-wrap gap-1.5">
                          {item.filters.geographicRegion?.map(r => (
                            <span key={r} className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-300 uppercase tracking-widest">{r}</span>
                          ))}
                          <span className="text-[9px] font-bold bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded-full text-amber-500 uppercase tracking-widest">
                            {item.filters.ageRange?.[0]}-{item.filters.ageRange?.[1]}Y
                          </span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Logic Drift:</span>
                          <span className="text-[9px] text-emerald-500 font-mono">{item.filters.behaviorMin}% Threshold</span>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => commitSegment(item, i)}
                    disabled={committedIds.includes(`${i}`)}
                    className={cn(
                      "w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                      committedIds.includes(`${i}`)
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-900/10"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black"
                    )}
                  >
                    {committedIds.includes(`${i}`) ? (
                      <>
                        <CheckCircle2 size={12} />
                        Matrix Committed
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        Commit to Cortex
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Audience Size', value: stats.totalCustomers, icon: Users, sub: '+4.2% shift', trend: 'up' },
          { label: 'Active Matrix', value: stats.activeCampaigns, icon: Target, sub: 'Optimized', trend: 'neutral' },
          { label: 'Efficiency CTR', value: `${stats.conversionRate}%`, icon: TrendingUp, sub: '+0.5% gain', trend: 'up' },
          { label: 'Reach Score', value: `94/100`, icon: Zap, sub: 'Saturation High', trend: 'up' },
        ].map((stat, i) => (
          <div key={i} className="card-dark flex flex-col justify-between group">
            <div className="flex items-start justify-between mb-4">
              <span className="col-header">{stat.label}</span>
              <stat.icon size={16} className="text-gray-600 transition-colors group-hover:text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-white tracking-tighter">{stat.value}</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] tracking-widest font-bold uppercase">
                {stat.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> : stat.trend === 'down' ? <ArrowDownRight size={14} className="text-rose-500" /> : null}
                <span className={cn(
                  stat.trend === 'up' ? "text-emerald-500/80" : stat.trend === 'down' ? "text-rose-500/80" : "text-gray-500"
                )}>{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Active Deployments</h2>
          </div>
          <div className="card-dark p-0 overflow-hidden bg-white/[0.02]">
            <div className="data-row bg-white/[0.05] grid-cols-[1fr_120px_120px_100px] px-6 py-4">
              <span className="col-header">Identity</span>
              <span className="col-header">Status</span>
              <span className="col-header text-right">Population</span>
              <span className="col-header text-right">Efficiency</span>
            </div>
            {activeCampaigns.map((camp) => (
              <div key={camp.id} className="data-row grid-cols-[1fr_120px_120px_100px] px-6 py-5 text-sm items-center border-white/5">
                <div className="flex flex-col">
                  <span className="font-bold text-white tracking-tight">{camp.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">ID: {camp.id}</span>
                </div>
                <div>
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Active</span>
                </div>
                <span className="data-value text-right font-mono">{camp.performance.sent.toLocaleString()}</span>
                <span className="text-right text-amber-500 font-mono font-bold">{(camp.performance.converted / camp.performance.sent * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white px-2">Intelligence Drift</h2>
          <div className="bg-amber-600/10 border border-amber-600/30 rounded-2xl p-8 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-amber-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            
            <p className="font-serif italic text-xl leading-snug text-white relative z-10">
              "Segment performance is trending upwards in the tech sector. Recommend increasing reach for Cluster 9."
            </p>
            
            <div className="space-y-4 relative z-10 pt-8">
               <div className="space-y-1">
                 <span className="text-[10px] uppercase tracking-widest text-amber-600 font-black">Neural Suggestion</span>
                 <p className="text-[11px] text-gray-400">Apply bias adjustment to North America High Tier?</p>
               </div>
               <div className="flex gap-2">
                 <button className="flex-1 bg-amber-600 text-black py-3 text-[10px] uppercase font-black hover:bg-amber-500 transition-colors rounded-lg">Apply Bias</button>
                 <button className="flex-1 border border-white/10 py-3 text-[10px] uppercase font-bold hover:bg-white/10 transition-colors rounded-lg text-white">Ignore</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
