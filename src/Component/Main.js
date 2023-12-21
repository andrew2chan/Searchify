import * as d3 from "d3";
import { useSelector } from 'react-redux';
import {useState, useEffect} from 'react'

const Main = () => {
    const artistInfoRedux = useSelector((state) => state.spotifySearchSlice.returnedInfo);
    const [artistInfo, updateArtistInfo] = useState();

    useEffect(() => {
        updateArtistInfo(artistInfoRedux);
    }, [artistInfoRedux])

    return (
        <>
            {artistInfo !== undefined && JSON.stringify(artistInfo) !== '{}' &&
                <svg className="border border-lime-600 w-full h-full" id="main-svg">
                    <defs id="circle-images">
                        <pattern id="images" x="0" y="0" width="1" height="1">
                            <image x="0" y="0" width="300" height="300" xlinkHref={artistInfo.artists.items[0].images[0].url} />
                        </pattern>
                    </defs>

                    <circle
                        cx="50%"
                        cy="50%"
                        r="150"
                        stroke="white"
                        fill="url(#images)"
                    />
                </svg>
            }
        </>
    );
}

export default Main;