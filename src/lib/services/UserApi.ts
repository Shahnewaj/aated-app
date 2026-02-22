import { api } from './core/ApiConfig';
import {
  SIGN_IN_URL,
  SIGN_UP_URL,
  SIGN_UP_VERIFY_URL,
  BATCH_LIST_URL,
  FORGOT_PASSWORD_URL,
  ALL_MEMBERS_URL,
  OCCUPATIONS_URL,
  JOB_DEPARTMENTS_URL,
} from './core/ApiEndpoints';
import { ApiTags } from './core/ApiTags';

export const UserApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    // Sign In - POST /api/v1/users/token/
    // Body: { username, password }
    // Response: { access, refresh, role, id }
    signin: build.mutation({
      query: body => ({
        url: SIGN_IN_URL,
        method: 'POST',
        body,
      }),
    }),

    // Sign Up Step 1 - POST /api/v1/users/sign-up/
    // Body: { email, name, phone, password, batch, student_id, passing_year }
    // Response: { success, message, data }
    signup: build.mutation({
      query: body => ({
        url: SIGN_UP_URL,
        method: 'POST',
        body,
      }),
    }),

    // Sign Up Step 2: OTP Verification - POST /api/v1/users/sign-up/
    // Body: { email, otp }
    verifyOtp: build.mutation({
      query: body => ({
        url: SIGN_UP_VERIFY_URL,
        method: 'POST',
        body,
      }),
    }),

    // Get list of batches for signup form dropdown
    getBatches: build.query({
      query: () => ({
        url: BATCH_LIST_URL,
        method: 'GET',
      }),
    }),

    // Forgot Password Step 1 - POST /api/v1/users/forgot-password/
    // Body: { email }  →  sends OTP to email
    forgotPassword: build.mutation({
      query: body => ({
        url: FORGOT_PASSWORD_URL,
        method: 'POST',
        body,
      }),
    }),

    // Forgot Password Step 2 - POST /api/v1/users/forgot-password/
    // Body: { email, otp, password }  →  resets password
    resetPassword: build.mutation({
      query: body => ({
        url: FORGOT_PASSWORD_URL,
        method: 'POST',
        body,
      }),
    }),

    // Member List & Search - GET /api/v1/users/all-members/
    getAllMembers: build.query({
      query: params => ({
        url: ALL_MEMBERS_URL,
        method: 'GET',
        params,
      }),
      providesTags: [ApiTags.Member],
    }),

    // Member Details - GET /api/v1/users/all-members/{id}/
    getMemberDetails: build.query({
      query: id => ({
        url: `${ALL_MEMBERS_URL}${id}/`,
        method: 'GET',
      }),
    }),

    // Occupation List - GET /api/v1/core/public/occupations/
    getOccupations: build.query({
      query: () => ({
        url: OCCUPATIONS_URL,
        method: 'GET',
        params: { limit: 100 },
      }),
      providesTags: [ApiTags.Core],
    }),

    // Job Department List - GET /api/v1/core/public/job-departments/
    getJobDepartments: build.query({
      query: search => ({
        url: JOB_DEPARTMENTS_URL,
        method: 'GET',
        params: { search, limit: 500 },
      }),
      providesTags: [ApiTags.Core],
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useGetBatchesQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAllMembersQuery,
  useGetMemberDetailsQuery,
  useGetOccupationsQuery,
  useGetJobDepartmentsQuery,
} = UserApi;
