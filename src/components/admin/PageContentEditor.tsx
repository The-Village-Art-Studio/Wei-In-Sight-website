'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Section, SubMenu } from '@/lib/constants';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import AlbumManager from './AlbumManager';
import FlatGalleryManager from './FlatGalleryManager';

interface PageMeta {
  id: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
}

// Pages with nested album folders
const ALBUM_PAGES = ['paintings', 'photography', 'sculpture', 'collections', 'mixed-media', 'material-experiments', 'watchmaking', 'fashion'];
// Pages with flat gallery items
const GALLERY_PAGES = ['music-archive', 'audio-visual-work', 'poems', 'lyrics', 'novels', 'quotes', 'journey'];
// Video pages (YouTube URLs)
const VIDEO_PAGES = ['audio-visual-work'];

interface Props {
  section: Section;
  submenu: SubMenu;
}

export default function PageContentEditor({ section, submenu }: Props) {
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const accent = section.editorial.accentColor ?? '#ff69b4';
  const isAlbum = ALBUM_PAGES.includes(submenu.id);
  const isGallery = GALLERY_PAGES.includes(submenu.id);
  const isVideo = VIDEO_PAGES.includes(submenu.id);

  useEffect(() => {
    fetchMeta();
  }, [submenu.id]);

  const fetchMeta = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('id, title, subtitle, hero_image_url')
      .eq('section_key', section.id)
      .eq('slug', submenu.id)
      .single();
    if (data) setMeta(data);
    setLoading(false);
  };

  const handleSaveMeta = async () => {
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={28} color={accent} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
        {section.label} / {submenu.label}
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '32px' }}>
        {submenu.label}
      </h1>

      {/* ─── Section 1: Page Metadata ─── */}
      <SectionCard title="Page Metadata" accent={accent}>
        {meta && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldInput label="Title" value={meta.title} onChange={v => setMeta({ ...meta, title: v })} />
            <FieldInput label="Subtitle" value={meta.subtitle ?? ''} onChange={v => setMeta({ ...meta, subtitle: v })} />
            <FieldInput label="Hero Cover Image URL" value={meta.hero_image_url ?? ''} onChange={v => setMeta({ ...meta, hero_image_url: v })} />
            {meta.hero_image_url && (
              <div style={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={meta.hero_image_url} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton saving={saving} saved={saved} accent={accent} onClick={handleSaveMeta} />
            </div>
          </div>
        )}
      </SectionCard>

      {/* ─── Section 2: Album Folders (for Sight / Touch pages) ─── */}
      {isAlbum && meta && (
        <SectionCard title="Folders & Galleries" accent={accent} style={{ marginTop: '20px' }}>
          <AlbumManager pageId={meta.id} accent={accent} />
        </SectionCard>
      )}

      {/* ─── Section 3: Flat Gallery (Music, Poems, Novels, etc.) ─── */}
      {isGallery && meta && (
        <SectionCard title={isVideo ? 'Videos' : 'Gallery Items'} accent={accent} style={{ marginTop: '20px' }}>
          <FlatGalleryManager pageId={meta.id} isVideo={isVideo} accent={accent} />
        </SectionCard>
      )}
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────

export function SectionCard({ title, accent, children, style }: {
  title: string; accent: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: accent,
        fontFamily: 'var(--font-inter)',
      }}>
        {title}
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export function FieldInput({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '9px 13px',
    color: '#fff',
    fontSize: '13px',
    fontFamily: 'var(--font-inter)',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical' as const,
  };
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
        {label}
      </label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={shared}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />
      )}
    </div>
  );
}

export function SaveButton({ saving, saved, accent, onClick }: {
  saving: boolean; saved: boolean; accent: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      padding: '9px 18px', borderRadius: '8px',
      background: saved ? 'rgba(52,211,153,0.15)' : `${accent}18`,
      border: saved ? '1px solid rgba(52,211,153,0.4)' : `1px solid ${accent}40`,
      color: saved ? '#34d399' : accent,
      cursor: saving ? 'not-allowed' : 'pointer',
      fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
      transition: 'all 0.2s',
    }}>
      {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} /> : <Save size={13} />}
      {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
    </button>
  );
}
