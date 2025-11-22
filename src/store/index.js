import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import tagReducer from './slices/tagSlice';
import labelReducer from './slices/labelSlice';
import workflowReducer from './slices/workflowSlice';
import communityReducer from './slices/communitySlice';
import courseReducer from './slices/courseSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    tags: tagReducer,
    labels: labelReducer,
    workflows: workflowReducer,
    communities: communityReducer,
    courses: courseReducer,
    products: productReducer,
  },
});

export default store;

