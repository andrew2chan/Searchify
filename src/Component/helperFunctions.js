/*
@param artistName The name of artist in plain text
@param accessToken The access token that you get from spotify

Takes the artist name and access token and returns the information from the spotify API
*/
const fetchArtistByName = async (artistName, accessToken) => {
    return await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1&offset=0`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
}

/*
@param artistId The ID of the artist
@param accessToken is the access token that you get from spotify

Takes and artist's id and access token and returns the related artists from the spotify API
*/
const fetchRelatedArtistById = async (artistId, accessToken) => {
    return await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
}

/*
@param artistId The ID of the artist
@param accessToken is the access token that you get from spotify

Takes and artist's id and access token and returns the top tracks for that artist
*/
const fetchTopTracksById = async (artistId, accessToken) => {
    return await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=CA`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
}

/*
@param accessToken is the access token that you get from spotify

Takes an access token and returns the devices available
*/
const fetchDevicesAvailable = async (accessToken) => {
    return await fetch('https://api.spotify.com/v1/me/player/devices', {
            "method": "GET",
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((blob) => blob.json())
}

/*
@param uri of the track id
@param accessToken is the access token that you get from spotify
@param deviceId is the device we want to play to, default to first device

Plays the track with a given uri
*/
const fetchPlayTrack = async (uri, accessToken, deviceId) => {
    return await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            "method": "PUT",
            "headers": {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "uris": [`${uri}`]
            })
        })
}

/*
@param accessToken is the access token that you get from spotify

Gets currently playing song
*/
const fetchCurrentlyPlayingTrack = async (accessToken) => {
    return await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            "method": "GET",
            "headers": {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then((blob) => blob.json())
}

export { fetchArtistByName, fetchRelatedArtistById, fetchTopTracksById, fetchDevicesAvailable, fetchPlayTrack, fetchCurrentlyPlayingTrack }