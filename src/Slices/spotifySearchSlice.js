import {createSlice} from '@reduxjs/toolkit';

export const spotifySearchSlice = createSlice({
    name: "spotifySearchSlice",
    initialState: {
        "returnedInfo": {},
        "firstTimeLoaded": true
    },
    reducers: {
        updateSearchedInfo: (state, action) => {
            state.returnedInfo = action.payload;
        },
        updateFirstTimeLoaded: (state, action) => {
            state.firstTimeLoaded = action.payload;
        },
    }
})

export const { updateSearchedInfo, updateRelatedArtistsInfo, updateFirstTimeLoaded } = spotifySearchSlice.actions;

export default spotifySearchSlice.reducer;