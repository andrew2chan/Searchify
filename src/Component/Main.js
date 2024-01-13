import * as d3 from "d3";
import { useSelector } from 'react-redux';
import {useState, useEffect, useRef} from 'react'

const Main = (props) => {
    const artistInfoRedux = useSelector((state) => state.spotifySearchSlice.returnedInfo);
    const [artistInfo, updateArtistInfo] = useState();
    const [linksList, updateLinksList] = useState();
    const svgElement = useRef();
    const { relatedArtistInfo: arrRelatedArtists } = props;
    const circleRadius = 5;

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
                    .style("fill", "url(\"#images\"");
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
            .force('charge', d3.forceManyBody().strength(-100)) //repel from each other by 100
            .force('center', d3.forceCenter(widthSVG / 2, heightSVG / 2)) // center all circles in the middle
            .force('collision', d3.forceCollide().radius(function(d) { // make sure there are no colliding circles
                return d.radius;
            }))
            .force('link', d3.forceLink().links(linksList)) // show the links
            .on('tick', ticked)
        }
    }, [linksList, arrRelatedArtists])

    return (
        <>
            {artistInfo !== undefined && JSON.stringify(artistInfo) !== '{}' && // if we actually have an artist that we found then we create a circle with the artist's img
                <svg className="border border-lime-600 w-full h-full" id="main-svg" ref={svgElement}>
                    <defs id="circle-images">
                        <pattern id="images" x="0" y="0" width="1" height="1">
                            <image x="0" y="0" width={`${circleRadius * 2}`} height={`${circleRadius * 2}`} xlinkHref={artistInfo.artists.items[0].images[0].url} />
                        </pattern>
                    </defs>

                    <g className="links"></g>
                    <g className="nodes"></g>
                </svg>
            }
        </>
    );
}

export default Main;