'use client';

import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Section {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
  seo_description: string;
}

export default function SectionsEditorPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('section_key');
    
    if (error) {
      console.error('Error fetching sections:', error);
    } else if (data) {
      setSections(data);
      if (data.length > 0 && !activeSection) {
        setActiveSection(data[0]);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!activeSection) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('sections')
      .update({
        title: activeSection.title,
        subtitle: activeSection.subtitle,
        hero_image_url: activeSection.hero_image_url,
        seo_description: activeSection.seo_description
      })
      .eq('id', activeSection.id);
      
    if (error) {
      console.error('Error saving section:', error);
      alert('Failed to save. Check console.');
    } else {
      alert('Section saved successfully!');
      fetchSections();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!sections.length || !activeSection) {
    return (
      <div className="text-white/50 text-center py-20">
        No sections found. Please run the database seed script.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Sections</h1>
          <p className="text-white/50 mt-2">Manage the main page covers, titles, and descriptions.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(255,105,180,0.3)] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Section List */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                activeSection.id === section.id 
                  ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400' 
                  : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-medium tracking-wide uppercase text-sm">{section.title || section.section_key}</div>
              <div className="text-xs opacity-60 mt-1 truncate">{section.subtitle || 'No subtitle'}</div>
            </button>
          ))}
        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-3">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 space-y-8">
            <h2 className="text-xl text-white font-medium tracking-wide border-b border-white/10 pb-4">
              Editing: {activeSection.title || activeSection.section_key}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Title</label>
                  <input 
                    type="text" 
                    value={activeSection.title || ''}
                    onChange={(e) => setActiveSection({...activeSection, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Subtitle / Tagline</label>
                  <input 
                    type="text" 
                    value={activeSection.subtitle || ''}
                    onChange={(e) => setActiveSection({...activeSection, subtitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 ml-1">SEO Description</label>
                  <textarea 
                    rows={6}
                    value={activeSection.seo_description || ''}
                    onChange={(e) => setActiveSection({...activeSection, seo_description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Cover Image Editor */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Hero Cover Image URL</label>
                <input 
                  type="text" 
                  value={activeSection.hero_image_url || ''}
                  onChange={(e) => setActiveSection({...activeSection, hero_image_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all mb-4"
                />
                <div className="aspect-[4/5] w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer group overflow-hidden relative">
                  {activeSection.hero_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeSection.hero_image_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-pink-400 transition-colors mb-3" />
                      <span className="text-sm text-white/50 group-hover:text-white transition-colors">Enter an image URL above</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
