import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LearningTopBar, LearningMainSection } from 'src/sections/learning';

// ----------------------------------------------------------------------

const metadata = { title: `Learning | ${CONFIG.site.name}` };

export default function LearningPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <LearningTopBar />
      <LearningMainSection />
    </>
  );
}

