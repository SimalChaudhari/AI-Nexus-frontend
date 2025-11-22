import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TagNewEditForm } from '../tag-new-edit-form';

// ----------------------------------------------------------------------

export function TagCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new tag"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tag', href: paths.admin.tag.root },
          { name: 'New tag' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TagNewEditForm />
    </DashboardContent>
  );
}

