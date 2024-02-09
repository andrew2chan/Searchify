import './App.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ls from 'localstorage-slim';
import { updateInitialState } from './Slices/spotifyUserSlice';
import { useDispatch } from 'react-redux';
import { client_id, client_secret } from './env/env.js';

import NavBar from './Component/NavBar.js';
import Main from './Component/Main.js';
import LandingPage from './Component/LandingPage.js';
import AuthorizationPage from './Component/AuthorizationPage.js';

function App() {
  const dispatch = useDispatch();
  const spotifyCode = useSelector((state) => state.spotifyUserSlice.code)
  const [relatedArtistInfo, updateRelatedArtistsInfo] = useState();

  /*const spotifyAccessToken = () => {

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

      console.log(res);

      //this is your access token for making requests
      ls.set('accessToken', res.access_token, { ttl: 3600 }); //sets it to expire out of local storage after 1h
      dispatch(updateInitialState(ls.get('accessToken'))); // updates the redux with the access token
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
  })*/

  const MainPage = () => {
    return (
      <>
        <NavBar updateRelatedArtistsInfo={updateRelatedArtistsInfo} />
        <Main relatedArtistInfo={relatedArtistInfo} />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      element: <LandingPage />,
      path: '/',
      loader: async () => {
        let data = { test: "me" }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; utf-8',
            },
          }
        );
      }
    },
    {
      element: <AuthorizationPage />,
      path: '/authorize'
    },
    {
      element: <MainPage />,
      path: '/main'
    }
  ]);

  return (
    <div className="bg-neutral-900 h-screen w-screen grid auto-rows-1minfill text-white font-body">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
