'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, Trophy, Crop } from 'lucide-react';
import { FieldInput, SaveButton, SectionCard } from '@/components/admin/PageContentEditor';
import ImageCropper from '@/components/admin/ImageCropper';
import { Area } from 'react-easy-crop';

interface PageMeta {
  id: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
}

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
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [savedMeta, setSavedMeta] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => { 
    fetchItems();
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    const { data } = await supabase
      .from('pages')
      .select('id, title, subtitle, hero_image_url')
      .eq('section_key', 'heart')
      .eq('slug', 'exhibitions-features')
      .single();
    if (data) setMeta(data);
  };

  const handleSaveMeta = async () => {
    if (!meta) return;
    setSavingMeta(true);
    await supabase.from('pages').update({
      title: meta.title,
      subtitle: meta.subtitle,
      hero_image_url: meta.hero_image_url,
    }).eq('id', meta.id);
    setSavingMeta(false);
    setSavedMeta(true);
    setTimeout(() => setSavedMeta(false), 2000);
  };

  const handleCropComplete = (croppedArea: Area) => {
    if (meta) {
      const baseUrl = meta.hero_image_url.split('?')[0];
      const cropParams = `?crop=${croppedArea.x},${croppedArea.y},${croppedArea.width},${croppedArea.height}`;
      setMeta({ ...meta, hero_image_url: baseUrl + cropParams });
    }
    setShowCropper(false);
  };

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
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '32px' }}>
        Exhibitions & Features
      </h1>

      {meta && (
        <SectionCard title="Page Header" accent="#ff6b6b" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldInput label="Title" value={meta.title} onChange={v => setMeta({ ...meta, title: v })} />
            <FieldInput label="Subtitle" value={meta.subtitle ?? ''} onChange={v => setMeta({ ...meta, subtitle: v })} />
            <FieldInput label="Hero Cover Image URL" value={meta.hero_image_url ?? ''} onChange={v => setMeta({ ...meta, hero_image_url: v })} />
            
            {meta.hero_image_url && (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={meta.hero_image_url.split('?')[0]} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button onClick={() => setShowCropper(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                }}>
                  <Crop size={13} /> Crop
                </button>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton saving={savingMeta} saved={savedMeta} accent="#ff6b6b" onClick={handleSaveMeta} />
            </div>
          </div>
        </SectionCard>
      )}

      <div style={{ marginBottom: '16px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ff6b6b', opacity: 0.8, fontFamily: 'var(--font-inter)' }}>
        Records & Entries
      </div>

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
      {/* Cropper Modal */}
      {showCropper && meta?.hero_image_url && (
        <ImageCropper
          imageSrc={meta.hero_image_url.split('?')[0]}
          aspect={16 / 9}
          cropShape="rect"
          onCropComplete={(dataUrl) => {
            setMeta({ ...meta, hero_image_url: dataUrl });
            setShowCropper(false);
          }}
          onCancel={() => setShowCropper(false)}
          accent="#ff6b6b"
        />
      )}
    </div>
  );
}
