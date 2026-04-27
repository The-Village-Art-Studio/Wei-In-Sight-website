'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Clock, CheckCircle, AlertTriangle, StickyNote } from 'lucide-react';
import { FieldInput, SaveButton } from '@/components/admin/PageContentEditor';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  notes: string;
  outcome: string; // 'replied' | 'need_follow_up'
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  replied: '#34d399',
  need_follow_up: '#fbbf24',
  new: '#60a5fa',
};

export default function ContactCRMPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .eq('type', 'contact')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  const updateField = (field: string, value: string) => {
    if (!selected) return;
    setSelected({ ...selected, [field]: value });
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await supabase.from('inquiries').update({
      notes: selected.notes,
      outcome: selected.outcome,
      status: selected.status,
    }).eq('id', selected.id);
    setItems(prev => prev.map(i => i.id === selected.id ? selected : i));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const total = items.length;
  const replied = items.filter(i => i.outcome === 'replied').length;
  const needFollowUp = items.filter(i => i.outcome === 'need_follow_up').length;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
        Pulse / Contact
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '24px' }}>
        Contact Inquiries
      </h1>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Total', value: total, color: '#60a5fa' },
          { label: 'Replied', value: replied, color: '#34d399' },
          { label: 'Need Follow-up', value: needFollowUp, color: '#fbbf24' },
        ].map(m => (
          <div key={m.label} style={{
            padding: '16px 18px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: m.color, fontFamily: 'var(--font-inter)', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 200, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '14px' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Loader2 size={24} color="#60a5fa" className="animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
              No contact inquiries yet. They will appear here when submitted through the public form.
            </div>
          ) : items.map(item => {
            const oc = item.outcome || 'new';
            const statusColor = STATUS_COLORS[oc] || '#60a5fa';
            return (
              <button key={item.id} onClick={() => setSelected(item)} style={{
                display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                background: selected?.id === item.id ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                border: selected?.id === item.id ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Mail size={13} color="#60a5fa" />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)', flex: 1 }}>{item.name}</span>
                  <span style={{
                    fontSize: '9px', padding: '2px 8px', borderRadius: '10px',
                    background: `${statusColor}15`, border: `1px solid ${statusColor}40`, color: statusColor,
                    fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{oc.replace('_', ' ')}</span>
                </div>
                {item.subject && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>{item.subject}</div>}
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-inter)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} />
                  {new Date(item.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{selected.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter)', marginTop: '2px' }}>{selected.email}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter)', lineHeight: '1.7', marginBottom: '16px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {selected.message}
            </div>

            {/* Status */}
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>Status</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {[
                { key: 'new', label: 'New', icon: <Mail size={11} /> },
                { key: 'replied', label: 'Replied', icon: <CheckCircle size={11} /> },
                { key: 'need_follow_up', label: 'Need Follow-up', icon: <AlertTriangle size={11} /> },
              ].map(s => {
                const sc = STATUS_COLORS[s.key] || '#60a5fa';
                return (
                  <button key={s.key} onClick={() => updateField('outcome', s.key)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-inter)',
                    background: selected.outcome === s.key ? `${sc}15` : 'rgba(255,255,255,0.04)',
                    border: selected.outcome === s.key ? `1px solid ${sc}40` : '1px solid rgba(255,255,255,0.08)',
                    color: selected.outcome === s.key ? sc : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                  }}>
                    {s.icon} {s.label}
                  </button>
                );
              })}
            </div>

            {/* Notes */}
            <FieldInput label="Internal Notes" value={selected.notes ?? ''} onChange={v => updateField('notes', v)} multiline placeholder="Add notes..." />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', gap: '8px' }}>
              <a href={`mailto:${selected.email}`} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa',
                textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-inter)',
              }}>Reply via Email</a>
              <SaveButton saving={saving} saved={saved} accent="#60a5fa" onClick={handleSave} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
