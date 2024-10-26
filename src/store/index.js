import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/userSlice'
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
  key: "user",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: {},
    }),
})

export const persistor = persistStore(store);