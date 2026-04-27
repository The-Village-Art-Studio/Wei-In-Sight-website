'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, Trophy } from 'lucide-react';
import { FieldInput, SaveButton } from '@/components/admin/PageContentEditor';

interface Exhibition {
  id: string;
  year: string;
  title: string;
  location: string;
  is_award: boolean;
  sort_order: number;
}

export default function ExhibitionsPage() {
  const [items, setItems] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('exhibitions').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  const handleAdd = () => {
    const temp: Exhibition = {
      id: `new_${Date.now()}`, year: String(new Date().getFullYear()),
      title: '', location: '', is_award: false, sort_order: items.length,
    };
    setItems(prev => [...prev, temp]);
  };

  const handleSave = async (item: Exhibition) => {
    setSaving(item.id);
    const payload = { year: item.year, title: item.title, location: item.location, is_award: item.is_award, sort_order: item.sort_order };
    if (item.id.startsWith('new_')) {
      const { data } = await supabase.from('exhibitions').insert(payload).select().single();
      if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
    } else {
      await supabase.from('exhibitions').update(payload).eq('id', item.id);
    }
    setSaving(null);
    setSaved(item.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new_')) await supabase.from('exhibitions').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const update = (id: string, field: keyof Exhibition, value: string | boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '8px', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)' }}>
        Heart / Exhibitions & Features
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '8px' }}>
        Exhibitions & Features
      </h1>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)', marginBottom: '32px' }}>
        Add, edit, and reorder exhibition entries. Drag handles for ordering coming soon.
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 size={24} color="#fbbf24" className="animate-spin" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: 'rgba(255,255,255,0.025)',
              border: item.is_award ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <GripVertical size={15} color="rgba(255,255,255,0.2)" style={{ cursor: 'grab', marginTop: '14px', flexShrink: 0 }} />

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '10px', alignItems: 'end' }}>
                <FieldInput label="Year" value={item.year} onChange={v => update(item.id, 'year', v)} placeholder="2025" />
                <FieldInput label="Title / Exhibition Name" value={item.title} onChange={v => update(item.id, 'title', v)} placeholder="Show title..." />
                <FieldInput label="Location" value={item.location} onChange={v => update(item.id, 'location', v)} placeholder="City, Country" />

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={item.is_award}
                      onChange={e => update(item.id, 'is_award', e.target.checked)}
                      style={{ accentColor: '#fbbf24', width: '14px', height: '14px' }}
                    />
                    <Trophy size={13} color={item.is_award ? '#fbbf24' : 'rgba(255,255,255,0.3)'} />
                    <span style={{ fontSize: '11px', color: item.is_award ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
                      Mark as Award / Feature
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexShrink: 0, paddingTop: '4px' }}>
                <button onClick={() => handleSave(item)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px',
                  background: saved === item.id ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.1)',
                  border: saved === item.id ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(251,191,36,0.3)',
                  color: saved === item.id ? '#34d399' : '#fbbf24',
                  cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                }}>
                  {saving === item.id ? <Loader2 size={11} className="animate-spin" /> : saved === item.id ? <CheckCircle size={11} /> : <Save size={11} />}
                  {saving === item.id ? '…' : saved === item.id ? 'Saved' : 'Save'}
                </button>
                <button onClick={() => handleDelete(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderRadius: '7px',
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', color: 'rgba(239,68,68,0.7)',
                  cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                }}>
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleAdd} style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '9px',
        background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24',
        cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
      }}>
        <Plus size={14} /> Add Exhibition
      </button>
    </div>
  );
}
