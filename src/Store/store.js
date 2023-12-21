import { configureStore } from '@reduxjs/toolkit';
import spotifyUserSliceReducer from '../Slices/spotifyUserSlice';
import spotifySearchSliceReducer from '../Slices/spotifySearchSlice';

export default configureStore({
    reducer: {
        spotifyUserSlice: spotifyUserSliceReducer,
        spotifySearchSlice: spotifySearchSliceReducer
    }
})