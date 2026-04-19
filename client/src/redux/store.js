import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import {persistReducer,persistStore} from "redux-persist"
import sessionStorage from "redux-persist/es/storage/session";


const persistConfig = {
  key: "root",
  storage: sessionStorage
};

const rootReducer = combineReducers({
  user: userSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)