import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { QuestionDetailView } from 'src/sections/questions/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Question Details | ${CONFIG.site.name}`,
  description: 'View question details and discussion',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <QuestionDetailView />
    </>
  );
}

