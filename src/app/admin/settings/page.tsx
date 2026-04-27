'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, CheckCircle, Globe, Mail, Music, Link as LinkIcon, Video, KeyRound, Type, Image as ImageIcon } from 'lucide-react';

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

  const update = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
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
      <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
        No settings found. Run the database seed script first.
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

      </div>
    </div>
  );
}
