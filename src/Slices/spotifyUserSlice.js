import { createSlice } from '@reduxjs/toolkit';

export const spotifyUserSlice = createSlice({
    name: "spotifyUserSlice",
    initialState: {
        "accessToken": null,
        "refreshToken": null,
        "token_expires_at": null
    },
    reducers: {
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        updateExpiresAt: (state, action) => {
            state.token_expires_at = action.payload;
        }
    }
})

export const { updateAccessToken, updateRefreshToken, updateExpiresAt } = spotifyUserSlice.actions;

export default spotifyUserSlice.reducer;