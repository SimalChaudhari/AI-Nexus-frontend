import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CommunitiesView } from 'src/sections/dashboard/community/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Communities | ${CONFIG.site.name}`,
  description: 'Discover and join AI communities',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <CommunitiesView />
    </>
  );
}

