import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//for redux-persist
const rootReduceer = combineReducers({
    user:userReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    version:1,
}
const persistedReducer = persistReducer(persistConfig,rootReduceer);
//redux-toolkit
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false}),
});

export const persistor = persistStore(store);
//akhan theke cole jabo main.jsx ae.sekhane ata add korbo