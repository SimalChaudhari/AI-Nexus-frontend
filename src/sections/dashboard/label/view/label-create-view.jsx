import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LabelNewEditForm } from '../label-new-edit-form';

// ----------------------------------------------------------------------

export function LabelCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new label"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Label', href: paths.admin.label.root },
          { name: 'New label' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LabelNewEditForm />
    </DashboardContent>
  );
}

