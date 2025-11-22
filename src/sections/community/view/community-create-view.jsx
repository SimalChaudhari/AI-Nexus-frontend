import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommunityNewEditForm } from '../community-new-edit-form';

// ----------------------------------------------------------------------

export function CommunityCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new community"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Community', href: paths.admin.community.root },
          { name: 'New community' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CommunityNewEditForm />
    </DashboardContent>
  );
}

