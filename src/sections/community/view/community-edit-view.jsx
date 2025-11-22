import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommunityNewEditForm } from '../community-new-edit-form';

// ----------------------------------------------------------------------

export function CommunityEditView({ community: currentCommunity }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Community', href: paths.admin.community.list },
          { name: currentCommunity?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CommunityNewEditForm currentCommunity={currentCommunity} />
    </DashboardContent>
  );
}

