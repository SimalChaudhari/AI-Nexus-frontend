import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { QuestionsView } from 'src/sections/questions/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Questions | ${CONFIG.site.name}`,
  description: 'Ask questions, get help, and share knowledge with the community',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <QuestionsView />
    </>
  );
}

