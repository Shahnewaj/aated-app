import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {},
} as any;

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    appSetUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    appSetLogout: state => {
      state.user = {};
    },
  },
});

export const {appSetUser, appSetLogout} = userSlice.actions;

export default userSlice.reducer;
