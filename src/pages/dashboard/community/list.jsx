import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CommunityListView } from 'src/sections/community/view';

// ----------------------------------------------------------------------

const metadata = { title: `Community list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CommunityListView />
    </>
  );
}

