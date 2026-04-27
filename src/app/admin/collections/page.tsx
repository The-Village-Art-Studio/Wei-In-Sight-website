'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Folder, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Collection {
  id: string;
  title: string;
  slug: string;
  collection_type: string;
  section_key: string;
  cover_image_url: string | null;
}

export default function CollectionsEditorPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (error) {
      console.error('Error fetching collections:', error);
    } else if (data) {
      setCollections(data);
    }
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video-gallery': return <Film className="w-5 h-5" />;
      case 'album': return <Folder className="w-5 h-5" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Collections</h1>
          <p className="text-white/50 mt-2">Manage album folders, video grids, and galleries.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(255,105,180,0.3)]">
          <Plus className="w-4 h-4" />
          New Collection
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
                placeholder="Search collections..." 
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
          ) : collections.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-white/50">
              No collections found. Click "New Collection" to create one.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40 bg-[#0a0a0a]">
                  <th className="px-6 py-4 font-medium">Collection</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Section</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
                          {collection.cover_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={collection.cover_image_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="text-white/20 group-hover:text-pink-500/50 transition-colors">
                              {getTypeIcon(collection.collection_type)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white/90 group-hover:text-white">{collection.title}</div>
                          <span className="text-[10px] text-white/40 tracking-widest mt-1 block">/{collection.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-[10px] uppercase tracking-widest rounded-full border bg-white/5 border-white/10 text-white/50">
                        {collection.collection_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60 capitalize">{collection.section_key}</td>
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
