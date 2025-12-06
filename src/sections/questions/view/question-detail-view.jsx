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

import { _questions } from 'src/_mock/_questions';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function QuestionDetailView() {
  const theme = useTheme();
  const { id } = useParams();

  const question = _questions.find((item) => item.id === id);

  if (!question) {
    return (
      <DashboardContent>
        <Box sx={{ mx: 'auto', py: 10, textAlign: 'center' }}>
          <Iconify icon="solar:question-circle-bold-duotone" width={80} sx={{ mb: 3, opacity: 0.3 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Question Not Found
          </Typography>
          <Button
            component={RouterLink}
            href={paths.questions}
            variant="contained"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
          >
            Back to Questions
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
          href={paths.questions}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          sx={{ mb: 3 }}
        >
          Back to Questions
        </Button>

        <Card>
          {/* Header */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Title and Badges */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              {question.isPinned && (
                <Iconify icon="solar:pin-bold" width={20} sx={{ color: 'error.main' }} />
              )}
              {question.isSolved && (
                <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: 'success.main' }} />
              )}
              {question.isUnsolved && (
                <Iconify icon="solar:close-circle-bold" width={20} sx={{ color: 'error.main' }} />
              )}
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  flex: 1,
                }}
              >
                {question.title}
              </Typography>
            </Stack>

            {/* Author and Meta Info */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={question.author?.avatarUrl} alt={question.author?.name}>
                  {question.author?.name?.charAt(0) || '?'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {question.author?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(question.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ flex: 1 }} />

              {/* Stats */}
              <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:chat-round-dots-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {question.replies}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    replies
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:eye-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {question.views}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    views
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {question.tags.map((tag) => (
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
              {question.content}
            </Typography>
          </Box>

          {/* Participants Section */}
          {question.participants && question.participants.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Participants ({question.participants.length})
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {question.participants.map((participant) => (
                    <Stack
                      key={participant.id}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        py: 1,
                        px: 1.5,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                      }}
                    >
                      <Avatar src={participant.avatarUrl} sx={{ width: 32, height: 32 }}>
                        {participant.name?.charAt(0) || '?'}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {participant.name || 'Unknown'}
                      </Typography>
                    </Stack>
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

