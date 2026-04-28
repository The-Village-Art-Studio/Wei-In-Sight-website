'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, CheckCircle, Globe, Mail, Music, Link as LinkIcon, Video, KeyRound, Type, ImageIcon, Database } from 'lucide-react';
import { MOCK_CONTENT } from '@/lib/mockContent';

interface SiteSettings {
  id: string;
  site_title: string;
  site_subtitle: string;
  primary_email: string;
  notification_email: string;
  favicon_url: string;
  brand_wordmark_url: string;
  instagram_url: string;
  youtube_url: string;
  spotify_url: string;
  apple_music_url: string;
  seo_description: string;
  seo_keywords: string;
}

function SettingsField({ label, value, onChange, placeholder, icon, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ReactNode; multiline?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: icon ? '9px 13px 9px 36px' : '9px 13px',
    color: '#fff',
    fontSize: '13px',
    fontFamily: 'var(--font-inter)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
    transition: 'border-color 0.15s',
  };
  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', display: 'flex' }}>
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={shared}
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
    </div>
  );
}

function SettingsSection({ title, accent, icon, children }: {
  title: string; accent: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ color: accent, opacity: 0.8, display: 'flex' }}>{icon}</span>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: accent,
          fontFamily: 'var(--font-inter)',
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { id, ...payload } = settings;
    await supabase.from('site_settings').update(payload).eq('id', id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleInitializeSettings = async () => {
    setSaving(true);
    const { data } = await supabase.from('site_settings').insert({
      site_title: 'WEI IN SIGHT',
      site_subtitle: 'The creative atlas of Jacky Ho',
      primary_email: '',
      notification_email: '',
      favicon_url: '',
      brand_wordmark_url: '',
      instagram_url: '',
      youtube_url: '',
      spotify_url: '',
      apple_music_url: '',
      seo_description: '',
      seo_keywords: '',
    }).select().single();
    if (data) setSettings(data);
    setSaving(false);
  };

  const update = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const [seeding, setSeeding] = useState(false);
  const [seedComplete, setSeedComplete] = useState(false);

  const handleSeedMockContent = async () => {
    if (!window.confirm("Are you sure you want to seed the database? This will overwrite existing mock content folders.")) return;
    setSeeding(true);
    try {
      for (const [sectionSlug, content] of Object.entries(MOCK_CONTENT)) {
        // 1. Upsert Page
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .upsert({
            section_key: content.sectionId,
            slug: content.slug,
            title: content.title,
            subtitle: content.subtitle || null,
            hero_image_url: content.heroImage || null,
          }, { onConflict: 'section_key,slug' })
          .select()
          .single();

        if (pageError || !page) continue;

        // 2. Insert Albums & Items
        if (content.albums && content.albums.length > 0) {
          await supabase.from('albums').delete().eq('page_id', page.id);

          for (let i = 0; i < content.albums.length; i++) {
            const mockAlbum = content.albums[i];
            const { data: album, error: albumError } = await supabase
              .from('albums')
              .insert({
                page_id: page.id,
                title: mockAlbum.title,
                description: mockAlbum.description || null,
                slug: mockAlbum.id,
                sort_order: i
              })
              .select()
              .single();

            if (albumError || !album) continue;

            if (mockAlbum.items && mockAlbum.items.length > 0) {
              const itemsToInsert = mockAlbum.items.map((item, idx) => ({
                album_id: album.id,
                title: item.title,
                description: item.description || null,
                media_url: item.url,
                year: item.year || null,
                medium: item.medium || null,
                sort_order: idx
              }));
              await supabase.from('album_items').insert(itemsToInsert);
            }
          }
        }

        // 3. Insert Gallery Blocks
        const galleryBlock = content.blocks.find(b => b.type === 'gallery' || b.type === 'video-gallery');
        if (galleryBlock && galleryBlock.items && galleryBlock.items.length > 0) {
          await supabase.from('page_gallery_items').delete().eq('page_id', page.id);
          const itemsToInsert = galleryBlock.items.map((item: any, idx: number) => ({
            page_id: page.id,
            title: item.title || null,
            description: item.description || null,
            media_url: item.url,
            year: item.year || null,
            medium: item.medium || null,
            sort_order: idx
          }));
          await supabase.from('page_gallery_items').insert(itemsToInsert);
        }

        // 4. Exhibitions
        if (content.slug === 'exhibitions-features') {
          const exhBlock = content.blocks.find(b => b.type === 'exhibition-list');
          if (exhBlock && exhBlock.exhibitionItems && exhBlock.exhibitionItems.length > 0) {
            await supabase.from('exhibitions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
            const itemsToInsert = exhBlock.exhibitionItems.map((item: any, idx: number) => ({
              title: item.title,
              location: item.location || null,
              year: item.year || null,
              is_award: item.isAward || false,
              sort_order: idx
            }));
            await supabase.from('exhibitions').insert(itemsToInsert);
          }
        }

        // 5. Buy Art Logos
        if (content.slug === 'buy-art') {
          const logoBlock = content.blocks.find(b => b.type === 'logo-grid');
          if (logoBlock && logoBlock.logoItems && logoBlock.logoItems.length > 0) {
            await supabase.from('buy_art_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const itemsToInsert = logoBlock.logoItems.map((item: any, idx: number) => ({
              title: item.title,
              description: item.description || null,
              logo_url: item.logoUrl,
              link: item.link || null,
              sort_order: idx
            }));
            await supabase.from('buy_art_items').insert(itemsToInsert);
          }
        }
      }
      setSeedComplete(true);
      setTimeout(() => setSeedComplete(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error seeding database.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={28} color="#ff69b4" className="animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '60vh', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.07)', margin: '40px',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '24px' }}>
          Global site settings have not been initialized.
        </div>
        <button
          onClick={handleInitializeSettings}
          disabled={saving}
          style={{
            padding: '12px 24px', borderRadius: '10px', background: '#ff69b4', color: '#fff',
            border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '10px', opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          Initialize Site Settings
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '8px', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)' }}>
        Global Configuration
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', margin: 0 }}>
          Settings
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '9px 18px', borderRadius: '8px',
            background: saved ? 'rgba(52,211,153,0.15)' : 'rgba(255,105,180,0.12)',
            border: saved ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(255,105,180,0.35)',
            color: saved ? '#34d399' : '#ff69b4',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} /> : <Save size={13} />}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save All'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ─── Identity ─── */}
        <SettingsSection title="Identity" accent="#ff69b4" icon={<Type size={14} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SettingsField label="Site Title" value={settings.site_title ?? ''} onChange={v => update('site_title', v)} placeholder="WEI IN SIGHT" />
            <SettingsField label="Site Subtitle" value={settings.site_subtitle ?? ''} onChange={v => update('site_subtitle', v)} placeholder="The creative atlas…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SettingsField label="Favicon URL" value={settings.favicon_url ?? ''} onChange={v => update('favicon_url', v)} placeholder="/favicon.ico" icon={<ImageIcon size={13} />} />
            <SettingsField label="Brand Wordmark URL" value={settings.brand_wordmark_url ?? ''} onChange={v => update('brand_wordmark_url', v)} placeholder="/assets/wordmark.svg" icon={<ImageIcon size={13} />} />
          </div>
        </SettingsSection>

        {/* ─── Form Routing ─── */}
        <SettingsSection title="Form Routing" accent="#60a5fa" icon={<Mail size={14} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SettingsField label="Primary Contact Email" value={settings.primary_email ?? ''} onChange={v => update('primary_email', v)} placeholder="hello@domain.com" icon={<Mail size={13} />} />
            <SettingsField label="Notification Email" value={settings.notification_email ?? ''} onChange={v => update('notification_email', v)} placeholder="notifications@domain.com" icon={<Mail size={13} />} />
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)', margin: '0', lineHeight: '1.6' }}>
            All Contact and Commission form submissions will be forwarded to the <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Notification Email</strong>.
          </p>
        </SettingsSection>

        {/* ─── Social Ecosystem ─── */}
        <SettingsSection title="Social Ecosystem" accent="#34d399" icon={<Globe size={14} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SettingsField label="Instagram" value={settings.instagram_url ?? ''} onChange={v => update('instagram_url', v)} placeholder="https://instagram.com/…" icon={<LinkIcon size={13} />} />
            <SettingsField label="YouTube" value={settings.youtube_url ?? ''} onChange={v => update('youtube_url', v)} placeholder="https://youtube.com/@…" icon={<Video size={13} />} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SettingsField label="Spotify" value={settings.spotify_url ?? ''} onChange={v => update('spotify_url', v)} placeholder="https://open.spotify.com/artist/…" icon={<Music size={13} />} />
            <SettingsField label="Apple Music" value={settings.apple_music_url ?? ''} onChange={v => update('apple_music_url', v)} placeholder="https://music.apple.com/…" icon={<Music size={13} />} />
          </div>
        </SettingsSection>

        {/* ─── SEO ─── */}
        <SettingsSection title="SEO Defaults" accent="#fbbf24" icon={<KeyRound size={14} />}>
          <SettingsField label="Default Meta Description" value={settings.seo_description ?? ''} onChange={v => update('seo_description', v)} placeholder="A multidisciplinary creative portfolio…" multiline />
          <SettingsField label="SEO Keywords" value={settings.seo_keywords ?? ''} onChange={v => update('seo_keywords', v)} placeholder="art, portfolio, cinematic, painting…" />
        </SettingsSection>


        {/* ─── Database Tools ─── */}
        <SettingsSection title="Database Tools" accent="#ef4444" icon={<Database size={14} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'var(--font-inter)' }}>
              Populate the CMS with the original placeholder mock content. This is useful for initializing the site structure without manually recreating everything.
            </p>
            <button
              onClick={handleSeedMockContent}
              disabled={seeding || seedComplete}
              style={{
                alignSelf: 'flex-start',
                marginTop: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: seedComplete ? 'rgba(52,211,153,0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: seedComplete ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: seedComplete ? '#34d399' : '#ef4444',
                fontSize: '12px',
                fontFamily: 'var(--font-inter)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: seeding ? 'wait' : 'pointer'
              }}
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : seedComplete ? <CheckCircle size={14} /> : <Database size={14} />}
              {seeding ? 'Seeding Database...' : seedComplete ? 'Seed Complete!' : 'Seed Mock Content'}
            </button>
          </div>
        </SettingsSection>

      </div>
    </div>
  );
}
