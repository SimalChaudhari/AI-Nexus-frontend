import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CourseDetailsView({ course, loading, error }) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !course) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Course not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.admin.course.list}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Course Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Course', href: paths.admin.course.list },
          { name: course?.title },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.course.edit(course?.id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            {course.image && (
              <Avatar
                src={course.image}
                alt={course.title}
                variant="rounded"
                sx={{ width: '100%', height: 200, mb: 2 }}
              />
            )}

            <Typography variant="h6" sx={{ mb: 1 }}>
              {course.title}
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Chip
                label={course.level || 'Beginner'}
                color={course.level === 'Advanced' ? 'error' : course.level === 'Intermediate' ? 'warning' : 'info'}
                size="small"
              />
              <Chip
                label={course.freeOrPaid ? 'Paid' : 'Free'}
                color={course.freeOrPaid ? 'success' : 'default'}
                size="small"
              />
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Course Information
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Title
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {course.title || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Level
                </Typography>
                <Chip
                  label={course.level || 'Beginner'}
                  color={course.level === 'Advanced' ? 'error' : course.level === 'Intermediate' ? 'warning' : 'info'}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Type
                </Typography>
                <Chip
                  label={course.freeOrPaid ? 'Paid' : 'Free'}
                  color={course.freeOrPaid ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              {course.freeOrPaid && (Number(course.amount) || 0) > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ${Number(course.amount || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {course.description || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {course.createdAt ? new Date(course.createdAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {course.updatedAt ? new Date(course.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
