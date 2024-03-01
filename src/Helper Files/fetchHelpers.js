import { handleRefreshTokens } from "./authorizationHelpers"

/*
@param method the request method (GET, PUT)
@param url the endpoint that we are sending our data to
@param body (optional) send if we have a body
the master variable for fetch - paths on what to return
*/
const fetchMaster = async (method, url, body) => {
    let accessToken = returnAccessToken();

    let options = {
        method,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    if(body) { //adds addition fields if body is given
        options["body"] = body;
        options.headers["Content-Type"] = "application/json";
    }

    try {
        switch(method) {
            case 'GET':
                const response = await fetch(url, options)
                if(response.status === 204) return; //handles when nothing is playing and spotify api seems to be in sleep mode
                return await response.json();
            case 'PUT':
                return await fetch(url, options)
            default: //should never reach this
                return;
        }
    }
    catch(err) {
        throw new Error(err);
    }
}

const returnAccessToken = () => {
    return handleRefreshTokens();
}

export { fetchMaster }