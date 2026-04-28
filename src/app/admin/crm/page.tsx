'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Loader2, Mail, Briefcase, Archive, Clock, TrendingUp, TrendingDown, MessageSquare, AlertCircle, CheckCircle2, StickyNote, Search, Trash2, Edit2, Save, X } from 'lucide-react';
import CRMMetadataEditor from '@/components/admin/CRMMetadataEditor';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'contact' | 'commission';
  status: 'new' | 'read' | 'replied' | 'archived';
  notes: string | null;
  outcome: string | null;
  won_lost: boolean | null;
  follow_up_needed: boolean;
  created_at: string;
  media_url?: string;
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

type CRMView = 'commissions' | 'contact';

export default function CRMPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [view, setView] = useState<CRMView>('commissions');
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'name' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Edit State
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<Inquiry>>({});
  const [savingEdit, setSavingEdit] = useState(false);

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

  const updateWonLost = async (id: string, won_lost: boolean | null) => {
    await supabase.from('inquiries').update({ won_lost }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, won_lost } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, won_lost } : null);
  };

  const toggleFollowUp = async (id: string, value: boolean) => {
    await supabase.from('inquiries').update({ follow_up_needed: value }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, follow_up_needed: value } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, follow_up_needed: value } : null);
  };

  const saveNotes = async (id: string) => {
    setSavingNotes(true);
    await supabase.from('inquiries').update({ notes: notesDraft }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, notes: notesDraft } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, notes: notesDraft } : null);
    setSavingNotes(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry?.media_url) await deleteFileFromStorage(inquiry.media_url);

    await supabase.from('inquiries').delete().eq('id', id);
    setInquiries(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const saveEdit = async (id: string) => {
    setSavingEdit(true);
    await supabase.from('inquiries').update({
      name: editDraft.name,
      email: editDraft.email,
      subject: editDraft.subject,
      message: editDraft.message
    }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...editDraft } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...editDraft } : null);
    setEditMode(false);
    setSavingEdit(false);
  };

  // When selecting an inquiry, prefill the notes draft
  const handleSelect = (inquiry: Inquiry) => {
    setSelected(inquiry);
    setNotesDraft(inquiry.notes ?? '');
    setEditMode(false);
    if (inquiry.status === 'new') updateStatus(inquiry.id, 'read');
  };

  const filtered = useMemo(() => {
    let result = inquiries.filter(i => {
      if (view === 'commissions') return i.type === 'commission';
      return i.type === 'contact';
    });

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.email.toLowerCase().includes(q) || 
        (i.subject && i.subject.toLowerCase().includes(q)) ||
        (i.message && i.message.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'status') {
        const orderMap: Record<string, number> = { new: 0, read: 1, replied: 2, archived: 3 };
        aVal = orderMap[a.status] ?? 4;
        bVal = orderMap[b.status] ?? 4;
      }
      
      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      let comp = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comp = aVal.localeCompare(bVal);
      } else {
        comp = aVal < bVal ? -1 : 1;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return result;
  }, [inquiries, view, searchQuery, sortField, sortOrder]);

  // Metrics for commissions
  const commissionMetrics = useMemo(() => {
    const comms = inquiries.filter(i => i.type === 'commission');
    return {
      total: comms.length,
      won: comms.filter(i => i.won_lost === true).length,
      lost: comms.filter(i => i.won_lost === false).length,
      pending: comms.filter(i => i.won_lost === null).length,
    };
  }, [inquiries]);

  // Metrics for contact
  const contactMetrics = useMemo(() => {
    const contacts = inquiries.filter(i => i.type === 'contact');
    return {
      total: contacts.length,
      needFollowUp: contacts.filter(i => i.follow_up_needed).length,
      replied: contacts.filter(i => i.status === 'replied').length,
      newCount: contacts.filter(i => i.status === 'new').length,
    };
  }, [inquiries]);

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div style={{ maxWidth: '1060px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
          Pulse / CRM
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', margin: 0 }}>
            {view === 'commissions' ? 'Commissions' : 'Contact Inquiries'}
          </h1>
          {newCount > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '11px', fontFamily: 'var(--font-inter)' }}>
              {newCount} new
            </span>
          )}
        </div>
      </div>

      {/* View toggle tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {([
          { key: 'commissions' as const, label: 'Commissions', icon: <Briefcase size={12} />, color: '#a78bfa' },
          { key: 'contact' as const, label: 'Contact', icon: <Mail size={12} />, color: '#60a5fa' },
        ]).map(tab => (
          <button key={tab.key} onClick={() => { setView(tab.key); setSelected(null); }} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
            background: view === tab.key ? `${tab.color}15` : 'rgba(255,255,255,0.04)',
            border: view === tab.key ? `1px solid ${tab.color}35` : '1px solid rgba(255,255,255,0.08)',
            color: view === tab.key ? tab.color : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Page Hero & Metadata Editor */}
      <CRMMetadataEditor slug={view} />

      {/* ─── Metrics strip ─── */}
      {view === 'commissions' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: commissionMetrics.total, color: '#a78bfa' },
            { label: 'Won', value: commissionMetrics.won, color: '#34d399', icon: <TrendingUp size={14} /> },
            { label: 'Lost', value: commissionMetrics.lost, color: '#ef4444', icon: <TrendingDown size={14} /> },
            { label: 'Pending', value: commissionMetrics.pending, color: '#fbbf24' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: m.color, opacity: 0.8 }}>
                {m.icon || <Briefcase size={13} />}
                <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>
                  {m.label}
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 200, color: '#fff', fontFamily: 'var(--font-outfit)' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: contactMetrics.total, color: '#60a5fa' },
            { label: 'New', value: contactMetrics.newCount, color: '#60a5fa', icon: <Mail size={13} /> },
            { label: 'Replied', value: contactMetrics.replied, color: '#34d399', icon: <CheckCircle2 size={13} /> },
            { label: 'Follow Up', value: contactMetrics.needFollowUp, color: '#fbbf24', icon: <AlertCircle size={13} /> },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: m.color, opacity: 0.8 }}>
                {m.icon || <MessageSquare size={13} />}
                <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>
                  {m.label}
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 200, color: '#fff', fontFamily: 'var(--font-outfit)' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ─── Search & Sort Bar ─── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '8px 12px 8px 34px', color: '#fff', fontSize: '12px',
              fontFamily: 'var(--font-inter)', outline: 'none'
            }}
          />
        </div>
        <select
          value={`${sortField}-${sortOrder}`}
          onChange={(e) => {
            const [f, o] = e.target.value.split('-');
            setSortField(f as any);
            setSortOrder(o as any);
          }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px',
            fontFamily: 'var(--font-inter)', outline: 'none', cursor: 'pointer', WebkitAppearance: 'none'
          }}
        >
          <option value="created_at-desc" style={{ color: '#000' }}>Newest First</option>
          <option value="created_at-asc" style={{ color: '#000' }}>Oldest First</option>
          <option value="name-asc" style={{ color: '#000' }}>Name (A-Z)</option>
          <option value="name-desc" style={{ color: '#000' }}>Name (Z-A)</option>
          <option value="status-asc" style={{ color: '#000' }}>Status</option>
        </select>
      </div>

      {/* ─── List + Detail split ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '14px' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Loader2 size={24} color="#60a5fa" className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-inter)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
              No {view === 'commissions' ? 'commissions' : 'contact inquiries'} found.
            </div>
          ) : filtered.map(inquiry => (
            <button key={inquiry.id} onClick={() => handleSelect(inquiry)} style={{
              display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
              background: selected?.id === inquiry.id ? 'rgba(96,165,250,0.08)' : STATUS_BG[inquiry.status],
              border: selected?.id === inquiry.id ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {inquiry.type === 'commission' ? <Briefcase size={13} color="#a78bfa" /> : <Mail size={13} color="#60a5fa" />}
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)', flex: 1 }}>{inquiry.name}</span>

                {/* Commission: Won/Lost badge */}
                {view === 'commissions' && inquiry.won_lost !== null && (
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                    background: inquiry.won_lost ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
                    border: `1px solid ${inquiry.won_lost ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: inquiry.won_lost ? '#34d399' : '#ef4444',
                    fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {inquiry.won_lost ? 'Won' : 'Lost'}
                  </span>
                )}

                {/* Contact: Follow-up badge */}
                {view === 'contact' && inquiry.follow_up_needed && (
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                    background: 'rgba(251,191,36,0.12)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#fbbf24',
                    fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    Follow Up
                  </span>
                )}

                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: STATUS_BG[inquiry.status], border: `1px solid ${STATUS_COLORS[inquiry.status]}30`, color: STATUS_COLORS[inquiry.status], fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {inquiry.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', marginBottom: '4px' }}>{inquiry.email}</div>
              {inquiry.subject && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>{inquiry.subject}</div>}
              {inquiry.notes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <StickyNote size={10} color="rgba(255,255,255,0.25)" />
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-inter)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{inquiry.notes}</span>
                </div>
              )}
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-inter)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} />
                {new Date(inquiry.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>

        {/* ─── Detail pane ─── */}
        {selected && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              {!editMode ? (
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{selected.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter)', marginTop: '2px' }}>{selected.email}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginRight: '16px' }}>
                  <input value={editDraft.name ?? selected.name} onChange={e => setEditDraft(prev => ({...prev, name: e.target.value}))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '14px', outline: 'none' }} placeholder="Name" />
                  <input value={editDraft.email ?? selected.email} onChange={e => setEditDraft(prev => ({...prev, email: e.target.value}))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} placeholder="Email" />
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!editMode ? (
                  <button onClick={() => { setEditMode(true); setEditDraft({ name: selected.name, email: selected.email, subject: selected.subject, message: selected.message }); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '10px' }}>
                    <Edit2 size={10} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveEdit(selected.id)} disabled={savingEdit} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', cursor: 'pointer', fontSize: '10px' }}>
                      {savingEdit ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />} Save
                    </button>
                    <button onClick={() => setEditMode(false)} style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '10px' }}>
                      Cancel
                    </button>
                  </>
                )}
                <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
            </div>

            {!editMode ? (
              <>
                {selected.subject && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', marginBottom: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }}>
                    {selected.subject}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter)', lineHeight: '1.7', marginBottom: '20px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {selected.message}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <input value={editDraft.subject ?? (selected.subject || '')} onChange={e => setEditDraft(prev => ({...prev, subject: e.target.value}))} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} placeholder="Subject (Optional)" />
                <textarea value={editDraft.message ?? selected.message} onChange={e => setEditDraft(prev => ({...prev, message: e.target.value}))} rows={5} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'vertical' }} placeholder="Message content" />
              </div>
            )}

            {/* ─── Commission-specific: Won/Lost ─── */}
            {view === 'commissions' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
                  Outcome
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { label: 'Won', value: true, color: '#34d399' },
                    { label: 'Lost', value: false, color: '#ef4444' },
                    { label: 'Pending', value: null as boolean | null, color: '#fbbf24' },
                  ].map(opt => (
                    <button key={String(opt.value)} onClick={() => updateWonLost(selected.id, opt.value)} style={{
                      padding: '6px 14px', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
                      background: selected.won_lost === opt.value ? `${opt.color}18` : 'rgba(255,255,255,0.04)',
                      border: selected.won_lost === opt.value ? `1px solid ${opt.color}45` : '1px solid rgba(255,255,255,0.08)',
                      color: selected.won_lost === opt.value ? opt.color : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Contact-specific: Follow-up toggle ─── */}
            {view === 'contact' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={selected.follow_up_needed}
                    onChange={e => toggleFollowUp(selected.id, e.target.checked)}
                    style={{ accentColor: '#fbbf24', width: '14px', height: '14px' }}
                  />
                  <AlertCircle size={13} color={selected.follow_up_needed ? '#fbbf24' : 'rgba(255,255,255,0.3)'} />
                  <span style={{ fontSize: '12px', color: selected.follow_up_needed ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
                    Needs Follow-up
                  </span>
                </label>
              </div>
            )}

            {/* ─── Status ─── */}
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
              Status
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
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

            {/* ─── Notes ─── */}
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
              Internal Notes
            </div>
            <textarea
              value={notesDraft}
              onChange={e => setNotesDraft(e.target.value)}
              placeholder="Add private notes about this inquiry…"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '10px 13px', color: '#fff', fontSize: '12px',
                fontFamily: 'var(--font-inter)', outline: 'none', resize: 'vertical',
                marginBottom: '8px',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <button
              onClick={() => saveNotes(selected.id)}
              disabled={savingNotes}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '7px',
                background: 'rgba(255,105,180,0.1)', border: '1px solid rgba(255,105,180,0.3)',
                color: '#ff69b4', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                marginBottom: '16px',
              }}
            >
              <StickyNote size={11} />
              {savingNotes ? 'Saving…' : 'Save Notes'}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Reply via email */}
              <a href={`mailto:${selected.email}`} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
                background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa',
                textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-inter)',
              }}>
                <Mail size={13} /> Reply via Email
              </a>
              <button onClick={() => handleDelete(selected.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)',
              }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
