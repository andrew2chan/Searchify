import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearchedInfo } from '../Slices/spotifySearchSlice';

const NavBar = () => {
    const [artistName, updateArtistName] = useState("");
    const accessToken = useSelector((state) => state.spotifyUserSlice.accessToken);
    const dispatch = useDispatch();

    // sets the artist name pulled from the user input
    const setArtistName = (e) => {
        updateArtistName(e.target.value);
    }

    // submits the artist name to the spotify api and returns info based on that
    const setArtistSubmit = (e) => {
        fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1&offset=0`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
        .then((response) => {
            console.log(response);
            if(!response.hasOwnProperty("error") ) dispatch(updateSearchedInfo(response));
            getRelatedArtists(response);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // get related artists
    const getRelatedArtists = (response) => {
        const idFromResponse = response.artists.items[0].id;

        fetch(`https://api.spotify.com/v1/artists/${idFromResponse}/related-artists`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <div className="w-screen">
                <div className="flex justify-center py-3">
                        <input type="text" name="artist_name" onChange={setArtistName} id="artist_name" className="rounded-l-full p-1 pl-4 text-black text-xl tracking-wide outline-none min-w-0" />
                        <button type="button" name="submit_artist_name" onClick={setArtistSubmit} id="submit_artist_name" className="bg-lime-500 text-black rounded-tr rounded-br p-1 text-xl font-bold hover:bg-lime-600 transition ease-in-out duration-300 w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                </div>
            </div>
        </>
    )
}

export default NavBar;