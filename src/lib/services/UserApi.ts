import {api, paginationConfig} from './core/ApiConfig';
import {SIGN_IN_URL} from './core/ApiEndpoints';
import {ApiTags} from './core/ApiTags';

export const UserApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    signin: build.mutation({
      query: body => ({
        url: SIGN_IN_URL,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {useSigninMutation} = UserApi;
