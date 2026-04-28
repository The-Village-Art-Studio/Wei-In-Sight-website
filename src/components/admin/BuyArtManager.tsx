'use client';

import { useState, useEffect } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, ExternalLink } from 'lucide-react';
import { FieldInput } from './PageContentEditor';
import SupabaseUploader from './SupabaseUploader';

interface BuyArtItem {
  id: string;
  logo_url: string;
  title: string;
  description: string;
  link: string;
  sort_order: number;
}

export default function BuyArtManager({ accent }: { accent: string }) {
  const [items, setItems] = useState<BuyArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('buy_art_items').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  const handleAdd = () => {
    const temp: BuyArtItem = {
      id: `new_${Date.now()}`,
      logo_url: '', title: '', description: '', link: '',
      sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const handleSave = async (item: BuyArtItem) => {
    setSaving(item.id);
    const payload = {
      logo_url: item.logo_url,
      title: item.title,
      description: item.description,
      link: item.link,
      sort_order: item.sort_order,
    };
    if (item.id.startsWith('new_')) {
      const { data } = await supabase.from('buy_art_items').insert(payload).select().single();
      if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
    } else {
      await supabase.from('buy_art_items').update(payload).eq('id', item.id);
    }
    setSaving(null);
    setSaved(item.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (item: BuyArtItem) => {
    if (!confirm('Remove this destination and its logo from the server?')) return;
    if (!item.id.startsWith('new_')) await supabase.from('buy_art_items').delete().eq('id', item.id);
    if (item.logo_url) await deleteFileFromStorage(item.logo_url);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const update = (id: string, field: keyof BuyArtItem, value: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
      <Loader2 size={20} color={accent} className="animate-spin" />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '10px' }}>
            No destinations yet. Add one below.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} style={{
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '14px',
          }}>
            <GripVertical size={14} color="rgba(255,255,255,0.18)" style={{ cursor: 'grab', marginTop: '16px', flexShrink: 0 }} />

            {/* Logo Preview */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logo_url} alt="" style={{ width: '70%', height: '70%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              ) : (
                <ExternalLink size={18} color="rgba(255,255,255,0.2)" />
              )}
            </div>

            {/* Fields */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <FieldInput label="Logo URL" value={item.logo_url} onChange={v => update(item.id, 'logo_url', v)} placeholder="/assets/logo.png" />
                <SupabaseUploader 
                  accent={accent} 
                  buttonText="Upload Logo" 
                  onUpload={(url) => {
                    if (item.logo_url) deleteFileFromStorage(item.logo_url);
                    update(item.id, 'logo_url', url);
                  }} 
                />
              </div>
              <FieldInput label="Title" value={item.title} onChange={v => update(item.id, 'title', v)} placeholder="Platform Name" />
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput label="Description" value={item.description ?? ''} onChange={v => update(item.id, 'description', v)} multiline placeholder="Short description..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput label="Link (optional)" value={item.link ?? ''} onChange={v => update(item.id, 'link', v)} placeholder="https://..." />
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
              <button onClick={() => handleDelete(item)} style={{
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
        <Plus size={13} /> Add Destination
      </button>
    </div>
  );
}
