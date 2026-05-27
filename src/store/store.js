import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistConfig } from "./rootConfig";
import submenuReducer from "./slice/submenuSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  REGISTER,
  PERSIST,
  PURGE,
  PAUSE,
} from "redux-persist";
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  submenu : submenuReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
