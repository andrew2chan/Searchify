import { configureStore } from '@reduxjs/toolkit';
import spotifyUserSliceReducer from '../Slices/spotifyUserSlice';

export default configureStore({
    reducer: {
        spotifyUserSlice: spotifyUserSliceReducer
    }
})