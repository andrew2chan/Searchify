import * as d3 from "d3";
import { useSelector } from "react-redux";
import GraphImages from "./GraphImages";
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMaster } from "../Helper Files/fetchHelpers";

const Main = (props) => {
    const [linksList, updateLinksList] = useState();
    const [selectedNode, updateSelectedNode] = useState();
    const [currentTrack, updateCurrentTrack] = useState("");
    const [deviceID, updateDeviceID] = useState("");
    const accessToken = useSelector((state) => state.spotifyUserSlice.accessToken);
    const svgElement = useRef();
    const musicControls = useRef();
    const { relatedArtistInfo: arrRelatedArtists } = props;
    const circleRadius = 20;
    const firstTimeLoaded = useSelector(state => state.spotifySearchSlice.firstTimeLoaded);
    const [infoBoxStatus, updateInfoBoxStates] = useState(false);

    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const handleZoom = (e) => {
        d3.selectAll("g")
            .attr("transform", e.transform); //attr transform takes 
    }

    const handleClickOnSongName = (e) => {
        let uriClicked = d3.select(e.target)
            .attr("data_uri"); //gets the uri that is saved in the data_uri attr

        let body = JSON.stringify({
            "uris": [uriClicked]
        });


        fetchMaster('PUT', `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, body) //change song
        .catch((err) => {
            console.log(err);
            throw new Error(err);
        })
    }

    const handlePlayPause = useCallback(() => {
        if(musicControls.current) {
            if(currentTrack === "") {
                fetchMaster('PUT', `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`) //resume song
                .then(() => {
                    musicControls.current.innerHTML = "play_circle";
                })
                .catch((err) => {
                    console.log(err);
                    throw new Error(err);
                }); //resume song
            }
            else {
                fetchMaster('PUT', `https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`) //pause song
                .then(() => {
                    musicControls.current.innerHTML = "pause_circle";
                })
                .catch((err) => {
                    console.log(err);
                    throw new Error(err);
                }); //pauses the song
            }
        }
    },[currentTrack, deviceID, musicControls])

    const openInfoBox = () => {
        d3.select("#information-box")
                .classed("w-0", false)
                .classed("sm-max:w-full md-min:w-96", true)

        updateInfoBoxStates(true)
    }

    const closeInfoBox = () => {
        d3.select("#information-box")
                .classed("sm-max:w-full md-min:w-96", false)
                .classed("w-0", true);

        updateInfoBoxStates(false)
    }

    const handleCloseInfoBox = (e) => {
        if(infoBoxStatus) { //currently opened
            closeInfoBox();
        }
        else { //currently closed
            openInfoBox();
        }
    }

    useEffect(() => {
        fetchMaster('GET', 'https://api.spotify.com/v1/me/player/devices') //get currently available devices
        .then((response) => {
            if(response.devices.length > 0) { //a devices is found
                let { id } = response.devices[0];
                return { id }
            }
            else { // no device found so throw an error
                throw new Error("No devices available");
            }
        })
        .then((response) => {
            let { id } = response;

            updateDeviceID(id);
        })
        .catch((err) => {
            console.log(err);
            return;
        });
    },[updateDeviceID, accessToken]);

    useEffect(() => { //pulls currently playing song every 2 seconds or when a song is changed
        const getCurrentlyPlayingSong = () => {
            fetchMaster('GET','https://api.spotify.com/v1/me/player/currently-playing') //get the currently playing song
            .then((response) => {
                if(!response) return;
                let trackName = response && response.item ? response.item.name : "";
                let artistName = response && response.item && response.item.artists ? response.item.artists[0].name : "";

                response.is_playing ? updateCurrentTrack(trackName + " - " + artistName) : updateCurrentTrack(""); //updates the current track playing or sets it to no song playing

                if(response.is_playing) { //takes care of the player controller if it is already playing some music
                    if(musicControls.current) musicControls.current.innerHTML = "pause_circle";
                }
                else {
                    if(musicControls.current) musicControls.current.innerHTML = "play_circle";
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            });
        }

        let intervalPlayingSong = setInterval(() => {
            getCurrentlyPlayingSong(accessToken);
        }, 1000);

        return (() => { //unmount the interval so we don't get dupe calls
            clearInterval(intervalPlayingSong);
        })
    },[accessToken, handlePlayPause]);

    useEffect(() => {
        if(arrRelatedArtists) {
            //console.log(arrRelatedArtists);

            // create the links between nodes
            const createLinks = () => {
                let links = [];

                for(let i = 0; i < arrRelatedArtists.length; i++) {
                    let currRelatedArtist = arrRelatedArtists[i]; // the current artist out of the 50

                    if(currRelatedArtist.parentId) {
                        let parentRelations = arrRelatedArtists.filter((d) => d.id === currRelatedArtist.parentId); // finds the artist that matches the current parent id so that we can form the relation from curent artist to parent

                        for(let k = 0; k < parentRelations.length; k++) {
                            let currParentRelation = parentRelations[k];

                            links = [...links, {source: currParentRelation.currentIndex, target: currRelatedArtist.currentIndex}]
                        }

                    }
                }

                return links;
            }

            let links = createLinks(); // creates the links between nodes

            updateLinksList(links);
        }

    },[arrRelatedArtists]);

    useEffect(() => {
        if(linksList && arrRelatedArtists) {
            let hoveredID;

            const ticked = () => {
                updateLinks();
                updateNodes();
            }

            const updateNodes = () => {
                d3.select('.nodes')
                    .selectAll('circle')
                    .data(arrRelatedArtists)
                    .join("circle")
                    .attr("cx", (d, i) => {
                        return d.x;
                    })
                    .attr("cy", (d, i) => {
                        return d.y;
                    })
                    .attr("r", circleRadius)
                    .style("fill", (d, i) => { //goes through each item in arrRelatedArtists and assigns it the image based on it's currentIndex
                        return "url(#images" + d.currentIndex + ")";
                    })
                    .classed("stroke-lime-600", (e) => {
                        return e.id === hoveredID; //if element we are iterating over has same ID as hovered element then give it the class of lime 600
                    })
                    .on('mouseover', (e, d) => {
                        hoveredID = d.id; //sets the id once we hover over
                        updateNodes();
                    })
                    .on('mouseout', () => {
                        hoveredID = undefined; //unsets the id
                        updateNodes();
                    })
                    .on('click', (e, d) => {
                        updateSelectedNode(d);
                        openInfoBox();
                    })

            }
        
            const updateLinks = () => {
                d3.select('.links')
                .selectAll('line')
                .data(linksList)
                .join('line')
                .attr('x1', function(d) {
                    return d.source.x
                })
                .attr('y1', function(d) {
                    return d.source.y
                })
                .attr('x2', function(d) {
                    return d.target.x
                })
                .attr('y2', function(d) {
                    return d.target.y
                })
                .attr("stroke", "white");
            }

            let SVGSelector = d3.select('#main-svg');
            let widthSVG = parseInt(SVGSelector.style('width'));
            let heightSVG = parseInt(SVGSelector.style('height'));

            d3.forceSimulation(arrRelatedArtists)
            .force('charge', d3.forceManyBody().strength(-1000)) //repel from each other by 100
            .force('center', d3.forceCenter(widthSVG / 2, heightSVG / 2)) // center all circles in the middle
            .force('collision', d3.forceCollide().radius(function(d) { // make sure there are no colliding circles
                return d.radius;
            }))
            .force('link', d3.forceLink().links(linksList)) // show the links
            .on('tick', ticked);

            //handles zoom
            if(svgElement.current) {
                let zoom = d3.zoom()
                    .on('zoom', handleZoom)
    
                d3.select(svgElement.current).call(zoom);
            }

        }
    }, [linksList, arrRelatedArtists])

    return (
        <>
            {(arrRelatedArtists && linksList) ?  // if we actually have an artist that we found then we create a circle with the artist's img
                (
                    <div className="w-full h-full relative">
                        <svg className="border border-lime-600 h-full w-full" id="main-svg" ref={svgElement}>
                            <defs id="circle-images">
                                {
                                    arrRelatedArtists.map((e, i) => {
                                        return <GraphImages element={e} circleRadius={circleRadius} url={e.data.images[0].url} key={i} />
                                    })
                                }
                            </defs>

                            <g className="links"></g>
                            <g className="nodes"></g>
                        </svg>

                        <span className="material-symbols-outlined absolute sm-max:top-2 sm-max:right-2 md-min:right-8 md-min:top-4 z-20 cursor-pointer" onClick={handleCloseInfoBox}>{infoBoxStatus ? "close" : "keyboard_double_arrow_left"}</span>
                        <div className="absolute z-10 top-0 right-0 w-0 h-full bg-black border border-lime-600 transition-all duration-500 overflow-hidden" id="information-box"> { /* This is the box for the pop up box */ }
                            <div className="w-full h-full flex flex-col justify-between overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div className="w-full h-full py-8 px-4 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <header className="font-bold text-5xl">
                                        {selectedNode && selectedNode.data ? selectedNode.data.name : "Title"}
                                    </header>
                                    <figure className="w-full flex flex-col">
                                        <a href={selectedNode && selectedNode.data ? selectedNode.data.external_urls.spotify : ""} target="_blank" rel="noreferrer" className="self-start">
                                            <img src={selectedNode && selectedNode.data ? selectedNode.data.images[0].url : "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} className="sm-max:max-h-48 border border-lime-600" alt="logo of singer or band" />
                                        </a>
                                        <figcaption className="text-md italic">
                                            {selectedNode && selectedNode.data ? selectedNode.data.genres.map((item) => capitalizeFirstLetter(item)).join(", ") : "" }
                                        </figcaption>
                                    </figure>
                                    <aside className="w-full my-6">
                                        <div className="w-full text-3xl my-3">
                                            Top 3 tracks
                                        </div>
                                        <ul className="ml-5 list-disc text-xl">
                                            {
                                                selectedNode && selectedNode.topTracks.map((item, index) => {
                                                    return (
                                                        <li key={index} className="cursor-pointer hover:text-lime-600 transition duration-200"><button onClick={handleClickOnSongName} data_uri={item.uri} className="text-left">{item.song_name}</button></li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </aside>
                                </div>
                                <div className="py-4 px-1 border-t border-lime-600 flex align-middle sm-max:sticky">
                                    <span className="material-symbols-outlined cursor-pointer"><button onClick={handlePlayPause} ref={musicControls}>play_circle</button></span>
                                    <span className="truncate flex items-center w-full bg-black z-30">
                                        <span className="animate-marquee w-full">{currentTrack === "" ? "No song playing" : currentTrack}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                (
                    firstTimeLoaded ? (
                        <div className="w-full h-full flex justify-center items-center font-rounded sm-max:text-lg md-min:text-4xl">Begin by using the search bar at the top to find an artist</div>
                    )
                    : (
                        <div className="w-full h-full flex justify-center items-center font-rounded sm-max:text-lg md-min:text-2xl flex-col">
                            <div className="border-4 rounded-full w-8 h-8 border-t-lime-600 transition animate-spin"></div>
                            <div className="animate-pulse">GENERATING...</div>
                        </div>
                    )
                )
            }
        </>
    );
}

export default Main;