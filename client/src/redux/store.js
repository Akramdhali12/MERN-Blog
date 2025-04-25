import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combines multiple reducers into a single root reducer. Here:
const rootReduceer = combineReducers({
  // user is the key in the Redux state object.
  // userReducer is the reducer function responsible for handling actions related to the user state
    user:userReducer,
    theme:themeReducer,
});

// Configures how redux-persist will save and retrieve the Redux state
const persistConfig = {
    // The key used in the storage engine (e.g., localStorage) to store the state.
    key: 'root',
    // Specifies the storage engine to use
    storage,
    version:1,
}

// Wraps the rootReducer with persistReducer, adding functionality to:
// Save the Redux state into localStorage.
const persistedReducer = persistReducer(persistConfig,rootReduceer);

//Initializes the Redux store using configureStore
export const store = configureStore({
  reducer: persistedReducer,
  // Extends the default middleware with a custom configuration
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false}),
});

export const persistor = persistStore(store);
//akhan theke cole jabo main.jsx ae.sekhane ata add korbo