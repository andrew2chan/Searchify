import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ls from 'localstorage-slim';
import { client_id } from '../env/env.js';
import { updateAccessToken, updateRefreshToken, updateExpiresAt } from "../Slices/spotifyUserSlice";
import { checkExistingTokens } from "../Helper Files/authorizationHelpers.js";

const AuthorizationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);

    useEffect(() => { //handle redirect back to main page if we don't have an access token, deals with refreshes on the page
      if(checkExistingTokens()) {
          let lsAccessToken = ls.get("access_token");
          let lsRefreshToken = ls.get("refresh_token");
          let lsExpiresAt = ls.get('expires_at');

          dispatch(updateAccessToken(lsAccessToken));
          dispatch(updateRefreshToken(lsRefreshToken));
          dispatch(updateExpiresAt(lsExpiresAt));
      }
      else {
          navigate('/');
      }
  }, [dispatch, navigate])

    const getToken = async code => {
        // stored in the previous step
        let codeVerifier = ls.get('code_verifier');
      
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: client_id,
            grant_type: 'authorization_code',
            code,
            redirect_uri: window.location.origin + '/authorize', //for verification, doesn't redirect but must match what we used before
            code_verifier: codeVerifier,
          }),
        }
      
        const body = await fetch('https://accounts.spotify.com/api/token', payload);
        const response = await body.json();

        return response;
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        if(checkExistingTokens()) { // go directly to main in case we have a token
          let lsAccessToken = ls.get("access_token");
          let lsRefreshToken = ls.get("refresh_token");
          let lsExpiresAt = ls.get('expires_at');

          dispatch(updateAccessToken(lsAccessToken));
          dispatch(updateRefreshToken(lsRefreshToken));
          dispatch(updateExpiresAt(lsExpiresAt));

          navigate('/main');
        }
        else {
            //navigate('/');

            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get('code');
    
            new Promise((resolve, reject) => {
                let response = getToken(code);
    
                resolve(response);
            })
            .then((response) => {
                //console.log(response);
                ls.set('access_token', response.access_token);
                ls.set('refresh_token', response.refresh_token);
                ls.set('expires_at', new Date().getTime() + response.expires_in * 1000);
                dispatch(updateAccessToken(ls.get("access_token")));
                dispatch(updateRefreshToken(ls.get("refresh_token")));
                dispatch(updateExpiresAt(ls.get('expires_at')));
                navigate('/main');
            })
            .catch((err) => {
                console.log(err);
            })

        }
        
    },[dispatch, navigate])

    return <h1>WORKING...</h1>
}

export default AuthorizationPage;