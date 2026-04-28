import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MOCK_CONTENT } from '@/lib/mockContent';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key !== 'weibeiseed123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing service role credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const logs: string[] = [];

  try {
    for (const [sectionSlug, content] of Object.entries(MOCK_CONTENT)) {
      logs.push(`Processing ${sectionSlug}...`);
      
      // 1. Upsert Page
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .upsert({
          section_key: content.sectionId,
          slug: content.slug,
          title: content.title,
          subtitle: content.subtitle || null,
          hero_image_url: content.heroImage || null,
        }, { onConflict: 'section_key,slug' })
        .select()
        .single();

      if (pageError) {
        logs.push(`Error inserting page ${sectionSlug}: ${pageError.message}`);
        continue;
      }

      // 2. Insert Albums & Items
      if (content.albums && content.albums.length > 0) {
        await supabase.from('albums').delete().eq('page_id', page.id);

        for (let i = 0; i < content.albums.length; i++) {
          const mockAlbum = content.albums[i];
          const { data: album, error: albumError } = await supabase
            .from('albums')
            .insert({
              page_id: page.id,
              title: mockAlbum.title,
              description: mockAlbum.description || null,
              sort_order: i
            })
            .select()
            .single();

          if (albumError) {
            logs.push(`Error inserting album ${mockAlbum.title}: ${albumError.message}`);
            continue;
          }

          if (mockAlbum.items && mockAlbum.items.length > 0) {
            const itemsToInsert = mockAlbum.items.map((item, idx) => ({
              album_id: album.id,
              title: item.title,
              description: item.description || null,
              media_url: item.url,
              media_type: 'image',
              year: item.year || null,
              medium: item.medium || null,
              sort_order: idx
            }));
            await supabase.from('album_items').insert(itemsToInsert);
          }
        }
      }

      // 3. Insert Gallery Blocks
      const galleryBlock = content.blocks.find(b => b.type === 'gallery' || b.type === 'video-gallery');
      if (galleryBlock && galleryBlock.items && galleryBlock.items.length > 0) {
        await supabase.from('page_gallery_items').delete().eq('page_id', page.id);
        
        const itemsToInsert = galleryBlock.items.map((item: any, idx: number) => ({
          page_id: page.id,
          title: item.title || null,
          description: item.description || null,
          media_url: item.url,
          media_type: galleryBlock.type === 'video-gallery' ? 'video' : 'image',
          year: item.year || null,
          medium: item.medium || null,
          sort_order: idx
        }));
        await supabase.from('page_gallery_items').insert(itemsToInsert);
      }

      // 4. Exhibitions
      if (content.slug === 'exhibitions-features') {
        const exhBlock = content.blocks.find(b => b.type === 'exhibition-list');
        if (exhBlock && exhBlock.exhibitionItems && exhBlock.exhibitionItems.length > 0) {
          // Careful: this deletes all exhibitions since there is no page_id for them
          await supabase.from('exhibitions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
          
          const itemsToInsert = exhBlock.exhibitionItems.map((item: any, idx: number) => ({
            title: item.title,
            location: item.location || null,
            year: item.year || null,
            is_award: item.isAward || false,
            sort_order: idx
          }));
          await supabase.from('exhibitions').insert(itemsToInsert);
        }
      }

      // 5. Buy Art Logos
      if (content.slug === 'buy-art') {
        const logoBlock = content.blocks.find(b => b.type === 'logo-grid');
        if (logoBlock && logoBlock.logoItems && logoBlock.logoItems.length > 0) {
          await supabase.from('buy_art_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          const itemsToInsert = logoBlock.logoItems.map((item: any, idx: number) => ({
            title: item.title,
            description: item.description || null,
            logo_url: item.logoUrl,
            link: item.link || null,
            sort_order: idx
          }));
          await supabase.from('buy_art_items').insert(itemsToInsert);
        }
      }
    }

    logs.push('Seed completed successfully!');
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 });
  }
}
