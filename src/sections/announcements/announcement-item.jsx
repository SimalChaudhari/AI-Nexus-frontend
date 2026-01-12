import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { UserProfilePopover } from 'src/components/user-profile-popover';
import { formatViewCount } from 'src/utils/format-view-count';
import { useAuthContext } from 'src/auth/hooks';
import { announcementService } from 'src/services/announcement.service';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function AnnouncementItem({ announcement, onPinToggle }) {
  const theme = useTheme();
  const { authenticated } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(announcement.isPinned || false);
  const [isPinning, setIsPinning] = useState(false);

  // Sync isPinned state when announcement prop changes (e.g., after page refresh)
  useEffect(() => {
    setIsPinned(announcement.isPinned || false);
  }, [announcement.isPinned]);

  const handlePinToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPinning) return;

    try {
      setIsPinning(true);
      const result = await announcementService.togglePinAnnouncement(announcement.id);
      setIsPinned(result.pinned);

      if (onPinToggle) {
        onPinToggle(announcement.id, result.pinned);
      }

      toast.success(result.message);
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error(error?.response?.data?.message || 'Failed to toggle pin');
    } finally {
      setIsPinning(false);
    }
  };

  const getTypeIcon = () => {
    if (isPinned) {
      return <Iconify icon="solar:pin-bold" width={16} sx={{ color: 'error.main' }} />;
    }
    if (announcement.isHighlight) {
      return <Iconify icon="solar:speaker-bold" width={16} sx={{ color: 'info.main' }} />;
    }
    return null;
  };

  return (
    <Box
      component={RouterLink}
      href={`/announcements/${announcement.id}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 2,
        px: { xs: 2, md: 3 },
        textDecoration: 'none',
        borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: alpha(theme.palette.grey[500], 0.04),
        },
      }}
    >
      {/* Topic Column */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
          {getTypeIcon()}
          <Box
            component={RouterLink}
            href={`/announcements/${announcement.id}`}
            sx={{ textDecoration: 'none', flex: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                lineHeight: 1.4,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {announcement.title}
            </Typography>
          </Box>
          {authenticated && (
            <Tooltip title={isPinned ? 'Unpin announcement' : 'Pin announcement'}>
              <IconButton
                size="small"
                onClick={handlePinToggle}
                disabled={isPinning}
                sx={{
                  color: isPinned ? 'error.main' : 'text.secondary',
                  '&:hover': {
                    color: isPinned ? 'error.dark' : 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Iconify
                  icon={isPinned ? "solar:pin-bold" : "solar:pin-outline"}
                  width={18}
                />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {(announcement.excerpt || announcement.content) && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              mb: 1,
              lineHeight: 1.5,
              ...(!isExpanded && {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
            }}
          >
            {isExpanded ? announcement.content : announcement.excerpt}{' '}
            {announcement.content && announcement.content.length > 150 && (
              <Box
                component="span"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {isExpanded ? 'show less' : 'read more'}
              </Box>
            )}
          </Typography>
        )}

        {/* Participants - Only show if we have participants */}
        {announcement.participants && announcement.participants.length > 0 && (
          <AvatarGroup
            max={5}
            sx={{
              '& .MuiAvatar-root': {
                width: 24,
                height: 24,
                fontSize: '0.75rem',
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            {announcement.participants.map((participant) => (
              <UserProfilePopover key={participant.id} user={participant}>
                <Avatar
                  alt={participant.name}
                  src={participant.avatarUrl}
                  sx={{ width: 24, height: 24 }}
                />
              </UserProfilePopover>
            ))}
          </AvatarGroup>
        )}
      </Box>

      {/* Replies Column */}
      <Box
        sx={{
          minWidth: { xs: 50, md: 70 },
          textAlign: 'center',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: 'warning.main',
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          {announcement.replies}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Replies
        </Typography>
      </Box>

      {/* Views Column */}
      <Box
        sx={{
          minWidth: { xs: 60, md: 80 },
          textAlign: 'center',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: 'warning.main',
            fontSize: '1rem',
          }}
        >
          {formatViewCount(announcement.views)}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Views
        </Typography>
      </Box>

      {/* Activity Column */}
      <Box
        sx={{
          minWidth: { xs: 50, md: 70 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 500,
          }}
        >
          {announcement.lastActivity}
        </Typography>
      </Box>
    </Box>
  );
}

