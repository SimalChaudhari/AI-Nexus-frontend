import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BuiltWithDetailView } from 'src/sections/built-with/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Project Details | ${CONFIG.site.name}`,
  description: 'View project details and discussion',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <BuiltWithDetailView />
    </>
  );
}

