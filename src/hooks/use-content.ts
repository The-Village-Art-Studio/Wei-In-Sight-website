import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DeepContent, GalleryItem, Album, ContentBlock } from '@/lib/mockContent';

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

        // 2. Fetch Albums (if any)
        const { data: albumsData } = await supabase
          .from('albums')
          .select('*')
          .eq('page_id', pageData.id)
          .order('sort_order');

        let albums: Album[] = [];
        if (albumsData) {
          for (const album of albumsData) {
            const { data: items } = await supabase
              .from('album_items')
              .select('*')
              .eq('album_id', album.id)
              .order('sort_order');
            
            albums.push({
              id: album.id,
              title: album.title,
              description: album.description,
              coverImages: items ? items.slice(0, 3).map(i => i.media_url) : [],
              items: (items || []).map(i => ({
                id: i.id,
                url: i.media_url,
                title: i.title,
                year: i.year,
                medium: i.medium,
                description: i.description,
                link: i.link
              }))
            });
          }
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

        setContent({
          id: pageData.id,
          slug: pageData.slug,
          sectionId: pageData.section_key,
          title: pageData.title,
          subtitle: pageData.subtitle,
          heroImage: pageData.hero_image_url,
          blocks,
          albums
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
      const { data: albumData } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single();

      if (albumData) {
        const { data: items } = await supabase
          .from('album_items')
          .select('*')
          .eq('album_id', albumData.id)
          .order('sort_order');

        setAlbum({
          id: albumData.id,
          title: albumData.title,
          description: albumData.description,
          coverImages: items ? items.slice(0, 3).map(i => i.media_url) : [],
          items: (items || []).map(i => ({
            id: i.id,
            url: i.media_url,
            title: i.title,
            year: i.year,
            medium: i.medium,
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
