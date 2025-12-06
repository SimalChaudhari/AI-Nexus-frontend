import { useState, useEffect, useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { _announcements } from 'src/_mock/_announcements';
import { Iconify } from 'src/components/iconify';
import { AnnouncementItem } from '../announcement-item';

// ----------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;

export function AnnouncementsView() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  // Filter announcements
  const filteredAnnouncements = _announcements.filter((announcement) => {
    const matchesSearch =
      searchQuery === '' ||
      announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'pinned' && announcement.isPinned) ||
      (filterType === 'highlights' && announcement.isHighlight);

    return matchesSearch && matchesFilter;
  });

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Get displayed announcements
  const displayedAnnouncements = sortedAnnouncements.slice(0, displayedCount);
  const hasMore = displayedCount < sortedAnnouncements.length;

  // Load more function
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedAnnouncements.length));
      setLoading(false);
    }, 2000);
  }, [loading, hasMore, sortedAnnouncements.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, filterType]);

  return (
    <DashboardContent>
      <Box sx={{ mx: 'fullWidth' }}>
        {/* Header Section */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Iconify
              icon="solar:volume-loud-bold-duotone"
              width={40}
              sx={{ color: 'primary.main' }}
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Announcements
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9375rem', md: '1rem' },
              color: 'text.secondary',
            }}
          >
            Stay updated with the latest news, features, and community updates
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Search Box */}
            <Box
              sx={{
                flex: 1,
                position: 'relative',
                borderRadius: 1.5,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: alpha(theme.palette.grey[500], 0.4),
                },
                '&:focus-within': {
                  borderColor: 'primary.main',
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                }}
              >
                <Iconify icon="solar:magnifer-bold-duotone" width={20} />
              </Box>
              <InputBase
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '100%',
                  pl: 5,
                  pr: 2,
                  py: 1.25,
                  fontSize: '0.875rem',
                }}
              />
            </Box>

            {/* Filter Buttons */}
            <Stack direction="row" spacing={1}>
              {[
                { value: 'all', label: 'All', icon: 'solar:list-bold-duotone' },
                { value: 'pinned', label: 'Pinned', icon: 'solar:pin-bold' },
                { value: 'highlights', label: 'Highlights', icon: 'solar:star-bold' },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  startIcon={<Iconify icon={filter.icon} width={18} />}
                  variant={filterType === filter.value ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {filter.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Card>

        {/* Announcements List */}
        <Card>
          {/* Header Row */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 3,
              bgcolor: alpha(theme.palette.grey[500], 0.04),
              borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ flex: 1, color: 'text.secondary' }}>
              Topic
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ minWidth: 70, textAlign: 'center', color: 'text.secondary' }}
            >
              Replies
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ minWidth: 80, textAlign: 'center', color: 'text.secondary' }}
            >
              Views
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ minWidth: 70, textAlign: 'center', color: 'text.secondary' }}
            >
              Activity
            </Typography>
          </Box>

          {/* Announcement Items */}
          {sortedAnnouncements.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                color: 'text.secondary',
              }}
            >
              <Iconify
                icon="solar:file-text-bold-duotone"
                width={64}
                sx={{ mb: 2, opacity: 0.5 }}
              />
              <Typography variant="h6">No announcements found</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Try adjusting your search or filter
              </Typography>
            </Box>
          ) : (
            <>
              {displayedAnnouncements.map((announcement) => (
                <AnnouncementItem key={announcement.id} announcement={announcement} />
              ))}

              {/* Loading indicator */}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              )}

              {/* Intersection observer target */}
              {hasMore && !loading && (
                <Box
                  ref={observerTarget}
                  sx={{
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              )}
            </>
          )}
        </Card>

        {/* Stats Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {displayedAnnouncements.length} of {sortedAnnouncements.length} announcements
            {sortedAnnouncements.length !== _announcements.length && ` (${_announcements.length} total)`}
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
}

