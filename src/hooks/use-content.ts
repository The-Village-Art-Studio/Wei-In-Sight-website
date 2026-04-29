import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DeepContent, GalleryItem, Album, ContentBlock, MOCK_CONTENT } from '@/lib/mockContent';

export function useContent(sectionId: string, slug: string) {
  const [content, setContent] = useState<DeepContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch Page Metadata
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('section_key', sectionId)
          .eq('slug', slug)
          .single();

        if (pageError || !pageData) {
          // If not found in DB, fallback to null (ContentPage will handle it)
          setContent(null);
          setLoading(false);
          return;
        }

        // 2. Fetch Albums with their items in a single query
        const { data: albumsData } = await supabase
          .from('albums')
          .select('*, items:album_items(*)')
          .eq('page_id', pageData.id)
          .order('sort_order');

        let albums: Album[] = [];
        if (albumsData) {
          albums = albumsData.map(album => {
            const items = (album.items || []) as any[];
            // Sort items locally since we can't easily order nested select in a single order call for some supabase versions
            const sortedItems = [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            
            return {
              id: album.id,
              title: album.title,
              description: album.description,
              coverImages: sortedItems.slice(0, 3).map(i => i.media_url),
              items: sortedItems.map(i => ({
                id: i.id,
                url: i.media_url,
                title: i.title,
                year: i.year,
                medium: i.medium,
                size: i.size,
                description: i.description,
                link: i.link
              }))
            };
          });
        }

        // 3. Fetch Flat Gallery Items
        const { data: galleryData } = await supabase
          .from('page_gallery_items')
          .select('*')
          .eq('page_id', pageData.id)
          .order('sort_order');

        const blocks: ContentBlock[] = [];
        
        // Special Case: About Page Profile Photo
        if (slug === 'about' && pageData.hero_image_url) {
          blocks.push({
            type: 'profile-photo',
            url: pageData.hero_image_url
          });
        }
        // For now, if there's flat gallery data, add it as a block
        if (galleryData && galleryData.length > 0) {
          blocks.push({
            type: slug === 'audio-visual-work' ? 'video-gallery' : 'gallery',
            items: galleryData.map(i => ({
              id: i.id,
              url: i.media_url,
              title: i.title,
              year: i.year,
              medium: i.medium,
              size: i.size,
              description: i.description,
              link: i.link
            }))
          });
        }

        // Special Case: Exhibitions
        if (slug === 'exhibitions-features') {
          const { data: exhData } = await supabase
            .from('exhibitions')
            .select('*')
            .order('sort_order');
          if (exhData) {
            blocks.push({
              type: 'exhibition-list',
              exhibitionItems: exhData.map(e => ({
                title: e.title,
                location: e.location,
                year: e.year,
                isAward: e.is_award
              }))
            });
          }
        }

        // Special Case: Buy Art
        if (slug === 'buy-art') {
          const { data: buyData } = await supabase
            .from('buy_art_items')
            .select('*')
            .order('sort_order');
          if (buyData) {
            blocks.push({
              type: 'logo-grid',
              logoItems: buyData.map(b => ({
                logoUrl: b.logo_url,
                title: b.title,
                description: b.description,
                link: b.link,
                preserveColor: true
              }))
            });
          }
        }

        // --- MERGE LOGIC ---
        // We start with the static mock content because the CMS doesn't yet support
        // rich text blocks, pillar grids, audio players, etc.
        const staticContent = MOCK_CONTENT[`${sectionId}/${slug}`];
        
        // Filter out blocks from staticContent that we are going to replace with DB data
        // If the page exists in the DB, we consider the DB the source of truth for these dynamic blocks.
        const hasGallery = blocks.some(b => b.type === 'gallery' || b.type === 'video-gallery');
        const hasExhibitions = blocks.some(b => b.type === 'exhibition-list');
        const hasBuyArt = blocks.some(b => b.type === 'logo-grid');

        const preserveBlocks = staticContent?.blocks?.filter(b => {
          // If the page record exists (pageData), we hide these static equivalents because the user 
          // might have intentionally deleted all items in the CMS.
          // We hide all types that the CMS is now capable of managing.
          const managedTypes = ['gallery', 'video-gallery', 'exhibition-list', 'logo-grid', 'profile-photo', 'text'];
          if (managedTypes.includes(b.type)) return false;
          
          return true;
        }) || [];

        setContent({
          id: pageData.id,
          slug: pageData.slug,
          sectionId: pageData.section_key,
          title: (pageData.title !== null && pageData.title !== undefined) ? pageData.title : (staticContent?.title || ''),
          subtitle: (pageData.subtitle !== null && pageData.subtitle !== undefined) ? pageData.subtitle : (staticContent?.subtitle || ''),
          heroImage: pageData.hero_image_url || staticContent?.heroImage || '',
          // Combine blocks: place profile-photo first, then preserved static text, then other dynamic blocks
          blocks: [
            ...blocks.filter(b => b.type === 'profile-photo'),
            ...preserveBlocks,
            ...blocks.filter(b => b.type !== 'profile-photo')
          ],
          // If the page is in the DB, the albums list from the DB is the source of truth.
          albums: albums
        });
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (sectionId && slug) {
      fetchData();
    }
  }, [sectionId, slug]);

  return { content, loading, error };
}

export function useAlbum(albumId: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbum() {
      if (!albumId) return;
      setLoading(true);
      
      // Try fetching by ID first (UUID) or Slug with items nested
      let query = supabase.from('albums').select('*, items:album_items(*)');
      
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(albumId);
      if (isUUID) {
        query = query.eq('id', albumId);
      } else {
        query = query.eq('slug', albumId);
      }

      const { data: albumData } = await query.single();

      if (albumData) {
        const items = (albumData.items || []) as any[];
        const sortedItems = [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        setAlbum({
          id: albumData.id,
          title: albumData.title,
          description: albumData.description,
          coverImages: sortedItems.slice(0, 3).map(i => i.media_url),
          items: sortedItems.map(i => ({
            id: i.id,
            url: i.media_url,
            title: i.title,
            year: i.year,
            medium: i.medium,
            size: i.size,
            description: i.description,
            link: i.link
          }))
        });
      }
      setLoading(false);
    }
    fetchAlbum();
  }, [albumId]);

  return { album, loading };
}
