'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Work {
  id: string;
  title: string;
  year_created: number | null;
  medium: string | null;
  status: string;
  is_featured: boolean;
  cover_image_url: string | null;
}

export default function WorksEditorPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (error) {
      console.error('Error fetching works:', error);
    } else if (data) {
      setWorks(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Visual Works</h1>
          <p className="text-white/50 mt-2">Manage individual art pieces, paintings, and sculptures.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(255,105,180,0.3)]">
          <Plus className="w-4 h-4" />
          New Work
        </button>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151515]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search works..." 
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
            </div>
          ) : works.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-white/50">
              No works found. Click "New Work" to create one.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40 bg-[#0a0a0a]">
                  <th className="px-6 py-4 font-medium">Artwork</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Medium</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {works.map((work) => (
                  <tr key={work.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
                          {work.cover_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={work.cover_image_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-white/20 group-hover:text-pink-500/50 transition-colors" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white/90 group-hover:text-white">{work.title}</div>
                          {work.is_featured && <span className="text-[10px] text-pink-400 uppercase tracking-widest mt-1 block">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{work.year_created || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{work.medium || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-[10px] uppercase tracking-widest rounded-full border ${
                        work.status === 'Published' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                        {work.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
