import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { CommunityDetailView } from 'src/sections/dashboard/community/view';

// ----------------------------------------------------------------------

export default function CommunityDetailPage() {
  const { id } = useParams();

  const metadata = {
    title: `Community Details | ${CONFIG.site.name}`,
    description: 'View community details',
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <CommunityDetailView communityId={id} />
    </>
  );
}

