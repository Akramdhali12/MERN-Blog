import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error:null,
    loading: false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error= null;
        },
        signInFailure: (state,action)=>{
            state.loading = false;
            state.error= action.payload;
        },
        // --- NEW UPDATE ACTIONS ---
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload; // updated user object from backend
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart:(state)=>{
            state.currentUser=null;
            state.loading = false;
            state.error=null;
        },
        deleteUserSuccess:(state)=>{
            state.loading = true;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signoutSuccess:(state)=>{
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },

    },
});

export const{
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,   // Export new action
    updateUserSuccess,  // Export new action
    updateUserFailure,  // Export new action
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;