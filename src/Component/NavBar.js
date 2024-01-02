import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearchedInfo, updateRelatedArtistsInfo } from '../Slices/spotifySearchSlice';
import { fetchArtistByName, fetchRelatedArtistById } from './helperFunctions';
import { RelatedArtistsNode } from '../Models/RelatedArtists';

const NavBar = () => {
    const [artistName, updateArtistName] = useState("");
    const [artistTree, updateArtistTree] = useState();
    const c = useRef(1); //used as a global var to set base case to exit from BFS search
    const accessToken = useSelector((state) => state.spotifyUserSlice.accessToken);
    const dispatch = useDispatch();
    const MAX_ARTISTS_ON_SCREEN = 50; // sets the max number of artists that can be on screen at one time
    const MAX_RELATED_ARTISTS = 5; // sets the max number of related artists that we will be showing per artist

    c.current = 1;

    // get related artists
    const getRelatedArtists = (response) => {
        const idFromResponse = response.artists.items[0].id;

        let artistRoot = new RelatedArtistsNode(idFromResponse, null, response.artists.items[0], 1);

        fetchRelatedArtistById(idFromResponse, accessToken)
        .then((response2) => {
            for(let i = 0; i < Math.min(MAX_RELATED_ARTISTS, response2.artists.length); i++) {
                artistRoot.relatedArtists.push(new RelatedArtistsNode(response2.artists[i].id, idFromResponse, response2.artists[i], 2))
                c.current++;
            }
        })
        .then(() => {
            createArtistsTree(artistRoot);
        })
        .catch((err) => {
            console.log(err);
        });
        console.log(artistRoot);
    }

    const createArtistsTree = (root) => { // BFS down the tree in order to create new related artists
        if(c.current > MAX_ARTISTS_ON_SCREEN) return;

        for(let i = 0; i < root.relatedArtists.length; i++) { //go through all the intial related artists
            let relatedArtistID = root.relatedArtists[i].id;

            fetchRelatedArtistById(relatedArtistID, accessToken)
            .then((response) => {
                for(let k = 0; k < Math.min(MAX_RELATED_ARTISTS, response.artists.length); k++) { //get related artists for each related artist
                    root.relatedArtists[i].relatedArtists.push(new RelatedArtistsNode(response.artists[k].id, root.relatedArtists[i].id, response.artists[k], root.relatedArtists[i].level + 1))
                    c.current++;
                }
            })
            .then(() => {
                createArtistsTree(root.relatedArtists[i]);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    // sets the artist name pulled from the user input
    const setArtistName = (e) => {
        updateArtistName(e.target.value);
    }

    // submits the artist name to the spotify api and returns info based on that
    const setArtistSubmit = (e) => {
        fetchArtistByName(artistName, accessToken)
        .then((response) => {
            console.log(response);
            if(!response.hasOwnProperty("error") ) { // only update the store if we don't run into an error while getting the artist, usually due to token being expired
                dispatch(updateSearchedInfo(response));
            }

            getRelatedArtists(response); //gets a list of related artists so that we can propagate downward
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