import {createSlice} from '@reduxjs/toolkit';

export const spotifySearchSlice = createSlice({
    name: "spotifySearchSlice",
    initialState: {
        "returnedInfo": {},
        "relatedArtistsInfo": {}
    },
    reducers: {
        updateSearchedInfo: (state, action) => {
            state.returnedInfo = action.payload;
        },
        updateRelatedArtistsInfo: (state, action) => {
            state.relatedArtistsInfo = action.payload;
        }
    }
})

export const { updateSearchedInfo } = spotifySearchSlice.actions;

export default spotifySearchSlice.reducer;