import './App.css';
import { useEffect } from 'react';
import ls from 'localstorage-slim';
import { updateInitialState } from './Slices/spotifyUserSlice';
import { useDispatch } from 'react-redux';
import { client_id, client_secret } from './env/env.js';

import NavBar from './Component/Navbar/NavBar.js';

function App() {
  const dispatch = useDispatch();

  const spotifyAccessToken = () => {

    // fetch the access token from spotify
    fetch('https://accounts.spotify.com/api/token', {
      'method': 'POST',
      'headers': {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      'body': 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret // you will need to get your own client id and client secret from the spotify developer site to fill this in
    })
    .then((blob) => {
      return blob.json();
    })
    .then((res) => {

      //this is your access token for making requests
      ls.set('accessToken', res.access_token, { ttl: 3600 }); //sets it to expire out of local storage after 1h
      console.log("FROM SPOTIFY API: " + ls.get('accessToken'));
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  // Every render, it sets the access token to make sure we have a working access token
  useEffect(() => {
    if(!ls.get('accessToken')) { //if we can't find an access token then we make a request for it
      spotifyAccessToken();
    }

    dispatch(updateInitialState(ls.get('accessToken'))); // updates the redux with the access token

    console.log("FROM LOCALSTORAGE: " + ls.get('accessToken'));
  })

  return (
    <div className="bg-neutral-900 h-screen grid auto-rows-min text-white font-body">
      <NavBar />
      <div>TEst</div>
    </div>
  );
}

export default App;
