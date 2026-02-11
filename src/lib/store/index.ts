import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import userReducer from './features/UserSlice';
import { MMKV } from 'react-native-mmkv';
import { api } from '../services/core/ApiConfig';

export const storage = new MMKV();

const reduxStorage = {
  setItem: (key: any, value: any) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: any) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: any) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const rootReducer = combineReducers({
  user: userReducer,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  timeout: 0,
  blacklist: [api.reducerPath],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // enhancers: (getDefaultEnhancers) => {
  //   return __DEV__
  //     ? [...getDefaultEnhancers(), reactotron.createEnhancer()]
  //     : getDefaultEnhancers();
  // },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export const getDispatch = () => {
  return store.dispatch;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
