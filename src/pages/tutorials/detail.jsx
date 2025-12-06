import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TutorialDetailView } from 'src/sections/tutorials/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Tutorial Details | ${CONFIG.site.name}`,
  description: 'Watch tutorial and learn step by step',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <TutorialDetailView />
    </>
  );
}

