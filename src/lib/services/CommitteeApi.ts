import { api } from './core/ApiConfig';
import { COMMITTEE_URL, COMMITTEE_MEMBER_URL } from './core/ApiEndpoints';
import { ApiTags } from './core/ApiTags';

export const CommitteeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    getCommittees: build.query({
      query: () => ({
        url: COMMITTEE_URL,
        method: 'GET',
      }),
      providesTags: [ApiTags.Committee],
    }),
    getCommitteeDetails: build.query({
      query: id => ({
        url: `${COMMITTEE_URL}${id}/`,
        method: 'GET',
      }),
    }),
    getCommitteeMembers: build.query({
      query: committeeId => ({
        url: COMMITTEE_MEMBER_URL,
        method: 'GET',
        params: { committee_id: committeeId },
      }),
    }),
  }),
});

export const {
  useGetCommitteesQuery,
  useGetCommitteeDetailsQuery,
  useGetCommitteeMembersQuery,
} = CommitteeApi;
