import {createSlice} from '@reduxjs/toolkit';

export const spotifySearchSlice = createSlice({
    name: "spotifySearchSlice",
    initialState: {
        "returnedInfo": {}
    },
    reducers: {
        updateSearchedInfo: (state, action) => {
            state.returnedInfo = action.payload;
        }
    }
})

export const { updateSearchedInfo, updateRelatedArtistsInfo } = spotifySearchSlice.actions;

export default spotifySearchSlice.reducer;