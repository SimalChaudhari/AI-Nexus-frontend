import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityService } from 'src/services/community.service';
import { toast } from 'src/components/snackbar';

// Async thunks for API calls
export const fetchCommunities = createAsyncThunk('communities/fetchCommunities', async (_, { rejectWithValue }) => {
  try {
    const response = await communityService.getAllCommunities();
    return response;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch communities';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createCommunity = createAsyncThunk('communities/createCommunity', async ({ communityData, smallImageFile, largeImageFile }, { rejectWithValue }) => {
  try {
    const response = await communityService.createCommunity(communityData, smallImageFile, largeImageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create community';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateCommunity = createAsyncThunk('communities/updateCommunity', async ({ id, communityData, smallImageFile, largeImageFile }, { rejectWithValue }) => {
  try {
    const response = await communityService.updateCommunity(id, communityData, smallImageFile, largeImageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update community';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteCommunity = createAsyncThunk('communities/deleteCommunity', async (id, { rejectWithValue }) => {
  try {
    await communityService.deleteCommunity(id);
    return id; // Return the ID of the deleted community
  } catch (error) {
    const errorMessage = error?.message || 'Failed to delete community';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const communitySlice = createSlice({
  name: 'communities',
  initialState: {
    communities: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch communities
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create community
      .addCase(createCommunity.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.creating = false;
        state.communities.unshift(action.payload); // Add new community to the beginning
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Update community
      .addCase(updateCommunity.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.communities.findIndex((community) => community.id === action.payload.id);
        if (index !== -1) {
          state.communities[index] = action.payload;
        }
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete community
      .addCase(deleteCommunity.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.deleting = false;
        state.communities = state.communities.filter((community) => community.id !== action.payload);
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export default communitySlice.reducer;

