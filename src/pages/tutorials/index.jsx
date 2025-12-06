import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TutorialsView } from 'src/sections/tutorials/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Tutorials | ${CONFIG.site.name}`,
  description: 'Learn from video tutorials and step-by-step guides',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <TutorialsView />
    </>
  );
}

