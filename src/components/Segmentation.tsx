import React, { useState, useEffect } from 'react';
import { Plus, Download, ChevronRight, X, Filter } from 'lucide-react';
import { Segment, Customer, SegmentFilter } from '../types';
import { cn } from '../lib/utils';

export default function Segmentation() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter Form State
  const [newName, setNewName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [ageRange, setAgeRange] = useState<[string, string]>(['18', '65']);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [minBehavior, setMinBehavior] = useState('0');

  const regions = ['New York', 'London', 'Berlin', 'Tokyo', 'Paris', 'Sydney'];
  const professions = ['Engineer', 'Designer', 'Teacher', 'Doctor', 'Artist', 'Marketer'];

  useEffect(() => {
    fetch('/api/segments')
      .then(res => res.json())
      .then(setSegments);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const filters: SegmentFilter = {
      ageRange: [parseInt(ageRange[0]), parseInt(ageRange[1])],
      geographicRegion: selectedRegions,
      professions: selectedProfessions,
      behaviorMin: parseInt(minBehavior)
    };

    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, websiteUrl, filters })
    });

    if (res.ok) {
      const newSeg = await res.json();
      setSegments([...segments, newSeg]);
      setIsCreating(false);
      resetForm();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setNewName('');
    setWebsiteUrl('');
    setAgeRange(['18', '65']);
    setSelectedRegions([]);
    setSelectedProfessions([]);
    setMinBehavior('0');
  };

  const exportToCSV = (segment: Segment) => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(customers => {
        const filtered = (customers as Customer[]).filter(c => {
          let match = true;
          if (segment.filters.ageRange) match = match && c.age >= segment.filters.ageRange[0] && c.age <= segment.filters.ageRange[1];
          if (segment.filters.geographicRegion?.length) match = match && segment.filters.geographicRegion.includes(c.location);
          if (segment.filters.professions?.length) match = match && segment.filters.professions.includes(c.profession);
          if (segment.filters.behaviorMin !== undefined) match = match && c.behaviorScore >= segment.filters.behaviorMin;
          return match;
        });

        const headers = ['ID', 'Name', 'Email', 'Age', 'Location', 'Income', 'Profession', 'Behavior Score', 'Last Purchase'];
        const csvContent = [
          headers.join(','),
          ...filtered.map(c => [
            c.id, 
            c.name.replace(/,/g, ''), 
            c.email, 
            c.age, 
            c.location, 
            c.income, 
            c.profession, 
            c.behaviorScore, 
            c.lastPurchaseDate
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${segment.name.replace(/\s+/g, '_')}_list.csv`;
        a.click();
      });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif italic text-white tracking-tight leading-none mb-1">Cortex Segmentation</h1>
          <p className="text-sm text-gray-500">Isolate and extract behavioral logic clusters.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
          id="btn-create-segment"
        >
          <Plus size={16} />
          New Logic
        </button>
      </header>

      {isCreating && (
        <div className="card-dark relative animate-in fade-in slide-in-from-top-4 duration-500 bg-white/[0.02]">
          <button onClick={() => setIsCreating(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          
          <div className="mb-8">
            <h2 className="text-lg font-serif italic text-white mb-1">Logic Parameters</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Define the neural filter boundary</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="col-header">Cluster Identity</label>
                  <input 
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. High-Tier Tech North"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-amber-600 font-mono transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="col-header">Target Website / Intelligence Root</label>
                  <div className="relative group">
                    <input 
                      type="url"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 pl-12 text-sm text-white focus:outline-none focus:border-amber-600 font-mono transition-colors"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest px-2">Used to calibrate neural logic based on site context</p>
                </div>

                <div className="space-y-2">
                  <label className="col-header">Age Demographic</label>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                    <input 
                      type="number" value={ageRange[0]} onChange={e => setAgeRange([e.target.value, ageRange[1]])}
                      className="bg-transparent text-white text-sm w-16 text-center font-mono focus:outline-none"
                    />
                    <div className="h-px flex-1 bg-white/10" />
                    <input 
                      type="number" value={ageRange[1]} onChange={e => setAgeRange([ageRange[0], e.target.value])}
                      className="bg-transparent text-white text-sm w-16 text-center font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="col-header">Engagement Threshold</label>
                    <span className="text-amber-500 font-mono text-xs">{minBehavior}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={minBehavior} onChange={e => setMinBehavior(e.target.value)}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="col-header">Geographic Locus</label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                        className={cn(
                          "px-4 py-2 text-[10px] font-bold rounded-full border transition-all uppercase tracking-widest",
                          selectedRegions.includes(r) 
                            ? "bg-amber-600 text-black border-amber-600 shadow-lg shadow-amber-600/20" 
                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="col-header">Professional Matrix</label>
                  <div className="grid grid-cols-2 gap-2">
                    {professions.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedProfessions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                        className={cn(
                          "px-4 py-3 text-[10px] font-bold rounded-lg border text-left transition-all uppercase tracking-widest flex items-center gap-3",
                          selectedProfessions.includes(p) 
                            ? "bg-white/10 text-white border-amber-600/50" 
                            : "bg-white/5 text-gray-500 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", selectedProfessions.includes(p) ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-white/10")} />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
              <button 
                type="button" onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                Abort
              </button>
              <button 
                type="submit" disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Processing Neural Model...' : 'Commit Cluster'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white px-2">Active Logic Registries ({segments.length})</h2>
        
        <div className="card-dark p-0 overflow-hidden bg-white/[0.02]">
          <div className="data-row bg-white/[0.05] grid-cols-[1fr_200px_120px_120px_80px] px-6 py-4">
            <span className="col-header">Label</span>
            <span className="col-header">Heuristic Criteria</span>
            <span className="col-header text-right">Population</span>
            <span className="col-header text-right">Added</span>
            <span className="col-header"></span>
          </div>
          
          {segments.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Filter size={20} className="text-gray-600" />
              </div>
              <p className="text-sm font-serif italic text-gray-500">No cognitive clusters detected. Initialize new logic.</p>
            </div>
          )}

          {segments.map((seg) => (
            <div key={seg.id} className="data-row grid-cols-[1fr_200px_120px_120px_80px] px-6 py-6 items-center border-white/5 hover:bg-amber-600/5 group text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-white group-hover:text-amber-500 transition-colors">{seg.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">UUID: {seg.id}</span>
                  {seg.websiteUrl && (
                    <>
                      <span className="text-gray-700">•</span>
                      <span className="text-[10px] text-amber-500/60 font-mono truncate max-w-[150px]">{seg.websiteUrl}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {seg.filters.geographicRegion?.map(r => (
                  <span key={r} className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">{r}</span>
                ))}
                {seg.filters.ageRange && (
                  <span className="text-[9px] font-bold text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-tighter">{seg.filters.ageRange[0]}-{seg.filters.ageRange[1]}y</span>
                )}
              </div>
              <span className="data-value text-right font-mono text-lg">{seg.customerCount.toLocaleString()}</span>
              <span className="text-[10px] text-right font-mono text-gray-500 uppercase tracking-widest">{new Date(seg.createdAt).toLocaleDateString()}</span>
              <div className="flex justify-center">
                 <button 
                  onClick={(e) => { e.stopPropagation(); exportToCSV(seg); }}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:bg-amber-600 hover:text-black hover:border-amber-600 transition-all duration-300"
                  title="Export List"
                 >
                   <Download size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
