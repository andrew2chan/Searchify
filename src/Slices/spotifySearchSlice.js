import {createSlice} from '@reduxjs/toolkit';

export const spotifySearchSlice = createSlice({
    name: "spotifySearchSlice",
    initialState: {
        "returnedInfo": {},
        "relatedArtistsInfo": []
    },
    reducers: {
        updateSearchedInfo: (state, action) => {
            state.returnedInfo = action.payload;
        },
        updateRelatedArtistsInfo: (state, action) => {
            state.relatedArtistsInfo = [...state.relatedArtistsInfo, ...action.payload];
        }
    }
})

export const { updateSearchedInfo, updateRelatedArtistsInfo } = spotifySearchSlice.actions;

export default spotifySearchSlice.reducer;