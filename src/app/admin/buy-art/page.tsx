'use client';

import { useState, useEffect } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, CheckCircle, GripVertical, ExternalLink, ShoppingBag, Crop } from 'lucide-react';
import { FieldInput, SaveButton, SectionCard } from '@/components/admin/PageContentEditor';
import ImageCropper from '@/components/admin/ImageCropper';
import SupabaseUploader from '@/components/admin/SupabaseUploader';
import { Area } from 'react-easy-crop';
import { formatExternalLink } from '@/lib/utils';

interface PageMeta {
  id: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
}

interface BuyArtItem {
  id: string;
  logo_url: string;
  title: string;
  description: string;
  link: string;
  sort_order: number;
}

export default function BuyArtPage() {
  const [items, setItems] = useState<BuyArtItem[]>([]);
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
      .eq('section_key', 'pulse')
      .eq('slug', 'buy-art')
      .single();

    if (data) {
      setMeta(data);
    } else {
      setMeta(null);
    }
  };

  const handleInitializePage = async () => {
    setSavingMeta(true);
    const { data } = await supabase.from('pages').insert({
      section_key: 'pulse',
      slug: 'buy-art',
      title: 'Buy Art',
      subtitle: '',
      hero_image_url: '',
    }).select().single();
    if (data) setMeta(data);
    setSavingMeta(false);
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

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('buy_art_items').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  const handleAdd = () => {
    const temp: BuyArtItem = {
      id: `new_${Date.now()}`,
      logo_url: '',
      title: '',
      description: '',
      link: '',
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
      link: item.link || null,
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

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new_') && !confirm('Delete this acquisition destination?')) return;
    if (!id.startsWith('new_')) await supabase.from('buy_art_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const update = (id: string, field: keyof BuyArtItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ marginBottom: '8px', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)' }}>
        Pulse / Buy Art
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '32px' }}>
        Buy Art
      </h1>

      {!meta && (
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '32px'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginBottom: '16px' }}>
            Page header metadata has not been initialized.
          </div>
          <button onClick={handleInitializePage} disabled={savingMeta} style={{
            padding: '10px 20px', borderRadius: '8px', background: '#a78bfa', color: '#fff',
            border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: savingMeta ? 0.7 : 1,
          }}>
            {savingMeta ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Initialize Header
          </button>
        </div>
      )}

      {meta && (
        <SectionCard title="Page Header" accent="#a78bfa" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldInput label="Title" value={meta.title} onChange={v => setMeta({ ...meta, title: v })} />
            <FieldInput label="Subtitle" value={meta.subtitle ?? ''} onChange={v => setMeta({ ...meta, subtitle: v })} />
            <FieldInput label="Hero Cover Image URL" value={meta.hero_image_url ?? ''} onChange={v => setMeta({ ...meta, hero_image_url: v })} />
            
            <SupabaseUploader 
              accent="#a78bfa" 
              buttonText="Upload Header Image" 
              onUpload={(url) => {
                // If there's an old Supabase file, we could delete it here
                // but for now let's just update the URL
                setMeta({ ...meta, hero_image_url: url });
              }} 
            />

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
              <SaveButton saving={savingMeta} saved={savedMeta} accent="#a78bfa" onClick={handleSaveMeta} />
            </div>
          </div>
        </SectionCard>
      )}

      <div style={{ marginBottom: '16px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a78bfa', opacity: 0.8, fontFamily: 'var(--font-inter)' }}>
        Acquisition Destinations
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)', marginBottom: '32px' }}>
        Manage the logo grid on the Buy Art page. Each destination links to an external marketplace or gallery.
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 size={24} color="#a78bfa" className="animate-spin" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <GripVertical size={15} color="rgba(255,255,255,0.2)" style={{ cursor: 'grab', marginTop: '14px', flexShrink: 0 }} />

                {/* Logo preview */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {item.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.logo_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  ) : (
                    <ShoppingBag size={20} color="rgba(255,255,255,0.2)" />
                  )}
                </div>

                {/* Fields */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <FieldInput label="Title" value={item.title} onChange={v => update(item.id, 'title', v)} placeholder="Marketplace name…" />
                    <div>
                      <FieldInput label="Logo URL" value={item.logo_url} onChange={v => update(item.id, 'logo_url', v)} placeholder="/assets/logo.png" />
                      <div style={{ marginTop: '6px' }}>
                        <SupabaseUploader 
                          accent="#a78bfa" 
                          buttonText="Upload Logo" 
                          onUpload={(url) => {
                            if (item.logo_url) deleteFileFromStorage(item.logo_url);
                            update(item.id, 'logo_url', url);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  <FieldInput label="Description" value={item.description ?? ''} onChange={v => update(item.id, 'description', v)} placeholder="What collectors can find here…" multiline />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
                    <FieldInput label="External Link" value={item.link ?? ''} onChange={v => update(item.id, 'link', v)} placeholder="https://..." />
                    <FieldInput label="Order" value={String(item.sort_order)} onChange={v => update(item.id, 'sort_order', parseInt(v) || 0)} placeholder="0" />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, paddingTop: '4px' }}>
                  <button onClick={() => handleSave(item)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px',
                    background: saved === item.id ? 'rgba(52,211,153,0.12)' : 'rgba(167,139,250,0.1)',
                    border: saved === item.id ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(167,139,250,0.3)',
                    color: saved === item.id ? '#34d399' : '#a78bfa',
                    cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                  }}>
                    {saving === item.id ? <Loader2 size={11} className="animate-spin" /> : saved === item.id ? <CheckCircle size={11} /> : <Save size={11} />}
                    {saving === item.id ? '…' : saved === item.id ? 'Saved' : 'Save'}
                  </button>
                  {item.link && (
                    <a href={formatExternalLink(item.link)} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderRadius: '7px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-inter)', textDecoration: 'none',
                    }}>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderRadius: '7px',
                    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', color: 'rgba(239,68,68,0.7)',
                    cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                  }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <button onClick={handleAdd} style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '9px',
        background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa',
        cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
      }}>
        <Plus size={14} /> Add Destination
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
          accent="#a78bfa"
        />
      )}
    </div>
  );
}
