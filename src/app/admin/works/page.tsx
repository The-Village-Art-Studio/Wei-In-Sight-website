'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Image as ImageIcon, Loader2, Trash2, Edit2, Save, X, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import SupabaseUploader from '@/components/admin/SupabaseUploader';
import { formatExternalLink } from '@/lib/utils';

interface Work {
  id: string;
  title: string;
  year_created: number | null;
  medium: string | null;
  status: string;
  is_featured: boolean;
  cover_image_url: string | null;
  slug: string;
  description?: string;
  sort_order: number;
}

export default function WorksEditorPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleEdit = (work: Work) => {
    setSelectedWork({ ...work });
    setIsEditing(true);
  };

  const handleNew = () => {
    const newWork: Work = {
      id: `new_${Date.now()}`,
      title: '',
      year_created: new Date().getFullYear(),
      medium: '',
      status: 'Draft',
      is_featured: false,
      cover_image_url: '',
      slug: '',
      sort_order: works.length,
    };
    setSelectedWork(newWork);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedWork || !selectedWork.title) {
      alert('Please enter at least a title.');
      return;
    }

    setSaving(true);
    try {
      const { id, ...payload } = selectedWork;
      // Generate slug if empty
      if (!payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (id.startsWith('new_')) {
        const { data, error } = await supabase.from('works').insert(payload).select().single();
        if (error) throw error;
        if (data) setWorks(prev => [...prev, data]);
      } else {
        const { error } = await supabase.from('works').update(payload).eq('id', id);
        if (error) throw error;
        setWorks(prev => prev.map(w => w.id === id ? selectedWork : w));
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setIsEditing(false);
        setSelectedWork(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error saving work:', err);
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (work: Work) => {
    if (!confirm(`Are you sure you want to delete "${work.title}"? This will also remove its cover image from the server.`)) return;
    
    await supabase.from('works').delete().eq('id', work.id);
    if (work.cover_image_url) {
      await deleteFileFromStorage(work.cover_image_url);
    }
    
    setWorks(prev => prev.filter(w => w.id !== work.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Visual Works</h1>
          <p className="text-white/50 mt-2">Manage individual art pieces, paintings, and sculptures.</p>
        </div>
        <button 
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(255,105,180,0.3)]"
        >
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
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(work)}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(work)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Editor Modal Overlay */}
      {isEditing && selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#181818]">
              <h2 className="text-xl font-light text-white tracking-wide">
                {selectedWork.id.startsWith('new_') ? 'Create New Work' : 'Edit Work'}
              </h2>
              <button 
                onClick={() => { setIsEditing(false); setSelectedWork(null); }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Image Upload */}
                <div className="space-y-4">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Cover Image</label>
                  <div className="aspect-[4/5] bg-white/5 rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center">
                    {selectedWork.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedWork.cover_image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-2" />
                        <span className="text-xs text-white/20">No image uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <SupabaseUploader 
                      accent="#ec4899" 
                      buttonText="Upload Artwork Photo" 
                      onUpload={(url) => {
                        if (selectedWork.cover_image_url) deleteFileFromStorage(selectedWork.cover_image_url);
                        setSelectedWork({ ...selectedWork, cover_image_url: url });
                      }}
                    />
                    {selectedWork.cover_image_url && (
                      <button 
                        onClick={() => setSelectedWork({ ...selectedWork, cover_image_url: '' })}
                        className="text-[10px] text-red-400/60 hover:text-red-400 text-center uppercase tracking-widest transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Title</label>
                    <input 
                      type="text" 
                      value={selectedWork.title}
                      onChange={(e) => setSelectedWork({ ...selectedWork, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50"
                      placeholder="e.g. Nocturne in Gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Year</label>
                      <input 
                        type="number" 
                        value={selectedWork.year_created || ''}
                        onChange={(e) => setSelectedWork({ ...selectedWork, year_created: parseInt(e.target.value) || null })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50"
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</label>
                      <select 
                        value={selectedWork.status}
                        onChange={(e) => setSelectedWork({ ...selectedWork, status: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                      >
                        <option value="Draft" className="bg-[#121212]">Draft</option>
                        <option value="Published" className="bg-[#121212]">Published</option>
                        <option value="Archived" className="bg-[#121212]">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Medium</label>
                    <input 
                      type="text" 
                      value={selectedWork.medium || ''}
                      onChange={(e) => setSelectedWork({ ...selectedWork, medium: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50"
                      placeholder="e.g. Oil on Canvas"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">Description</label>
                    <textarea 
                      value={selectedWork.description || ''}
                      onChange={(e) => setSelectedWork({ ...selectedWork, description: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 resize-none"
                      placeholder="Tell the story of this piece..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={selectedWork.is_featured}
                      onChange={(e) => setSelectedWork({ ...selectedWork, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-pink-500 bg-white/5 border-white/10 rounded"
                    />
                    <label htmlFor="featured" className="text-sm text-white/70 cursor-pointer">Feature on homepage</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#181818]">
              <button 
                onClick={() => { setIsEditing(false); setSelectedWork(null); }}
                className="px-6 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,105,180,0.2)]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Work'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
