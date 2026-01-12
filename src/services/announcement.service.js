import axios from 'src/utils/axios';

// Transform backend announcement data to frontend format
const transformAnnouncement = (announcement) => ({
  id: announcement._id || announcement.id,
  title: announcement.title || '',
  description: announcement.description || '',
  viewCount: announcement.viewCount || 0,
  comments: announcement.comments || [],
  createdAt: announcement.createdAt || new Date(),
  updatedAt: announcement.updatedAt || new Date(),
  isPinned: announcement.isPinned || false, // Preserve pinned status from API
});

// Transform backend comment data to frontend format
const transformComment = (comment) => ({
  id: comment._id || comment.id,
  content: comment.content || '',
  userId: comment.userId || comment.user?.id,
  user: comment.user || null,
  announcementId: comment.announcementId || comment.announcement?.id,
  createdAt: comment.createdAt || new Date(),
  updatedAt: comment.updatedAt || new Date(),
});

export const announcementService = {
  async getAllAnnouncements() {
    try {
      const response = await axios.get('/announcements');
      const announcements = response.data?.data || response.data || [];
      return announcements.map(transformAnnouncement);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  async getAnnouncementById(id) {
    try {
      const response = await axios.get(`/announcements/${id}`);
      const announcement = response.data?.data || response.data;
      return transformAnnouncement(announcement);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  },

  async incrementViewCount(id) {
    try {
      const response = await axios.post(`/announcements/${id}/view`);
      const announcement = response.data?.data || response.data;
      return transformAnnouncement(announcement);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  },

  async createAnnouncement(announcementData) {
    try {
      const response = await axios.post('/announcements', announcementData);
      const announcement = response.data?.announcement || response.data?.data || response.data;
      return transformAnnouncement(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async updateAnnouncement(id, announcementData) {
    try {
      const response = await axios.put(`/announcements/update/${id}`, announcementData);
      const announcement = response.data?.announcement || response.data?.data || response.data;
      return transformAnnouncement(announcement);
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async deleteAnnouncement(id) {
    try {
      const response = await axios.delete(`/announcements/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  async addComment(announcementId, commentData) {
    try {
      const response = await axios.post(`/announcements/${announcementId}/comments`, commentData);
      const comment = response.data?.comment || response.data?.data || response.data;
      return transformComment(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async getComments(announcementId) {
    try {
      const response = await axios.get(`/announcements/${announcementId}/comments`);
      const comments = response.data?.data || response.data || [];
      return comments.map(transformComment);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async updateComment(commentId, commentData) {
    try {
      const response = await axios.put(`/announcements/comments/update/${commentId}`, commentData);
      const comment = response.data?.comment || response.data?.data || response.data;
      return transformComment(comment);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await axios.delete(`/announcements/comments/delete/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  async pinAnnouncement(id) {
    try {
      const response = await axios.post(`/announcements/${id}/pin`);
      return response.data;
    } catch (error) {
      console.error('Error pinning announcement:', error);
      throw error;
    }
  },

  async unpinAnnouncement(id) {
    try {
      const response = await axios.delete(`/announcements/${id}/pin`);
      return response.data;
    } catch (error) {
      console.error('Error unpinning announcement:', error);
      throw error;
    }
  },

  async togglePinAnnouncement(id) {
    try {
      const response = await axios.post(`/announcements/${id}/toggle-pin`);
      return response.data;
    } catch (error) {
      console.error('Error toggling pin announcement:', error);
      throw error;
    }
  },
};
