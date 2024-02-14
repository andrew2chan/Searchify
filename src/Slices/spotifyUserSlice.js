import { createSlice } from '@reduxjs/toolkit';

export const spotifyUserSlice = createSlice({
    name: "spotifyUserSlice",
    initialState: {
        "accessToken": null,
        "refreshToken": null
    },
    reducers: {
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateRefreshToken: (state, action) => {
            state.code = action.payload;
        }
    }
})

export const { updateAccessToken, updateRefreshToken } = spotifyUserSlice.actions;

export default spotifyUserSlice.reducer;