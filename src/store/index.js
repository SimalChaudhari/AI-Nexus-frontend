import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import tagReducer from './slices/tagSlice';
import labelReducer from './slices/labelSlice';
import workflowReducer from './slices/workflowSlice';
import courseReducer from './slices/courseSlice';
import productReducer from './slices/productSlice';
import announcementReducer from './slices/announcementSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    tags: tagReducer,
    labels: labelReducer,
    workflows: workflowReducer,
    courses: courseReducer,
    products: productReducer,
    announcements: announcementReducer,
  },
});

export default store;

