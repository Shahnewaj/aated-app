import {API_BASE_URL, REFRESH_TOKEN_URL} from './ApiEndpoints';
import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../../store';
import {ApiTags} from './ApiTags';
import {Mutex} from 'async-mutex';
import {appSetLogout, appSetUser} from '../../store/features/UserSlice';

export const paginationConfig = {
  serializeQueryArgs: ({queryArgs}: any) => {
    const newQueryArgs = {...queryArgs};
    if (typeof newQueryArgs.offset === 'number') {
      delete newQueryArgs.offset;
    }
    return newQueryArgs;
  },
  forceRefetch: ({currentArg, previousArg}: any) => {
    return currentArg?.offset !== previousArg?.offset;
  },
  merge: (currentCache: any, newItems: any, {arg}: any) => {
    if (Array.isArray(newItems?.data) && arg?.offset > 1) {
      const filteredItems = newItems?.data?.filter(
        (item: any) =>
          !currentCache?.data?.some(
            (cacheItem: any) => cacheItem.id === item.id,
          ),
      );
      return {
        ...newItems,
        data: [...(currentCache?.data || []), ...filteredItems],
      };
    } else {
      return newItems;
    }
  },
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).user?.user?.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const refreshTokenMutex = new Mutex();

const baseQueryWithReauth = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  await refreshTokenMutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // for invalid token
  if (result.error && result.error.status === 401) {
    api.dispatch(appSetLogout());
  }

  // handle unauthorized: try to refresh token if tokens exist
  if (result.error && result.error.status === 498) {
    const state = api.getState() as RootState;
    const refreshToken = state?.user?.user?.refreshToken;

    if (refreshToken) {
      if (!refreshTokenMutex.isLocked()) {
        const release = await refreshTokenMutex.acquire();
        try {
          const refreshResult: any = await baseQuery(
            {
              url: REFRESH_TOKEN_URL,
              method: 'POST',
              body: {
                refreshToken,
              },
            },
            api,
            extraOptions,
          );
          if (refreshResult.data && refreshResult.data.data) {
            // update store with new tokens
            api.dispatch(appSetUser(refreshResult.data.data));
            // retry request
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(appSetLogout());
          }
        } finally {
          release();
        }
      } else {
        await refreshTokenMutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  // 👇 Convert 404 errors into successful responses
  if (result.error?.status === 404) {
    return {data: result.error.data}; // Pass the 404 response as data
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  keepUnusedDataFor: 5,
  tagTypes: Object.values(ApiTags),
});
