import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TutorialCard({ tutorial }) {
  const theme = useTheme();

  const renderPlaceholder = () => (
    <Box
      sx={{
        width: '100%',
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Iconify
          icon="solar:chat-round-dots-bold-duotone"
          width={48}
          sx={{ color: alpha(theme.palette.grey[500], 0.48) }}
        />
      </Stack>
    </Box>
  );

  return (
    <Card
      component={RouterLink}
      href={`/tutorials/${tutorial.id}`}
      sx={{
        textDecoration: 'none',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Thumbnail */}
      {tutorial.thumbnail ? (
        <Box
          component="img"
          src={tutorial.thumbnail}
          alt={tutorial.title}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
          }}
        />
      ) : (
        renderPlaceholder()
      )}

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 48,
            lineHeight: 1.5,
          }}
        >
          {tutorial.title}
        </Typography>

        {/* Stats */}
        <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Iconify icon="solar:heart-bold" width={16} />
            <Typography variant="caption">{tutorial.likes}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Iconify icon="solar:chat-round-dots-bold" width={16} />
            <Typography variant="caption">{tutorial.comments}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

