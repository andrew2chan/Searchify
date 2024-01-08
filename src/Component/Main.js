import * as d3 from "d3";
import { useSelector } from 'react-redux';
import {useState, useEffect, useRef} from 'react'

const Main = (props) => {
    const artistInfoRedux = useSelector((state) => state.spotifySearchSlice.returnedInfo);
    const [artistInfo, updateArtistInfo] = useState();
    const svgElement = useRef();
    const [listArtists, updateListArtists] = useState([]);
    const [listOfRelated, updateListOfRelated] = useState();

    useEffect(() => {
        if(svgElement.current) {
            //d3.select(svgElement.current).call(d3.zoom().on("zoom", () => {}));
            let zoom = d3.zoom()
                .on('zoom', handleZoom)

            d3.select(svgElement.current).call(zoom);
        }
    }, [artistInfo]);

    useEffect(() => {
        updateArtistInfo(artistInfoRedux); // pulls the artist info from the redux store to use locally
    }, [artistInfoRedux])

    const handleZoom = (e) => {
        d3.selectAll("g")
            .attr("transform", e.transform); //attr transform takes 
    }

    useEffect(() => {
        if(props.relatedArtistInfo) {
            console.log(props.relatedArtistInfo)
        }

    },[props.relatedArtistInfo]);

    return (
        <>
            {artistInfo !== undefined && JSON.stringify(artistInfo) !== '{}' && // if we actually have an artist that we found then we create a circle with the artist's img
                <svg className="border border-lime-600 w-full h-full" id="main-svg" ref={svgElement}>
                    <defs id="circle-images">
                        <pattern id="images" x="0" y="0" width="1" height="1">
                            <image x="0" y="0" width="300" height="300" xlinkHref={artistInfo.artists.items[0].images[0].url} />
                        </pattern>
                    </defs>

                    <g>
                        <circle
                            cx="50%"
                            cy="50%"
                            r="150"
                            stroke="white"
                            fill="url(#images)"
                        />
                    </g>
                </svg>
            }
        </>
    );
}

export default Main;