'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Section, SubMenu } from '@/lib/constants';
import { Loader2, Save, CheckCircle, Crop } from 'lucide-react';
import AlbumManager from './AlbumManager';
import FlatGalleryManager from './FlatGalleryManager';
import BuyArtManager from './BuyArtManager';
import SupabaseUploader from './SupabaseUploader';
import ImageCropper from './ImageCropper';
import { Area } from 'react-easy-crop';

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
// Special pages with unique editors
const ABOUT_PAGE = 'about';
const BUY_ART_PAGE = 'buy-art';
// Pages that skip the metadata editor entirely
const SKIP_META_PAGES = ['commissions', 'contact', 'streaming-platforms', 'philosophy', 'exhibitions-features'];

interface Props {
  section: Section;
  submenu: SubMenu;
}

export default function PageContentEditor({ section, submenu }: Props) {
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const accent = section.editorial.accentColor ?? '#ff69b4';
  const isAlbum = ALBUM_PAGES.includes(submenu.id);
  const isGallery = GALLERY_PAGES.includes(submenu.id);
  const isVideo = VIDEO_PAGES.includes(submenu.id);
  const isAbout = submenu.id === ABOUT_PAGE;
  const isBuyArt = submenu.id === BUY_ART_PAGE;
  const skipMeta = SKIP_META_PAGES.includes(submenu.id);

  useEffect(() => {
    fetchMeta();
  }, [submenu.id]);

  const fetchMeta = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('id, title, subtitle, hero_image_url')
      .eq('section_key', section.id)
      .eq('slug', submenu.id);
    
    if (data && data.length > 0) {
      setMeta(data[0]);
    } else {
      setMeta(null);
    }
    setLoading(false);
  };

  const handleInitializePage = async () => {
    setSaving(true);
    const { data, error } = await supabase.from('pages').insert({
      section_key: section.id,
      slug: submenu.id,
      title: submenu.label,
      subtitle: '',
      hero_image_url: '',
    }).select().single();

    if (data) {
      setMeta(data);
    }
    setSaving(false);
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

  const handleCropComplete = (croppedArea: Area) => {
    // Store crop data as query params on the URL for server-side processing
    if (meta) {
      const baseUrl = meta.hero_image_url.split('?')[0];
      const cropParams = `?crop=${croppedArea.x},${croppedArea.y},${croppedArea.width},${croppedArea.height}`;
      setMeta({ ...meta, hero_image_url: baseUrl + cropParams });
    }
    setShowCropper(false);
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

      {/* ─── Empty State: Page not initialized ─── */}
      {!meta && !skipMeta && !isBuyArt && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '24px' }}>
            This page has not been initialized in the database yet.
          </div>
          <button
            onClick={handleInitializePage}
            disabled={saving}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: accent,
              color: '#fff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Initialize {submenu.label} Page
          </button>
        </div>
      )}

      {/* ─── Section 1: Page Metadata ─── */}
      {!skipMeta && meta && (
        <SectionCard title="Page Metadata" accent={accent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldInput label="Title" value={meta.title} onChange={v => setMeta({ ...meta, title: v })} />
            <FieldInput label="Subtitle" value={meta.subtitle ?? ''} onChange={v => setMeta({ ...meta, subtitle: v })} />
            <FieldInput
              label={isAbout ? 'Profile Photo URL' : 'Hero Cover Image URL'}
              value={meta.hero_image_url ?? ''}
              onChange={v => setMeta({ ...meta, hero_image_url: v })}
            />

            {/* Image Preview + Buttons */}
            {meta.hero_image_url && (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {isAbout ? (
                  /* Circular profile photo preview */
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,105,180,0.3)',
                    flexShrink: 0,
                    boxShadow: '0 0 24px rgba(255,105,180,0.15)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={meta.hero_image_url.split('?')[0]} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  /* Rectangular hero cover preview */
                  <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    aspectRatio: '21 / 9',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={meta.hero_image_url.split('?')[0]} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <SupabaseUploader 
                    accent={accent} 
                    buttonText="Upload New Image" 
                    onUpload={(url) => setMeta({ ...meta, hero_image_url: url })} 
                  />
                  
                  <button onClick={() => setShowCropper(true)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.55)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-inter)',
                    whiteSpace: 'nowrap',
                  }}>
                    <Crop size={13} /> Scale & Crop
                  </button>
                </div>
              </div>
            )}
            {!meta.hero_image_url && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <SupabaseUploader 
                  accent={accent} 
                  buttonText="Upload Image" 
                  onUpload={(url) => setMeta({ ...meta, hero_image_url: url })} 
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <SaveButton saving={saving} saved={saved} accent={accent} onClick={handleSaveMeta} />
            </div>
          </div>
        </SectionCard>
      )}

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

      {/* ─── Section 4: Buy Art Manager ─── */}
      {isBuyArt && (
        <SectionCard title="Acquisition Destinations" accent={accent} style={{ marginTop: meta ? '20px' : '0' }}>
          <BuyArtManager accent={accent} />
        </SectionCard>
      )}

      {/* ─── Cropper Modal ─── */}
      {showCropper && meta?.hero_image_url && (
        <ImageCropper
          imageSrc={meta.hero_image_url.split('?')[0]}
          aspect={isAbout ? 1 : 21 / 9}
          cropShape={isAbout ? 'round' : 'rect'}
          onCropComplete={(dataUrl) => {
            setMeta({ ...meta, hero_image_url: dataUrl });
            setShowCropper(false);
          }}
          onCancel={() => setShowCropper(false)}
          accent={accent}
        />
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
