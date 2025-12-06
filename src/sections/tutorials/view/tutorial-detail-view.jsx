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

import { _tutorials } from 'src/_mock/_tutorials';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { UserProfilePopover } from 'src/components/user-profile-popover';

// ----------------------------------------------------------------------

export function TutorialDetailView() {
  const theme = useTheme();
  const { id } = useParams();

  const tutorial = _tutorials.find((item) => item.id === id);

  if (!tutorial) {
    return (
      <DashboardContent>
        <Box sx={{ mx: 'auto', py: 10, textAlign: 'center' }}>
          <Iconify icon="solar:play-circle-bold-duotone" sx={{ mb: 3, opacity: 0.3, width: 'fullWidth !important' }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Tutorial Not Found
          </Typography>
          <Button
            component={RouterLink}
            href={paths.tutorials}
            variant="contained"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
          >
            Back to Tutorials
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mx: 'fullWidth !important' }}>
        {/* Back Button */}
        <Button
          component={RouterLink}
          href={paths.tutorials}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          sx={{ mb: 3 }}
        >
          Back to Tutorials
        </Button>

        <Card>
          {/* Embedded YouTube Video Player */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio
              bgcolor: alpha(theme.palette.grey[500], 0.12),
              overflow: 'hidden',
            }}
          >
            <Box
              component="iframe"
              src={tutorial.embedUrl}
              title={tutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Title and Category */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                }}
              >
                {tutorial.title}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip
                  label={tutorial.category}
                  size="small"
                  color="primary"
                  sx={{
                    // bgcolor: alpha(theme.palette.primary.main, 0.08),
                    // color: 'primary.main',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {tutorial.language}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {tutorial.source}
                </Typography>
              </Stack>
            </Stack>

            {/* Author and Meta Info */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 3 }}
            >
              <UserProfilePopover user={tutorial.author}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }}>
                  <Avatar src={tutorial.author?.avatarUrl} alt={tutorial.author?.name}>
                    {tutorial.author?.name?.charAt(0) || '?'}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {tutorial.author?.name || 'Unknown'}
                      </Typography>
                      {tutorial.author?.verified && (
                        <Iconify icon="solar:verified-check-bold" width={16} sx={{ color: 'info.main' }} />
                      )}
                    </Stack>
                    {tutorial.author?.role && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tutorial.author.role}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </UserProfilePopover>

              <Box sx={{ flex: 1 }} />

              {/* Stats */}
              <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {tutorial.views} views
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:heart-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tutorial.likes}
                  </Typography>
                </Stack>
                {tutorial.links > 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="solar:link-bold" width={18} color="text.secondary" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tutorial.links}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Divider />

            {/* Description */}
            <Box sx={{ py: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'text.primary',
                  whiteSpace: 'pre-line',
                }}
              >
                {tutorial.description}
              </Typography>
            </Box>

            <Divider />

            {/* Comments Section */}
            <Box sx={{ pt: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Comments ({tutorial.commentsList?.length || 0})
              </Typography>

              {tutorial.commentsList && tutorial.commentsList.length > 0 ? (
                <Stack spacing={3}>
                  {tutorial.commentsList.map((comment) => (
                    <Box key={comment.id}>
                      <Stack direction="row" spacing={2}>
                        <UserProfilePopover user={comment.author}>
                          <Avatar
                            src={comment.author?.avatarUrl}
                            alt={comment.author?.name}
                            sx={{ width: 40, height: 40, cursor: 'pointer' }}
                          >
                            {comment.author?.name?.charAt(0) || '?'}
                          </Avatar>
                        </UserProfilePopover>

                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {comment.author?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Stack>

                          <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                            {comment.content}
                          </Typography>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Iconify icon="solar:heart-bold" width={16} sx={{ color: 'info.main' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {comment.likes}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}

