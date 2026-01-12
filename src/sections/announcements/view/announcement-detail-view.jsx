import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { announcementService } from 'src/services/announcement.service';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { formatViewCount } from 'src/utils/format-view-count';

// ----------------------------------------------------------------------

export function AnnouncementDetailView() {
  const theme = useTheme();
  const { id } = useParams();
  const { user } = useAuthContext();
  const [announcement, setAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingComment, setUpdatingComment] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [deletingComment, setDeletingComment] = useState(null);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Fetch announcement data
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch announcement data
        const data = await announcementService.getAnnouncementById(id);
        setAnnouncement(data);
      } catch (err) {
        // console.error('Error fetching announcement:', err);
        setError(err);
        toast.error('Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  // Increment view count only once when detail page is viewed
  useEffect(() => {
    if (!id) {
      // console.log('View count increment skipped - missing id');
      return;
    }

    // Check if view count has already been incremented for this announcement in this session
    const viewCountKey = `announcement_viewed_${id}`;
    const hasViewed = sessionStorage.getItem(viewCountKey);

    if (!hasViewed) {
      // console.log('Incrementing view count for announcement:', id);
      // Mark as viewed in session storage to prevent multiple increments
      sessionStorage.setItem(viewCountKey, 'true');

      // Increment view count - don't wait for announcement to load
      const incrementView = async () => {
        try {
          // console.log('Calling incrementViewCount API for:', id);
          const updatedAnnouncement = await announcementService.incrementViewCount(id);
          // console.log('View count incremented successfully:', updatedAnnouncement);

          // Update the announcement state with new view count if announcement is already loaded
          if (announcement && updatedAnnouncement && updatedAnnouncement.viewCount !== undefined) {
            setAnnouncement((prev) => ({
              ...prev,
              viewCount: updatedAnnouncement.viewCount,
            }));
            // console.log('Updated view count in state:', updatedAnnouncement.viewCount);
          }
        } catch (viewError) {
          // Log error but don't break the page
          // console.error('Failed to increment view count:', viewError);
          // console.error('Error response:', viewError?.response?.data);
          // console.error('Error status:', viewError?.response?.status);
          // Remove from sessionStorage so it can be retried
          sessionStorage.removeItem(viewCountKey);
        }
      };

      incrementView();
    } else {
      // console.log('View count already incremented for this announcement in this session');
    }
  }, [id]); // Only depend on id, not announcement

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const data = await announcementService.getComments(id);
        setComments(data || []);
      } catch (err) {
        // console.error('Error fetching comments:', err);
        toast.error('Failed to load comments');
      } finally {
        setLoadingComments(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // Check if user has already commented
  const hasUserCommented = user && comments.some((comment) => comment.userId === user.id);

  // Handle comment submit
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    // Check if user has already commented
    if (hasUserCommented) {
      toast.error('You have already commented on this announcement. You can only comment once.');
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await announcementService.addComment(id, {
        content: commentText.trim(),
      });

      // Add new comment to list
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (err) {
      // console.error('Error adding comment:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to add comment';
      toast.error(errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  // Handle update comment
  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setUpdatingComment(commentId);
      const updatedComment = await announcementService.updateComment(commentId, {
        content: editCommentText.trim(),
      });

      // Update comment in list
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditCommentText('');
      toast.success('Comment updated successfully');
    } catch (err) {
      // console.error('Error updating comment:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update comment';
      toast.error(errorMessage);
    } finally {
      setUpdatingComment(null);
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setDeletingComment(commentId);
      await announcementService.deleteComment(commentId);

      // Remove comment from list
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (err) {
      // console.error('Error deleting comment:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete comment';
      toast.error(errorMessage);
    } finally {
      setDeletingComment(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return 'Just now';
    const timeDiff = Date.now() - new Date(date).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return 'Just now';
  };

  // Loading state
  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardContent>
    );
  }

  // Error state or not found
  if (error || !announcement) {
    return (
      <DashboardContent>
        <Box sx={{ mx: 'auto', py: 10, textAlign: 'center' }}>
          <Iconify icon="solar:file-text-bold-duotone" width={80} sx={{ mb: 3, opacity: 0.3 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Announcement Not Found
          </Typography>
          <Button
            component={RouterLink}
            href={paths.announcements}
            variant="contained"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
          >
            Back to Announcements
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
          href={paths.announcements}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          sx={{ mb: 3 }}
        >
          Back to Announcements
        </Button>

        <Card>
          {/* Header */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                mb: 3,
              }}
            >
              {announcement.title}
            </Typography>

            {/* Meta Info */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 3 }}
            >
              {/* Date */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="solar:calendar-bold" width={18} color="text.secondary" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {formatDate(announcement.createdAt)}
                </Typography>
              </Stack>

              <Box sx={{ flex: 1 }} />

              {/* Stats */}
              <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:chat-round-dots-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {comments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    comments
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:eye-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatViewCount(announcement.viewCount || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    views
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:clock-circle-bold" width={18} color="text.secondary" />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatRelativeTime(announcement.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

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
              {announcement.description || announcement.content || 'No content available'}
            </Typography>
          </Box>
        </Card>

        {/* Comments Section */}
        <Card sx={{ mt: 3 }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Comments ({comments.length})
            </Typography>

            {/* Comment Form */}
            {user ? (
              hasUserCommented ? (
                <Box
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    textAlign: 'center',
                  }}
                >
                  <Iconify
                    icon="solar:chat-round-dots-bold-duotone"
                    width={48}
                    sx={{ mb: 2, color: 'info.main' }}
                  />
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    You have already commented on this announcement
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Each user can only comment once per announcement
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 4 }}>
                  <Stack spacing={2}>
                    <TextField
                      multiline
                      rows={4}
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                        },
                      }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => setCommentText('')}
                        disabled={submittingComment}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSubmitComment}
                        disabled={submittingComment || !commentText.trim()}
                        startIcon={submittingComment ? <CircularProgress size={16} /> : null}
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )
            ) : (
              <Box
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  textAlign: 'center',
                }}
              >
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                  Please sign in to comment
                </Typography>
                <Button
                  component={RouterLink}
                  href={paths.auth.simple.signIn}
                  variant="contained"
                  startIcon={<Iconify icon="solar:login-2-bold" />}
                >
                  Sign In
                </Button>
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Comments List */}
            {loadingComments ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
              </Box>
            ) : comments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Iconify
                  icon="solar:chat-round-dots-bold-duotone"
                  width={64}
                  sx={{ mb: 2, opacity: 0.3, color: 'text.secondary' }}
                />
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                  No comments yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Be the first to comment!
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {comments.map((comment) => (
                  <Box key={comment.id}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        src={comment.user?.avatarUrl}
                        sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                      >
                        {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {comment.user?.name || comment.user?.email || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatRelativeTime(comment.createdAt)}
                          </Typography>
                          {/* Edit and Delete buttons - only show if user owns the comment */}
                          {user && (comment.userId === user.id || user.role === 'admin') && (
                            <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
                              {editingCommentId !== comment.id && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditComment(comment)}
                                  disabled={deletingComment === comment.id || updatingComment === comment.id}
                                  sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                  }}
                                >
                                  <Iconify icon="solar:pen-bold" width={18} />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingComment === comment.id || updatingComment === comment.id}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                  },
                                }}
                              >
                                {deletingComment === comment.id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                )}
                              </IconButton>
                            </Stack>
                          )}
                        </Stack>
                        {editingCommentId === comment.id ? (
                          <Box sx={{ mt: 2 }}>
                            <TextField
                              multiline
                              rows={3}
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              fullWidth
                              sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'background.paper',
                                },
                              }}
                            />
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={handleCancelEdit}
                                disabled={updatingComment === comment.id}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleUpdateComment(comment.id)}
                                disabled={updatingComment === comment.id || !editCommentText.trim()}
                                startIcon={updatingComment === comment.id ? <CircularProgress size={14} /> : null}
                              >
                                {updatingComment === comment.id ? 'Updating...' : 'Update'}
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              whiteSpace: 'pre-line',
                              lineHeight: 1.6,
                            }}
                          >
                            {comment.content}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    {comment.id !== comments[comments.length - 1]?.id && (
                      <Divider sx={{ mt: 3 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}
