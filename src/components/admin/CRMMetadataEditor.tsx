'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, CheckCircle, Image as ImageIcon } from 'lucide-react';
import SupabaseUploader from './SupabaseUploader';

interface PageMeta {
  id: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
  slug: string;
}

export default function CRMMetadataEditor({ slug }: { slug: 'commissions' | 'contact' }) {
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const accent = slug === 'commissions' ? '#a78bfa' : '#60a5fa';

  useEffect(() => {
    fetchMeta();
  }, [slug]);

  const fetchMeta = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('id, title, subtitle, hero_image_url, slug')
      .eq('section_key', 'pulse')
      .eq('slug', slug);
    
    if (data && data.length > 0) {
      setMeta(data[0]);
    } else {
      setMeta(null);
    }
    setLoading(false);
  };

  const handleInitialize = async () => {
    setSaving(true);
    const { data } = await supabase.from('pages').insert({
      section_key: 'pulse',
      slug: slug,
      title: slug === 'commissions' ? 'Commissions' : 'Contact',
      subtitle: '',
      hero_image_url: '',
    }).select().single();

    if (data) setMeta(data);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!meta) return;
    setSaving(true);
    await supabase.from('pages').update({
      title: meta.title,
      subtitle: meta.subtitle,
      hero_image_url: meta.hero_image_url,
    }).eq('id', meta.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}><Loader2 size={20} className="animate-spin" color={accent} /></div>;

  if (!meta) {
    return (
      <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Hero section metadata has not been initialized for this page.</p>
        <button onClick={handleInitialize} disabled={saving} style={{ padding: '8px 16px', borderRadius: '8px', background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
          {saving ? 'Initializing...' : 'Initialize Hero Section'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Page Hero & Metadata</h3>
        <button onClick={handleSave} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 14px', borderRadius: '8px',
          background: saved ? 'rgba(52,211,153,0.15)' : accent,
          color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
        }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} /> : <Save size={13} />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Hero Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>Hero Image</div>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {meta.hero_image_url ? (
              <img src={meta.hero_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ImageIcon size={24} color="rgba(255,255,255,0.1)" />
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SupabaseUploader onUpload={(url) => setMeta({ ...meta, hero_image_url: url })} buttonText="Upload Hero" accent={accent} />
            {meta.hero_image_url && (
              <button onClick={() => setMeta({ ...meta, hero_image_url: '' })} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '10px' }}>Remove</button>
            )}
          </div>
        </div>

        {/* Text Fields */}
        <div>
          <FieldInput label="Page Title" value={meta.title} onChange={v => setMeta({ ...meta, title: v })} placeholder="e.g. COMMISSIONS" />
          <FieldInput label="Hero Subtitle" value={meta.subtitle} onChange={v => setMeta({ ...meta, subtitle: v })} placeholder="A cinematic catchphrase..." multiline />
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', marginTop: '-8px' }}>
            This title and subtitle will appear in the premium hero section on the public site.
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '13px', outline: 'none' }} />
      )}
    </div>
  );
}
