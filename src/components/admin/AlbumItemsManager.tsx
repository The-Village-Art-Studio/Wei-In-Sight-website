'use client';

import { useState, useEffect } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, Image as ImageIcon } from 'lucide-react';
import { FieldInput } from './PageContentEditor';
import SupabaseUploader from './SupabaseUploader';

interface AlbumItem {
  id: string;
  album_id: string;
  media_url: string;
  title: string;
  year: string;
  medium: string;
  size: string;
  description: string;
  sort_order: number;
}

export default function AlbumItemsManager({ albumId, accent }: { albumId: string; accent: string }) {
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, [albumId]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('album_items').select('*').eq('album_id', albumId).order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  const handleAdd = () => {
    const temp: AlbumItem = {
      id: `new_${Date.now()}`, album_id: albumId,
      media_url: '', title: '', year: '', medium: '', size: '', description: '', sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const handleSave = async (item: AlbumItem) => {
    setSaving(item.id);
    const payload = { album_id: albumId, media_url: item.media_url, title: item.title, year: item.year, medium: item.medium, size: item.size, description: item.description, sort_order: item.sort_order };
    if (item.id.startsWith('new_')) {
      const { data } = await supabase.from('album_items').insert(payload).select().single();
      if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
    } else {
      await supabase.from('album_items').update(payload).eq('id', item.id);
    }
    setSaving(null);
    setSaved(item.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (item: AlbumItem) => {
    if (window.confirm('Are you sure you want to remove this image? This will also delete the file from the server.')) {
      if (!item.id.startsWith('new_')) await supabase.from('album_items').delete().eq('id', item.id);
      if (item.media_url) await deleteFileFromStorage(item.media_url);
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleDuplicate = (item: AlbumItem) => {
    const temp: AlbumItem = {
      ...item,
      id: `new_${Date.now()}`,
      sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const update = (id: string, field: keyof AlbumItem, value: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  if (loading) return <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}><Loader2 size={18} color={accent} className="animate-spin" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            No images yet.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} style={{
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '12px',
          }}>
            <GripVertical size={14} color="rgba(255,255,255,0.18)" style={{ cursor: 'grab', marginTop: '14px', flexShrink: 0 }} />

            {/* Thumbnail */}
            <div style={{ width: '52px', height: '52px', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.media_url
                ? <img src={item.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <ImageIcon size={18} color="rgba(255,255,255,0.2)" />}
            </div>

            {/* Fields */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput label="Image URL" value={item.media_url} onChange={v => update(item.id, 'media_url', v)} placeholder="https://..." />
                <div style={{ marginTop: '6px' }}>
                  <SupabaseUploader 
                    accent={accent} 
                    buttonText="Upload File" 
                    onUpload={(url) => {
                      if (item.media_url) deleteFileFromStorage(item.media_url);
                      update(item.id, 'media_url', url);
                    }} 
                  />
                </div>
              </div>
              <FieldInput label="Title" value={item.title ?? ''} onChange={v => update(item.id, 'title', v)} />
              <FieldInput label="Year" value={item.year ?? ''} onChange={v => update(item.id, 'year', v)} />
              <FieldInput label="Medium" value={item.medium ?? ''} onChange={v => update(item.id, 'medium', v)} />
              <FieldInput label="Size (optional)" value={item.size ?? ''} onChange={v => update(item.id, 'size', v)} placeholder="e.g. 24x36 inches" />
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput label="Description" value={item.description ?? ''} onChange={v => update(item.id, 'description', v)} multiline placeholder="Enter a description..." />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
              <button onClick={() => handleSave(item)} disabled={!!saving} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '7px',
                background: saved === item.id ? 'rgba(52,211,153,0.12)' : `${accent}14`,
                border: saved === item.id ? '1px solid rgba(52,211,153,0.3)' : `1px solid ${accent}35`,
                color: saved === item.id ? '#34d399' : accent,
                cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
              }}>
                {saving === item.id ? <Loader2 size={11} className="animate-spin" /> : saved === item.id ? <CheckCircle size={11} /> : <Save size={11} />}
                {saving === item.id ? '…' : saved === item.id ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => handleDuplicate(item)} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
              }}>
                <Plus size={11} /> Duplicate
              </button>
              <button onClick={() => handleDelete(item)} style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '7px',
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
        display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 14px', borderRadius: '7px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
      }}>
        <Plus size={12} /> Add Image
      </button>
    </div>
  );
}
