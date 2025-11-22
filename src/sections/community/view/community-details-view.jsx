import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

export function CommunityDetailsView({ community, loading, error }) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !community) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Community not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.admin.community.list}
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
        heading="Community Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Community', href: paths.admin.community.list },
          { name: community?.title },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.community.edit(community?.id)}
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
            {community.largeImage ? (
              <Avatar
                src={community.largeImage}
                alt={community.title}
                sx={{ width: '100%', height: 200, mb: 2, borderRadius: 2 }}
                variant="rounded"
              />
            ) : (
              <Box sx={{ width: '100%', height: 200, mb: 2, bgcolor: 'background.neutral', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Iconify icon="solar:gallery-bold-duotone" width={64} sx={{ color: 'text.disabled' }} />
              </Box>
            )}

            <Typography variant="h6" sx={{ mb: 1 }}>
              {community.title}
            </Typography>

            <Chip
              label={community.pricingType || 'free'}
              color={community.pricingType === 'paid' ? 'primary' : 'success'}
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Community Information
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
                  {community.title || '-'}
                </Typography>
              </Box>

              {community.category && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Category
                  </Typography>
                  <Chip
                    label={community.category.title || community.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Pricing Type
                </Typography>
                <Chip
                  label={community.pricingType || 'free'}
                  color={community.pricingType === 'paid' ? 'primary' : 'success'}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Amount
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {community.pricingType === 'paid' && community.amount
                    ? `$${parseFloat(community.amount).toFixed(2)}`
                    : 'Free'}
                </Typography>
              </Box>

              {community.description && (
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {community.description}
                  </Typography>
                </Box>
              )}


              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {community.createdAt ? new Date(community.createdAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {community.updatedAt ? new Date(community.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

