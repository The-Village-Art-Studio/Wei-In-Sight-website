'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NAV_SECTIONS } from '@/lib/constants';
import {
  LayoutDashboard, Image, BookOpen, Trophy, Folder, Users, ArrowUpRight, Clock
} from 'lucide-react';

interface Stats {
  pages: number;
  albums: number;
  images: number;
  exhibitions: number;
  inquiries: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ pages: 0, albums: 0, images: 0, exhibitions: 0, inquiries: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('pages').select('id', { count: 'exact', head: true }),
      supabase.from('albums').select('id', { count: 'exact', head: true }),
      supabase.from('album_items').select('id', { count: 'exact', head: true }),
      supabase.from('exhibitions').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }),
    ]).then(([p, al, ai, ex, inq]) => {
      setStats({
        pages: p.count ?? 0,
        albums: al.count ?? 0,
        images: ai.count ?? 0,
        exhibitions: ex.count ?? 0,
        inquiries: inq.count ?? 0,
      });
    });
  }, []);

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
          Control Room
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 200, color: '#fff', letterSpacing: '0.06em', fontFamily: 'var(--font-outfit)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontFamily: 'var(--font-inter)' }}>
          Welcome back, Jacky. Here's your site at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '44px' }}>
        {[
          { label: 'Sub-Pages', value: stats.pages, icon: <LayoutDashboard size={16} />, color: '#ff69b4' },
          { label: 'Folders', value: stats.albums, icon: <Folder size={16} />, color: '#a78bfa' },
          { label: 'Images', value: stats.images, icon: <Image size={16} />, color: '#34d399' },
          { label: 'Exhibitions', value: stats.exhibitions, icon: <Trophy size={16} />, color: '#fbbf24' },
          { label: 'Inquiries', value: stats.inquiries, icon: <Users size={16} />, color: '#60a5fa' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '20px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: s.color, opacity: 0.8 }}>
              {s.icon}
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>
                {s.label}
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 200, color: '#fff', fontFamily: 'var(--font-outfit)', letterSpacing: '-0.01em' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Site Map — quick navigation */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px', fontFamily: 'var(--font-inter)' }}>
          Quick Edit — Site Sections
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {NAV_SECTIONS.map((section) => {
            const accent = section.editorial.accentColor ?? '#ff69b4';
            return (
              <div key={section.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent, display: 'block', opacity: 0.8 }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-outfit)' }}>
                      {section.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)' }}>
                      {section.poeticLabel}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {section.submenus.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/admin/content/${section.id}/${sub.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-inter)',
                        letterSpacing: '0.03em',
                        transition: 'all 0.12s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = accent;
                        (e.currentTarget as HTMLElement).style.background = `${accent}12`;
                        (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      }}
                    >
                      {sub.label}
                      <ArrowUpRight size={10} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {[
          { label: 'Exhibitions & Features', href: '/admin/exhibitions', color: '#fbbf24', desc: 'Add, edit, reorder exhibition entries.' },
          { label: 'Inquiries / CRM', href: '/admin/crm', color: '#60a5fa', desc: 'Review contact and commission leads.' },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'block',
            background: `${item.color}08`,
            border: `1px solid ${item.color}20`,
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}12`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}08`; }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: item.color, letterSpacing: '0.06em', fontFamily: 'var(--font-outfit)', marginBottom: '4px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
              {item.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
