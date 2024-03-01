import { client_id } from "../env/env";
import ls from 'localstorage-slim';

/*
@return true or false depending on if we have an access and refresh token saved or not
*/
const checkExistingTokens = () => {
    let accessToken = ls.get("access_token");
    let refreshToken = ls.get("refresh_token");

    return accessToken && refreshToken;
}

const getRefreshToken = async () => {
    let refreshToken = ls.get('refresh_token');
    const url = "https://accounts.spotify.com/api/token";
    
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: client_id
        }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();

    return response;
}

/*
handles refresh tokens
*/
const handleRefreshTokens = () => {
    let expiresAt = ls.get('expires_at');
    let currentTime = new Date().getTime();
    let accessToken;

    if(currentTime > expiresAt && checkExistingTokens) { //current access token has expired and we need to get a new one

        let newAccessTokenPromise = new Promise((resolve, reject) => {
            resolve(getRefreshToken());
        })
        .then((response) => {
            ls.set('access_token', response.access_token);
            ls.set('refresh_token', response.refresh_token);
            ls.set('expires_at', new Date().getTime() + response.expires_in * 1000);

            let accessToken = ls.get('access_token');
            return accessToken;
        })
        .catch((err) => {
            throw new Error(err);
        });

        accessToken = newAccessTokenPromise;
    }
    else { //current access token is still valid so we just pull it
        accessToken = ls.get('access_token');
    }

    return accessToken;
}

export { checkExistingTokens, handleRefreshTokens }