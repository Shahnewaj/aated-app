import { api } from './core/ApiConfig';
import { PROFILE_URL, EXPERIENCES_URL } from './core/ApiEndpoints';
import { ApiTags } from './core/ApiTags';

export const ProfileApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    // Get Own Profile
    getProfile: build.query({
      query: () => ({
        url: PROFILE_URL,
        method: 'GET',
      }),
      providesTags: [ApiTags.Profile],
    }),

    // Update Own Profile
    updateProfile: build.mutation({
      query: body => ({
        url: PROFILE_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [ApiTags.Profile],
    }),

    // Update Password
    updatePassword: build.mutation({
      query: body => ({
        url: PROFILE_URL,
        method: 'PATCH',
        body, // payload: { password }
      }),
    }),

    // Get Job Experiences
    getExperiences: build.query({
      query: () => ({
        url: EXPERIENCES_URL,
        method: 'GET',
      }),
      providesTags: [ApiTags.Experience],
    }),

    // Create Job Experience
    createExperience: build.mutation({
      query: body => ({
        url: EXPERIENCES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: [ApiTags.Experience],
    }),

    // Update Job Experience
    updateExperience: build.mutation({
      query: ({ id, ...body }) => ({
        url: `${EXPERIENCES_URL}${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [ApiTags.Experience],
    }),

    // Delete Job Experience
    deleteExperience: build.mutation({
      query: id => ({
        url: `${EXPERIENCES_URL}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [ApiTags.Experience],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = ProfileApi;
