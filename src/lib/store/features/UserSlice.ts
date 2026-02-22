import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserAuth {
  id?: number;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface UserState {
  user: UserAuth;
}

const initialState: UserState = {
  user: {},
};

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    // Maps from API response: { access, refresh, role, id }
    appSetUser: (state, action: PayloadAction<any>) => {
      const payload = action.payload.data;
      state.user = {
        ...state.user,
        id: payload.id ?? state.user.id,
        role: payload.role ?? state.user.role,
        accessToken:
          payload.access ?? payload.accessToken ?? state.user.accessToken,
        refreshToken:
          payload.refresh ?? payload.refreshToken ?? state.user.refreshToken,
      };
    },
    appSetLogout: state => {
      state.user = {};
    },
  },
});

export const { appSetUser, appSetLogout } = userSlice.actions;

export default userSlice.reducer;
