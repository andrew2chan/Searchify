import ls from 'localstorage-slim';

import { client_id } from '../env/env.js';

const LandingPage = () => {
    // code from spotify, generates a random string
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    // hashes the random number
    const sha256 = (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    // converts to base 64
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    const handleClick = async (e) => {
        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);

        const clientId = client_id;
        const redirectUri = 'http://localhost:3000/authorize'; //where we direct back to after authorization

        const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'; //sets the scope of all the things we are authorized to use
        const authUrl = new URL("https://accounts.spotify.com/authorize");

        ls.set('code_verifier', codeVerifier); //sets the code into local storage

        const params =  {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }
        
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString(); //redirects to the spotify authorization page
    }

    return (
        <>
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="border border-lime-600 px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition duration-500 ease-linear text-2xl tracking-wider font-rounded cursor-pointer" onClick={handleClick}>Login</div>
            </div>
        </>
    );
}

export default LandingPage;