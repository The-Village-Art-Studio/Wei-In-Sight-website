'use client';

import { useState, useEffect } from 'react';
import { supabase, deleteFileFromStorage } from '@/lib/supabase';
import { Plus, Trash2, ChevronDown, ChevronRight, Loader2, ChevronUp, ChevronDown as ChevronDownIcon, Save, CheckCircle } from 'lucide-react';
import { FieldInput, SaveButton } from './PageContentEditor';
import AlbumItemsManager from './AlbumItemsManager';

interface Album {
  id: string;
  title: string;
  description: string;
  slug: string;
  sort_order: number;
}

export default function AlbumManager({ pageId, accent }: { pageId: string; accent: string }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchAlbums(); }, [pageId]);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data } = await supabase.from('albums').select('*').eq('page_id', pageId).order('sort_order');
    setAlbums(data ?? []);
    setLoading(false);
  };

  const handleAdd = async () => {
    const slug = `album-${Date.now()}`;
    const { data } = await supabase.from('albums')
      .insert({ page_id: pageId, title: 'New Folder', description: '', slug, sort_order: albums.length })
      .select().single();
    if (data) {
      setAlbums(prev => [...prev, data]);
      setExpanded(data.id);
    }
  };

  const handleSave = async (album: Album) => {
    setSaving(album.id);
    await supabase.from('albums').update({ title: album.title, description: album.description }).eq('id', album.id);
    setSaving(null);
    setSaved(album.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (album: Album) => {
    if (window.confirm(`Are you sure you want to delete "${album.title}" and all its images from the server?`)) {
      // 1. Get all items in this album to delete their files
      const { data: items } = await supabase.from('album_items').select('media_url').eq('album_id', album.id);
      
      // 2. Delete album record (cascade will handle album_items DB records)
      await supabase.from('albums').delete().eq('id', album.id);
      
      // 3. Delete files from storage
      if (items) {
        for (const item of items) {
          if (item.media_url) await deleteFileFromStorage(item.media_url);
        }
      }
      
      setAlbums(prev => prev.filter(a => a.id !== album.id));
    }
  };

  const handleDuplicate = async (album: Album) => {
    const slug = `${album.slug}-copy-${Date.now()}`;
    const { data } = await supabase.from('albums')
      .insert({ 
        page_id: pageId, 
        title: `${album.title} (Copy)`, 
        description: album.description, 
        slug, 
        sort_order: albums.length 
      })
      .select().single();
    if (data) {
      setAlbums(prev => [...prev, data]);
      setExpanded(data.id);
      
      const { data: items } = await supabase.from('album_items').select('*').eq('album_id', album.id);
      if (items && items.length > 0) {
        const newItems = items.map(item => ({
          album_id: data.id,
          media_url: item.media_url,
          title: item.title,
          year: item.year,
          medium: item.medium,
          description: item.description,
          sort_order: item.sort_order
        }));
        await supabase.from('album_items').insert(newItems);
      }
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newItems = [...albums];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setAlbums(newItems.map((item, i) => ({ ...item, sort_order: i })));
  };

  const moveDown = (idx: number) => {
    if (idx === albums.length - 1) return;
    const newItems = [...albums];
    [newItems[idx + 1], newItems[idx]] = [newItems[idx], newItems[idx + 1]];
    setAlbums(newItems.map((item, i) => ({ ...item, sort_order: i })));
  };

  const handleSaveOrder = async () => {
    setSaving('order');
    try {
      const updates = albums.map((album, i) => ({
        id: album.id,
        sort_order: i
      }));

      for (const update of updates) {
        await supabase.from('albums').update({ sort_order: update.sort_order }).eq('id', update.id);
      }
      setSaved('order');
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to save order');
    } finally {
      setSaving(null);
    }
  };

  const updateField = (id: string, field: keyof Album, value: string) => {
    setAlbums(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
      <Loader2 size={22} color={accent} className="animate-spin" />
    </div>
  );

  return (
    <div>
      {albums.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
          No folders yet. Add one below.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {albums.map(album => {
          const isOpen = expanded === album.id;
          return (
            <div key={album.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              {/* Folder header */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); moveUp(albums.indexOf(album)); }} disabled={albums.indexOf(album) === 0} style={{ padding: '2px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                    <ChevronUp size={13} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(albums.indexOf(album)); }} disabled={albums.indexOf(album) === albums.length - 1} style={{ padding: '2px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                    <ChevronDownIcon size={13} />
                  </button>
                </div>
                <button onClick={() => setExpanded(isOpen ? null : album.id)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  {isOpen ? <ChevronDown size={14} color={accent} /> : <ChevronRight size={14} color="rgba(255,255,255,0.4)" />}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{album.title}</div>
                    {album.description && (
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)', marginTop: '1px' }}>{album.description}</div>
                    )}
                  </div>
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDuplicate(album); }} style={{
                    padding: '5px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                  }}>
                    Duplicate
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(album); }} style={{
                    padding: '5px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)',
                    cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)',
                  }}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded editing area */}
              {isOpen && (
                <div style={{ padding: '0 14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <FieldInput label="Folder Title" value={album.title} onChange={v => updateField(album.id, 'title', v)} />
                    <FieldInput label="Sub-line (Description)" value={album.description ?? ''} onChange={v => updateField(album.id, 'description', v)} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <SaveButton
                        saving={saving === album.id}
                        saved={saved === album.id}
                        accent={accent}
                        onClick={() => handleSave(album)}
                      />
                    </div>

                    {/* Images within this folder */}
                    <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontFamily: 'var(--font-inter)' }}>
                        Images in this folder
                      </div>
                      <AlbumItemsManager albumId={album.id} accent={accent} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleAdd} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 16px', borderRadius: '8px',
          background: `${accent}14`, border: `1px solid ${accent}35`, color: accent,
          cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
        }}>
          <Plus size={14} /> Add Folder
        </button>
        {albums.length > 1 && (
          <button onClick={handleSaveOrder} disabled={saving === 'order'} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 16px', borderRadius: '8px',
            background: saved === 'order' ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
            border: saved === 'order' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.1)',
            color: saved === 'order' ? '#34d399' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em',
          }}>
            {saving === 'order' ? <Loader2 size={13} className="animate-spin" /> : saved === 'order' ? <CheckCircle size={13} /> : <Save size={13} />}
            Save Folder Order
          </button>
        )}
      </div>
    </div>
  );
}
