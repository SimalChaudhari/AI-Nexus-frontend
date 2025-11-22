import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CommunityEditView } from 'src/sections/community/view';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetCommunity } from 'src/actions/community';

// ----------------------------------------------------------------------

export default function CommunityEditPage() {
  const { id } = useParams();
  const { community, communityLoading } = useGetCommunity(id);

  if (communityLoading) {
    return <LoadingScreen />;
  }

  return <CommunityEditView community={community} />;
}

