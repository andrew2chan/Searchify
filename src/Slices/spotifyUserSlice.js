import { createSlice } from '@reduxjs/toolkit';

export const spotifyUserSlice = createSlice({
    name: "spotifyUserSlice",
    initialState: {
        "accessToken": null
    },
    reducers: {
        updateInitialState: (state, action) => {
            state.accessToken = action.payload;
        },
        updateCode: (state, action) => {
            state.code = action.payload;
        }
    }
})

export const { updateInitialState } = spotifyUserSlice.actions;

export default spotifyUserSlice.reducer;