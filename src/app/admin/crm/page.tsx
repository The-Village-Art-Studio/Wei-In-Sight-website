'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, MessageSquare, Briefcase, Archive, Eye, Clock } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'contact' | 'commission';
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#60a5fa',
  read: 'rgba(255,255,255,0.4)',
  replied: '#34d399',
  archived: 'rgba(255,255,255,0.2)',
};

const STATUS_BG: Record<string, string> = {
  new: 'rgba(96,165,250,0.1)',
  read: 'rgba(255,255,255,0.05)',
  replied: 'rgba(52,211,153,0.1)',
  archived: 'rgba(255,255,255,0.03)',
};

export default function CRMPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contact' | 'commission'>('all');

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    setInquiries(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const filtered = inquiries.filter(i => {
    if (filter === 'new') return i.status === 'new';
    if (filter === 'contact') return i.type === 'contact';
    if (filter === 'commission') return i.type === 'commission';
    return true;
  });

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
          Pulse / CRM
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', margin: 0 }}>
            Inquiries
          </h1>
          {newCount > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '11px', fontFamily: 'var(--font-inter)' }}>
              {newCount} new
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {(['all', 'new', 'contact', 'commission'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em', textTransform: 'capitalize',
            background: filter === f ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
            border: filter === f ? '1px solid rgba(96,165,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
            color: filter === f ? '#60a5fa' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '14px' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Loader2 size={24} color="#60a5fa" className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
              No inquiries found.
            </div>
          ) : filtered.map(inquiry => (
            <button key={inquiry.id} onClick={() => { setSelected(inquiry); updateStatus(inquiry.id, inquiry.status === 'new' ? 'read' : inquiry.status); }} style={{
              display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
              background: selected?.id === inquiry.id ? 'rgba(96,165,250,0.08)' : STATUS_BG[inquiry.status],
              border: selected?.id === inquiry.id ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {inquiry.type === 'commission' ? <Briefcase size={13} color="#a78bfa" /> : <Mail size={13} color="#60a5fa" />}
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)', flex: 1 }}>{inquiry.name}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: STATUS_BG[inquiry.status], border: `1px solid ${STATUS_COLORS[inquiry.status]}30`, color: STATUS_COLORS[inquiry.status], fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {inquiry.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', marginBottom: '4px' }}>{inquiry.email}</div>
              {inquiry.subject && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>{inquiry.subject}</div>}
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-inter)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} />
                {new Date(inquiry.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{selected.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter)', marginTop: '2px' }}>{selected.email}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            {selected.subject && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', marginBottom: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }}>
                {selected.subject}
              </div>
            )}

            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter)', lineHeight: '1.7', marginBottom: '20px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {selected.message}
            </div>

            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
              Update Status
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['new', 'read', 'replied', 'archived'] as const).map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--font-inter)', letterSpacing: '0.08em', textTransform: 'capitalize',
                  background: selected.status === s ? STATUS_BG[s] : 'rgba(255,255,255,0.04)',
                  border: selected.status === s ? `1px solid ${STATUS_COLORS[s]}40` : '1px solid rgba(255,255,255,0.08)',
                  color: selected.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                }}>
                  {s}
                </button>
              ))}
            </div>

            <a href={`mailto:${selected.email}`} style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 16px', borderRadius: '8px',
              background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa',
              textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-inter)',
            }}>
              <Mail size={13} /> Reply via Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
