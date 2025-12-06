import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { _builtWith } from 'src/_mock/_built-with';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { UserProfilePopover } from 'src/components/user-profile-popover';

// ----------------------------------------------------------------------

export function BuiltWithDetailView() {
  const theme = useTheme();
  const { id } = useParams();

  const project = _builtWith.find((item) => item.id === id);

  if (!project) {
    return (
      <DashboardContent>
        <Box sx={{ mx: 'auto', py: 10, textAlign: 'center' }}>
          <Iconify icon="solar:rocket-bold-duotone" width={80} sx={{ mb: 3, opacity: 0.3 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Project Not Found
          </Typography>
          <Button
            component={RouterLink}
            href={paths.builtWith}
            variant="contained"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
          >
            Back to Projects
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mx: 'auto' }}>
        {/* Back Button */}
        <Button
          component={RouterLink}
          href={paths.builtWith}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          sx={{ mb: 3 }}
        >
          Back to Projects
        </Button>

        <Card>
          {/* Header */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Title and Badges */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
              {project.isPinned && (
                <Iconify icon="solar:pin-bold" width={20} sx={{ color: 'error.main' }} />
              )}
              {project.isFeatured && (
                <Iconify icon="solar:rocket-bold" width={20} sx={{ color: 'warning.main' }} />
              )}
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  flex: 1,
                }}
              >
                {project.title}
              </Typography>
              {project.hasTemplate && (
                <Chip
                  label="Template Available"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Stack>

            {/* Author and Meta Info */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 3 }}
            >
              <UserProfilePopover user={project.author}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }}>
                  <Avatar src={project.author?.avatarUrl} alt={project.author?.name}>
                    {project.author?.name?.charAt(0) || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {project.author?.name || 'Unknown'}
                    </Typography>
                    {project.author?.role && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {project.author.role}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </UserProfilePopover>

              <Box sx={{ flex: 1 }} />

              {/* Stats */}
              <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:chat-round-dots-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {project.replies}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    replies
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:eye-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {project.views > 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    views
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {project.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.mode === 'dark' ? '#FFFFFF !important' : 'primary.main',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: theme.palette.mode === 'dark' ? '#000 !important' : '#fff !important',
                      },
                    }}
                  />
                ))}
              </Stack>
            )}

            <Divider />
          </Box>

          {/* Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'text.primary',
                whiteSpace: 'pre-line',
              }}
            >
              {project.description}
            </Typography>
          </Box>

          {/* Participants Section */}
          {project.participants && project.participants.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Contributors ({project.participants.length})
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {project.participants.map((participant) => (
                    <UserProfilePopover key={participant.id} user={participant}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          py: 1,
                          px: 1.5,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.grey[500], 0.04),
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.grey[500], 0.08),
                          },
                        }}
                      >
                        <Avatar src={participant.avatarUrl} sx={{ width: 32, height: 32 }}>
                          {participant.name?.charAt(0) || '?'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {participant.name || 'Unknown'}
                        </Typography>
                      </Stack>
                    </UserProfilePopover>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Card>
      </Box>
    </DashboardContent>
  );
}

