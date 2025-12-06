import { useState, useEffect, useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { _tutorials } from 'src/_mock/_tutorials';
import { Iconify } from 'src/components/iconify';
import { TutorialCard } from '../tutorial-card';

// ----------------------------------------------------------------------

const ITEMS_PER_PAGE = 12;

export function TutorialsView() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  // Filter tutorials
  const filteredTutorials = _tutorials.filter((tutorial) => {
    const matchesSearch =
      searchQuery === '' ||
      tutorial.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || tutorial.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'beginner', 'advanced', 'ai', 'automation', 'integration'];

  // Get displayed tutorials
  const displayedTutorials = filteredTutorials.slice(0, displayedCount);
  const hasMore = displayedCount < filteredTutorials.length;

  // Load more function
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredTutorials.length));
      setLoading(false);
    }, 2000);
  }, [loading, hasMore, filteredTutorials.length]);

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
  }, [searchQuery, filterCategory]);

  return (
    <DashboardContent>
      <Box sx={{ maxWidth: 'fullWidth !important' }}>
        {/* Header Section */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Iconify
              icon="solar:play-circle-bold-duotone"
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
              Tutorials
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9375rem', md: '1rem' },
              color: 'text.secondary',
            }}
          >
            Learn from video tutorials and step-by-step guides
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          {/* Search Box */}
          <Box
            sx={{
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
              placeholder="Search tutorials..."
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

          {/* Category Filter Buttons */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilterCategory(category)}
                variant={filterCategory === category ? 'contained' : 'outlined'}
                  color="primary"
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  textTransform: 'capitalize',
                  fontWeight: 500,
                }}
              >
                {category}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* Tutorials Grid */}
        {filteredTutorials.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              color: 'text.secondary',
            }}
          >
            <Iconify
              icon="solar:play-circle-bold-duotone"
              width={64}
              sx={{ mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h6">No tutorials found</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Try adjusting your search or filter
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {displayedTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </Box>

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
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            )}
          </>
        )}

        {/* Stats Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {displayedTutorials.length} of {filteredTutorials.length} tutorials
            {filteredTutorials.length !== _tutorials.length && ` (${_tutorials.length} total)`}
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
}

