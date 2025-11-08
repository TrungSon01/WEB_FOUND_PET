import { createSlice } from "@reduxjs/toolkit";
import { getPosts, deletePost } from "../apis/postFormService";

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    savePost: [],
    loading: true,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    setSavePosts: (state, action) => {
      state.savePost = action.payload;
      state.loading = false;
    },
    deletePosts: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.post_id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setPosts, setSavePosts, deletePosts, setLoading } =
  postSlice.actions;
export default postSlice.reducer;
