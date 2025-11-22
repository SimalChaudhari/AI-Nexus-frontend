import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkflowNewEditForm } from '../workflow-new-edit-form';

// ----------------------------------------------------------------------

export function WorkflowCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new workflow"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Workflow', href: paths.admin.workflow.root },
          { name: 'New workflow' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WorkflowNewEditForm />
    </DashboardContent>
  );
}

