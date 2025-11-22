import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LabelCreateView } from 'src/sections/dashboard/label/view';

// ----------------------------------------------------------------------

const metadata = { title: `Label create | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LabelCreateView />
    </>
  );
}

