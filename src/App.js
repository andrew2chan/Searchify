import './App.css';
import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import NavBar from './Component/NavBar.js';
import Main from './Component/Main.js';
import LandingPage from './Component/LandingPage.js';
import AuthorizationPage from './Component/AuthorizationPage.js';

function App() {
  const [relatedArtistInfo, updateRelatedArtistsInfo] = useState();

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
