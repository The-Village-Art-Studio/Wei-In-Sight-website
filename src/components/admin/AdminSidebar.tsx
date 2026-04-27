'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_SECTIONS } from '@/lib/constants';
import { ChevronDown, LogOut, Settings, LayoutDashboard, Trophy, Users } from 'lucide-react';

// Maps each section's submenus to the corresponding admin edit page
function buildAdminHref(sectionId: string, submenuId: string) {
  return `/admin/content/${sectionId}/${submenuId}`;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(
    // Auto-expand the section that matches the current path
    NAV_SECTIONS.find(s => pathname?.includes(`/admin/content/${s.id}`))?.id ?? null
  );

  const toggleSection = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      background: '#0a0a0a',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>

      {/* Brand */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', color: '#ff69b4' }}>
            WEI IN SIGHT
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>
            Control Room
          </div>
        </Link>
      </div>

      {/* Dashboard Link */}
      <div style={{ padding: '16px 14px 8px' }}>
        <NavItem
          href="/admin"
          label="Dashboard"
          icon={<LayoutDashboard size={14} />}
          active={pathname === '/admin'}
        />
      </div>

      {/* Divider label */}
      <div style={{ padding: '4px 24px 8px', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
        Site Sections
      </div>

      {/* Scrollable nav area */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
        {NAV_SECTIONS.map((section) => {
          const isExpanded = expanded === section.id;
          const sectionAccent = section.editorial.accentColor ?? '#ff69b4';
          const isActiveParent = pathname?.includes(`/admin/content/${section.id}`);

          return (
            <div key={section.id} style={{ marginBottom: '2px' }}>
              {/* Section header / collapsible trigger */}
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: isActiveParent ? `${sectionAccent}12` : 'transparent',
                  border: isActiveParent ? `1px solid ${sectionAccent}30` : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  gap: '8px',
                }}
                onMouseEnter={e => { if (!isActiveParent) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActiveParent) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Accent dot */}
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: sectionAccent,
                    opacity: isActiveParent || isExpanded ? 1 : 0.3,
                    flexShrink: 0,
                    transition: 'opacity 0.15s',
                  }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActiveParent ? sectionAccent : 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-outfit)',
                    }}>
                      {section.label}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.04em',
                      marginTop: '1px',
                    }}>
                      {section.poeticLabel}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={13}
                  style={{
                    color: 'rgba(255,255,255,0.3)',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}
                />
              </button>

              {/* Sub-items */}
              {isExpanded && (
                <div style={{
                  paddingLeft: '28px',
                  paddingTop: '2px',
                  paddingBottom: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  borderLeft: `1px solid ${sectionAccent}25`,
                  marginLeft: '18px',
                  marginBottom: '4px',
                }}>
                  {section.submenus.map((sub) => {
                    const subHref = buildAdminHref(section.id, sub.id);
                    const isActive = pathname === subHref;
                    return (
                      <Link
                        key={sub.id}
                        href={subHref}
                        style={{
                          display: 'block',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: isActive ? sectionAccent : 'rgba(255,255,255,0.5)',
                          background: isActive ? `${sectionAccent}10` : 'transparent',
                          textDecoration: 'none',
                          letterSpacing: '0.04em',
                          transition: 'all 0.12s ease',
                          fontFamily: 'var(--font-inter)',
                        }}
                        onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; } }}
                        onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Special pages */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavItem
            href="/admin/exhibitions"
            label="Exhibitions & Features"
            icon={<Trophy size={14} />}
            active={pathname?.startsWith('/admin/exhibitions') ?? false}
          />
          <NavItem
            href="/admin/crm"
            label="Inquiries / CRM"
            icon={<Users size={14} />}
            active={pathname?.startsWith('/admin/crm') ?? false}
          />
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <NavItem href="/admin/settings" label="Settings" icon={<Settings size={14} />} active={pathname === '/admin/settings'} />
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 12px',
          borderRadius: '8px',
          background: 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
          color: 'rgba(239,68,68,0.7)',
          fontSize: '12px',
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-inter)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)'; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'var(--font-inter)',
        color: active ? '#ff69b4' : 'rgba(255,255,255,0.55)',
        background: active ? 'rgba(255,105,180,0.1)' : 'transparent',
        border: active ? '1px solid rgba(255,105,180,0.2)' : '1px solid transparent',
        textDecoration: 'none',
        letterSpacing: '0.06em',
        transition: 'all 0.12s ease',
      }}
    >
      <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
      {label}
    </Link>
  );
}
