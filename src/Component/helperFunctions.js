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

export { fetchArtistByName, fetchRelatedArtistById }