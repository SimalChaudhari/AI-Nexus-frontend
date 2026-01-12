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

import { Iconify } from 'src/components/iconify';
import { AnnouncementItem } from '../announcement-item';
import { announcementService } from 'src/services/announcement.service';
import { toast } from 'src/components/snackbar';
import { formatViewCount } from 'src/utils/format-view-count';

// ----------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;

  // Transform API data to component format
const transformAnnouncement = (announcement) => {
  const createdAt = announcement.createdAt ? new Date(announcement.createdAt) : new Date();
  const timeDiff = Date.now() - createdAt.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  let lastActivity = 'Just now';
  if (days > 0) {
    lastActivity = `${days}d ago`;
  } else if (hours > 0) {
    lastActivity = `${hours}h ago`;
  } else if (minutes > 0) {
    lastActivity = `${minutes}m ago`;
  }

  // Create excerpt from description (first 150 characters)
  const description = announcement.description || '';
  const excerpt = description.length > 150 ? `${description.substring(0, 150)}...` : description;

  return {
    id: announcement.id,
    title: announcement.title || '',
    description,
    content: description,
    excerpt,
    views: announcement.viewCount || 0,
    replies: announcement.comments?.length || 0,
    comments: announcement.comments || [],
    lastActivity,
    createdAt,
    participants: [], // We don't have participants in API, using empty array
    isPinned: announcement.isPinned || false, // Get from API
    isHighlight: false, // We don't have this in API
  };
};

export function AnnouncementsView() {
  const theme = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef(null);

  // Handle pin toggle
  const handlePinToggle = useCallback((announcementId, isPinned) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, isPinned }
          : announcement
      )
    );
  }, []);

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementService.getAllAnnouncements();
        console.log('📥 Fetched announcements from API:', data);
        // Transform API data to component format
        const transformed = (data || []).map(transformAnnouncement);
        const pinnedCount = transformed.filter(a => a.isPinned).length;
        console.log(`📌 Transformed: ${pinnedCount} pinned out of ${transformed.length} total`);
        setAnnouncements(transformed);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      searchQuery === '' ||
      announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type: 'all' or 'pinned'
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'pinned' && announcement.isPinned);

    return matchesSearch && matchesFilter;
  });

  // Sort: pinned first, then by date (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // Pinned announcements first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Debug: Log sorted announcements to verify pinned ones are first
  useEffect(() => {
    if (sortedAnnouncements.length > 0) {
      const pinnedFirst = sortedAnnouncements.filter(a => a.isPinned);
      console.log(`🔝 Sorted: ${pinnedFirst.length} pinned announcements should be at top`);
      if (pinnedFirst.length > 0) {
        console.log('📌 First pinned announcement:', pinnedFirst[0].title);
      }
    }
  }, [sortedAnnouncements]);

  // Get displayed announcements
  const displayedAnnouncements = sortedAnnouncements.slice(0, displayedCount);
  const hasMore = displayedCount < sortedAnnouncements.length;

  // Load more function
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedAnnouncements.length));
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, hasMore, sortedAnnouncements.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
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
  }, [hasMore, loadingMore, loadMore]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, filterType]);

  // Show loading state
  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardContent>
    );
  }

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
              Comments
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
                <AnnouncementItem 
                  key={announcement.id} 
                  announcement={announcement} 
                  onPinToggle={handlePinToggle}
                />
              ))}

              {/* Loading indicator */}
              {loadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              )}

              {/* Intersection observer target */}
              {hasMore && !loadingMore && (
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
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
}
