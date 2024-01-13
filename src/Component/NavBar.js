import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearchedInfo } from '../Slices/spotifySearchSlice';
import { fetchArtistByName, fetchRelatedArtistById } from './helperFunctions';
import { RelatedArtistsNode } from '../Models/RelatedArtists';

const NavBar = (props) => {
    const [artistName, updateArtistName] = useState("");
    const accessToken = useSelector((state) => state.spotifyUserSlice.accessToken);
    const dispatch = useDispatch();
    const MAX_ARTISTS_ON_SCREEN = 50; // sets the max number of artists that can be on screen at one time + MAX_RELATED_ARTISTS + 1 (1 for main / 5 for initial 5 / 50 extra)
    const MAX_RELATED_ARTISTS = 2; // sets the max number of related artists that we will be showing per artist

    // get related artists
    const getRelatedArtists = async (node) => {
        let q = [];
        let level = 2;
        let c = 1;
        let nodes = [];
        q.push(node);

        while(q.length > 0) {
            let len = q.length;

            for(let i = 0; i < len; i++) {
                let currNode = q.shift();
                let tmpLevel = level;
                nodes.push(currNode);
                c++;
                if(c > MAX_ARTISTS_ON_SCREEN) return nodes; // we have hit our cap so we return the nodes array

                await fetchRelatedArtistById(currNode.id, accessToken)
                .then((response) => {
                    let tmpC = 0; // Makes sure that we start below the max related artists
                    response.artists.map((item, index) => {
                        if(tmpC >= MAX_RELATED_ARTISTS) return null; //break out if more than MAX_RELATED_ARTISTS
                        if(nodes.some((e) => e.id === item.id) || q.some((e) => e.id === item.id)) return null; // checks the saved lists to make sure that we don't have duplicate artists

                        tmpC++;

                        q.push(new RelatedArtistsNode(item.id, currNode.id, item, tmpLevel, null));

                        return null;
                    });
                    //console.log(nodes);
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            level++;
        }

        return nodes;
    }

    // sets the artist name pulled from the user input
    const setArtistName = (e) => {
        updateArtistName(e.target.value);
    }

    // submits the artist name to the spotify api and returns info based on that
    const setArtistSubmit = async (e) => {
        await fetchArtistByName(artistName, accessToken)
        .then(async (response) => {
            //console.log(response);
            if(!response.hasOwnProperty("error") ) { // only update the store if we don't run into an error while getting the artist, usually due to token being expired
                dispatch(updateSearchedInfo(response));
            }

            let newNode = new RelatedArtistsNode(response.artists.items[0].id, null, response.artists.items[0], 1, null);

            //Gets the related artists
            let relatedArtistTree = await getRelatedArtists(newNode); //gets a list of related artists so that we can propagate downward

            for(let i = 0; i < relatedArtistTree.length; i++) { //assign the current index to each of the related artist to be used for linking later in d3
                relatedArtistTree[i].currentIndex = i;
            }

            props.updateRelatedArtistsInfo(relatedArtistTree); //pass this back up to the parent component

        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <div className="w-screen">
                <div className="flex justify-center py-3">
                        <input type="text" name="artist_name" onChange={setArtistName} id="artist_name" className="rounded-l-full p-1 pl-4 text-black text-xl tracking-wide outline-none min-w-0" />
                        <button type="button" name="submit_artist_name" onClick={setArtistSubmit} id="submit_artist_name" className="bg-lime-500 text-black rounded-tr rounded-br p-1 text-xl font-bold hover:bg-lime-600 transition ease-in-out duration-300 w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                </div>
            </div>
        </>
    )
}

export default NavBar;