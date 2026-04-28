'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, Image as ImageIcon, Film } from 'lucide-react';
import { FieldInput } from './PageContentEditor';
import SupabaseUploader from './SupabaseUploader';

interface GalleryItem {
  id: string;
  page_id: string;
  media_url: string;
  title: string;
  year: string;
  medium: string;
  size: string;
  description: string;
  link: string;
  sort_order: number;
}

export default function FlatGalleryManager({ pageId, isVideo, accent }: {
  pageId: string; isVideo: boolean; accent: string;
}) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, [pageId]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('page_gallery_items').select('*').eq('page_id', pageId).order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  const handleAdd = () => {
    const temp: GalleryItem = {
      id: `new_${Date.now()}`, page_id: pageId,
      media_url: '', title: '', year: '', medium: isVideo ? 'Video' : '', size: '', description: '', link: '', sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const handleSave = async (item: GalleryItem) => {
    setSaving(item.id);
    const payload = { page_id: pageId, media_url: item.media_url, title: item.title, year: item.year, medium: item.medium, size: item.size, description: item.description, link: item.link, sort_order: item.sort_order };
    if (item.id.startsWith('new_')) {
      const { data } = await supabase.from('page_gallery_items').insert(payload).select().single();
      if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
    } else {
      await supabase.from('page_gallery_items').update(payload).eq('id', item.id);
    }
    setSaving(null);
    setSaved(item.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new_')) await supabase.from('page_gallery_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleDuplicate = (item: GalleryItem) => {
    const temp: GalleryItem = {
      ...item,
      id: `new_${Date.now()}`,
      sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const update = (id: string, field: keyof GalleryItem, value: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}><Loader2 size={20} color={accent} className="animate-spin" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '10px' }}>
            No {isVideo ? 'videos' : 'images'} yet.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} style={{
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '14px',
          }}>
            <GripVertical size={14} color="rgba(255,255,255,0.18)" style={{ cursor: 'grab', marginTop: '16px', flexShrink: 0 }} />

            {/* Thumbnail / Video icon */}
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isVideo
                ? <Film size={20} color="rgba(255,255,255,0.2)" />
                : item.media_url
                  ? <img src={item.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ImageIcon size={20} color="rgba(255,255,255,0.2)" />
              }
            </div>

            {/* Fields */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  label={isVideo ? 'YouTube Embed URL' : 'Image URL'}
                  value={item.media_url}
                  onChange={v => update(item.id, 'media_url', v)}
                  placeholder={isVideo ? 'https://www.youtube.com/embed/...' : 'https://...'}
                />
                {!isVideo && (
                  <div style={{ marginTop: '6px' }}>
                    <SupabaseUploader 
                      accent={accent} 
                      buttonText="Upload File" 
                      onUpload={(url) => update(item.id, 'media_url', url)} 
                    />
                  </div>
                )}
              </div>
              <FieldInput label="Title" value={item.title ?? ''} onChange={v => update(item.id, 'title', v)} />
              <FieldInput label="Year" value={item.year ?? ''} onChange={v => update(item.id, 'year', v)} />
              {!isVideo && <FieldInput label="Medium" value={item.medium ?? ''} onChange={v => update(item.id, 'medium', v)} />}
              {!isVideo && <FieldInput label="Size (optional)" value={item.size ?? ''} onChange={v => update(item.id, 'size', v)} placeholder="e.g. 24x36 inches" />}
              {!isVideo && <FieldInput label="Link (optional)" value={item.link ?? ''} onChange={v => update(item.id, 'link', v)} placeholder="https://..." />}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput label="Description" value={item.description ?? ''} onChange={v => update(item.id, 'description', v)} multiline placeholder="Enter a description..." />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
              <button onClick={() => handleSave(item)} disabled={!!saving} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 11px', borderRadius: '7px',
                background: saved === item.id ? 'rgba(52,211,153,0.12)' : `${accent}14`,
                border: saved === item.id ? '1px solid rgba(52,211,153,0.3)' : `1px solid ${accent}35`,
                color: saved === item.id ? '#34d399' : accent,
                cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
              }}>
                {saving === item.id ? <Loader2 size={11} className="animate-spin" /> : saved === item.id ? <CheckCircle size={11} /> : <Save size={11} />}
                {saving === item.id ? '…' : saved === item.id ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => handleDuplicate(item)} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 11px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
              }}>
                <Plus size={11} /> Duplicate
              </button>
              <button onClick={() => handleDelete(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 11px', borderRadius: '7px',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', color: 'rgba(239,68,68,0.7)',
                cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
              }}>
                <Trash2 size={11} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAdd} style={{
        display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '8px',
        background: `${accent}12`, border: `1px solid ${accent}30`, color: accent,
        cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
      }}>
        <Plus size={13} /> Add {isVideo ? 'Video' : 'Image'}
      </button>
    </div>
  );
}
