'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, StickyNote } from 'lucide-react';
import { FieldInput, SaveButton } from '@/components/admin/PageContentEditor';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  notes: string;
  outcome: string; // 'pending' | 'won' | 'lost'
  status: string;
  created_at: string;
}

const OUTCOME_COLORS: Record<string, string> = {
  pending: '#fbbf24',
  won: '#34d399',
  lost: '#ef4444',
};

export default function CommissionsCRMPage() {
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
      .eq('type', 'commission')
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

  // Metrics
  const total = items.length;
  const won = items.filter(i => i.outcome === 'won').length;
  const lost = items.filter(i => i.outcome === 'lost').length;
  const pending = items.filter(i => !i.outcome || i.outcome === 'pending').length;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
        Pulse / Commissions
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '24px' }}>
        Commissions CRM
      </h1>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Total', value: total, color: 'rgba(255,255,255,0.5)' },
          { label: 'Pending', value: pending, color: '#fbbf24' },
          { label: 'Won', value: won, color: '#34d399' },
          { label: 'Lost', value: lost, color: '#ef4444' },
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
              <Loader2 size={24} color="#a78bfa" className="animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
              No commission inquiries yet. They will appear here when submitted through the public form.
            </div>
          ) : items.map(item => {
            const oc = item.outcome || 'pending';
            return (
              <button key={item.id} onClick={() => setSelected(item)} style={{
                display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                background: selected?.id === item.id ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
                border: selected?.id === item.id ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Briefcase size={13} color="#a78bfa" />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)', flex: 1 }}>{item.name}</span>
                  <span style={{
                    fontSize: '9px', padding: '2px 8px', borderRadius: '10px',
                    background: `${OUTCOME_COLORS[oc]}15`,
                    border: `1px solid ${OUTCOME_COLORS[oc]}40`,
                    color: OUTCOME_COLORS[oc],
                    fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{oc}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>{item.email}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-inter)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} />
                  {new Date(item.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{selected.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter)', marginTop: '2px' }}>{selected.email}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            {/* Message */}
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter)', lineHeight: '1.7', marginBottom: '16px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {selected.message}
            </div>

            {/* Outcome */}
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>Outcome</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {(['pending', 'won', 'lost'] as const).map(o => (
                <button key={o} onClick={() => updateField('outcome', o)} style={{
                  padding: '6px 14px', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-inter)', textTransform: 'capitalize',
                  background: selected.outcome === o ? `${OUTCOME_COLORS[o]}15` : 'rgba(255,255,255,0.04)',
                  border: selected.outcome === o ? `1px solid ${OUTCOME_COLORS[o]}40` : '1px solid rgba(255,255,255,0.08)',
                  color: selected.outcome === o ? OUTCOME_COLORS[o] : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                }}>
                  {o === 'won' && <CheckCircle size={11} style={{ marginRight: '4px', verticalAlign: '-2px' }} />}
                  {o === 'lost' && <XCircle size={11} style={{ marginRight: '4px', verticalAlign: '-2px' }} />}
                  {o === 'pending' && <AlertCircle size={11} style={{ marginRight: '4px', verticalAlign: '-2px' }} />}
                  {o}
                </button>
              ))}
            </div>

            {/* Notes */}
            <FieldInput label="Internal Notes" value={selected.notes ?? ''} onChange={v => updateField('notes', v)} multiline placeholder="Add notes about this commission..." />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', gap: '8px' }}>
              <a href={`mailto:${selected.email}`} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa',
                textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-inter)',
              }}>Reply via Email</a>
              <SaveButton saving={saving} saved={saved} accent="#a78bfa" onClick={handleSave} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
