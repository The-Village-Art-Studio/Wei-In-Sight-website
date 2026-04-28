'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Section, SubMenu } from '@/lib/constants';
import {
  Plus, Trash2, GripVertical, Save, Loader2, Film, Image as ImageIcon, ExternalLink, CheckCircle
} from 'lucide-react';
import SupabaseUploader from './SupabaseUploader';

interface CollectionItem {
  id: string;
  title: string;
  media_url: string;
  year: string;
  medium: string;
  size: string;
  sort_order: number;
}

interface Props {
  section: Section;
  submenu: SubMenu;
}

export default function CollectionEditor({ section, submenu }: Props) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const accent = section.editorial.accentColor ?? '#ff69b4';
  const isVideo = submenu.id === 'audio-visual-work';

  useEffect(() => {
    fetchItems();
  }, [submenu.id]);

  const fetchItems = async () => {
    setLoading(true);

    // Find or create the collection record
    const { data: col } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', submenu.id)
      .single();

    if (col?.id) {
      setCollectionId(col.id);
      const { data: itemData } = await supabase
        .from('collection_items')
        .select('*')
        .eq('collection_id', col.id)
        .order('sort_order');
      setItems(itemData ?? []);
    } else {
      setItems([]);
    }

    setLoading(false);
  };

  const handleAddItem = () => {
    const newItem: CollectionItem = {
      id: `new_${Date.now()}`,
      title: '',
      media_url: '',
      year: '',
      medium: '',
      size: '',
      sort_order: items.length,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdate = (id: string, field: keyof CollectionItem, value: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = async (item: CollectionItem) => {
    if (!collectionId) return;
    setSaving(item.id);

    const payload = {
      collection_id: collectionId,
      title: item.title,
      media_url: item.media_url,
      year: item.year,
      medium: item.medium,
      size: item.size,
      sort_order: item.sort_order,
    };

    if (item.id.startsWith('new_')) {
      const { data, error } = await supabase.from('collection_items').insert(payload).select().single();
      if (!error && data) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, id: data.id } : i));
      }
    } else {
      await supabase.from('collection_items').update(payload).eq('id', item.id);
    }

    setSaving(null);
  };

  const handleDelete = async (item: CollectionItem) => {
    if (window.confirm('Are you sure you want to remove this item? This will also delete the file from the server.')) {
      if (!item.id.startsWith('new_')) {
        await supabase.from('collection_items').delete().eq('id', item.id);
      }
      if (item.media_url) await deleteFileFromStorage(item.media_url);
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={28} color={accent} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
          {section.label} / {submenu.label}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#fff', letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)', marginBottom: '8px' }}>
          {submenu.label}
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
          {isVideo ? 'Manage YouTube video links in this gallery.' : 'Manage images and artwork entries.'}
        </p>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {items.length === 0 ? (
          <div style={{
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '13px',
            fontFamily: 'var(--font-inter)',
          }}>
            No items yet. Click "Add {isVideo ? 'Video' : 'Image'}" to get started.
          </div>
        ) : items.map((item, idx) => (
          <ItemCard
            key={item.id}
            item={item}
            accent={accent}
            isVideo={isVideo}
            saving={saving === item.id}
            onUpdate={handleUpdate}
            onSave={handleSave}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAddItem}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 20px',
          borderRadius: '10px',
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          color: accent,
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'var(--font-inter)',
          letterSpacing: '0.06em',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accent}28`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${accent}18`; }}
      >
        <Plus size={15} />
        Add {isVideo ? 'Video' : 'Image'}
      </button>
    </div>
  );
}

function ItemCard({
  item, accent, isVideo, saving,
  onUpdate, onSave, onDelete
}: {
  item: CollectionItem;
  accent: string;
  isVideo: boolean;
  saving: boolean;
  onUpdate: (id: string, field: keyof CollectionItem, value: string) => void;
  onSave: (item: CollectionItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '20px 20px 16px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      {/* Drag handle placeholder */}
      <div style={{ paddingTop: '12px', color: 'rgba(255,255,255,0.2)', cursor: 'grab', flexShrink: 0 }}>
        <GripVertical size={16} />
      </div>

      {/* Thumbnail */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {item.media_url && !isVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : isVideo ? (
          <Film size={20} color="rgba(255,255,255,0.25)" />
        ) : (
          <ImageIcon size={20} color="rgba(255,255,255,0.25)" />
        )}
      </div>

      {/* Fields */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <FieldInput
            label={isVideo ? 'YouTube URL' : 'Image URL'}
            value={item.media_url}
            onChange={v => onUpdate(item.id, 'media_url', v)}
            placeholder={isVideo ? 'https://www.youtube.com/embed/...' : 'https://...'}
          />
          {!isVideo && (
            <div style={{ marginTop: '8px' }}>
              <SupabaseUploader 
                accent={accent} 
                buttonText="Upload Image" 
                onUpload={(url) => {
                  if (item.media_url) deleteFileFromStorage(item.media_url);
                  onUpdate(item.id, 'media_url', url);
                }} 
              />
            </div>
          )}
        </div>
        <FieldInput label="Title" value={item.title} onChange={v => onUpdate(item.id, 'title', v)} placeholder="e.g. Untitled No. 4" />
        <FieldInput label="Year" value={item.year} onChange={v => onUpdate(item.id, 'year', v)} placeholder="e.g. 2024" />
        {!isVideo && <FieldInput label="Medium" value={item.medium} onChange={v => onUpdate(item.id, 'medium', v)} placeholder="e.g. Oil on Canvas" />}
        {!isVideo && <FieldInput label="Size (optional)" value={item.size ?? ''} onChange={v => onUpdate(item.id, 'size', v)} placeholder="e.g. 24x36 inches" />}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, paddingTop: '4px' }}>
        <button
          onClick={() => onSave(item)}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            background: `${accent}18`,
            border: `1px solid ${accent}35`,
            color: accent,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.06em',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} />}
          {saving ? '…' : 'Save'}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: 'rgba(239,68,68,0.7)',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(239,68,68)'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
        >
          <Trash2 size={12} />
          Remove
        </button>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '10px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '5px',
        fontFamily: 'var(--font-inter)',
      }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '13px',
          fontFamily: 'var(--font-inter)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; e.target.style.boxShadow = '0 0 0 2px rgba(255,105,180,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
