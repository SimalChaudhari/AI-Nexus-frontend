import { useParams } from 'react-router-dom';

import { CommunityDetailsView } from 'src/sections/community/view';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetCommunity } from 'src/actions/community';

// ----------------------------------------------------------------------

export default function CommunityDetailsPage() {
  const { id } = useParams();
  const { community, communityLoading, communityError } = useGetCommunity(id);

  return (
    <CommunityDetailsView
      community={community}
      loading={communityLoading}
      error={communityError}
    />
  );
}

