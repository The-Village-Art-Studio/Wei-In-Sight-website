import { NAV_SECTIONS } from '@/lib/constants';
import PageContentEditor from '@/components/admin/PageContentEditor';

interface Props {
  params: Promise<{ section: string; slug: string }>;
}

export default async function ContentPage({ params }: Props) {
  const { section: sectionId, slug } = await params;
  const section = NAV_SECTIONS.find(s => s.id === sectionId);
  const submenu = section?.submenus.find(s => s.id === slug);

  if (!section || !submenu) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.4)', paddingTop: '80px', textAlign: 'center', fontFamily: 'var(--font-inter)' }}>
        Page not found.
      </div>
    );
  }

  return <PageContentEditor section={section} submenu={submenu} />;
}
