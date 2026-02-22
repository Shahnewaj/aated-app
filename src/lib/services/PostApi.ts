import { api } from './core/ApiConfig';
import {
  POST_CATEGORY_URL,
  POST_MANAGE_URL,
  COMMENT_URL,
} from './core/ApiEndpoints';
import { ApiTags } from './core/ApiTags';

export const PostApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    // GET /api/v1/post/category/
    getCategories: build.query({
      query: () => ({
        url: POST_CATEGORY_URL,
        method: 'GET',
      }),
      providesTags: [ApiTags.Post],
    }),

    // GET /api/v1/post/manage-post/
    getPosts: build.query({
      query: params => ({
        url: POST_MANAGE_URL,
        method: 'GET',
        params,
      }),
      providesTags: [ApiTags.Post],
    }),

    // GET /api/v1/post/manage-post/{id}/
    getPostDetails: build.query({
      query: id => ({
        url: `${POST_MANAGE_URL}${id}/`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: ApiTags.Post, id },
        ApiTags.Comment,
      ],
    }),

    // POST /api/v1/post/manage-post/
    createPost: build.mutation({
      query: body => ({
        url: POST_MANAGE_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: [ApiTags.Post],
    }),

    // PATCH /api/v1/post/manage-post/{id}/
    updatePost: build.mutation({
      query: ({ id, ...body }) => ({
        url: `${POST_MANAGE_URL}${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: ApiTags.Post, id },
        ApiTags.Post,
      ],
    }),

    // DELETE /api/v1/post/manage-post/{id}/
    deletePost: build.mutation({
      query: id => ({
        url: `${POST_MANAGE_URL}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [ApiTags.Post],
    }),

    // POST /api/v1/post/comment/
    createComment: build.mutation({
      query: body => ({
        url: COMMENT_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: [ApiTags.Comment],
    }),

    // PATCH /api/v1/post/comment/ (Update)
    // Body: { comment_id, comment }
    updateComment: build.mutation({
      query: body => ({
        url: COMMENT_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [ApiTags.Comment],
    }),

    // PATCH /api/v1/post/comment/ (Remove)
    // Body: { comment_id, is_active: false }
    removeComment: build.mutation({
      query: body => ({
        url: COMMENT_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [ApiTags.Comment],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetPostsQuery,
  useGetPostDetailsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useRemoveCommentMutation,
} = PostApi;
