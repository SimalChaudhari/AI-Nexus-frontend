import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BuiltWithView } from 'src/sections/built-with/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Built with AI Nexus | ${CONFIG.site.name}`,
  description: 'Discover amazing projects and workflows built by our community',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <BuiltWithView />
    </>
  );
}

