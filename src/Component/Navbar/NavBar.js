import './NavBar.css'
import { useState } from 'react';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const [artistName, updateArtistName] = useState("");
    const accessToken = useSelector((state) => state.spotifyUserSlice.accessToken);

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
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <div className="nav-bar-input-block">
                <input type="text" name="artist_name" onChange={setArtistName} id="artist_name" className="nav-bar-input" />
                <input type="button" name="submit_artist_name" onClick={setArtistSubmit} id="submit_artist_name" value="Search!" className="nav-bar-input" />
            </div>
        </>
    )
}

export default NavBar;