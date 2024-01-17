import * as d3 from "d3";
import GraphImages from "./GraphImages";
import {useState, useEffect, useRef} from 'react'

const Main = (props) => {
    const [linksList, updateLinksList] = useState();
    const svgElement = useRef();
    const { relatedArtistInfo: arrRelatedArtists } = props;
    const circleRadius = 20;

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
            .force('charge', d3.forceManyBody().strength(-500)) //repel from each other by 100
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
                    <svg className="border border-lime-600 w-full h-full" id="main-svg" ref={svgElement}>
                        <defs id="circle-images">
                            {
                                arrRelatedArtists.map((e, i) => {
                                    return <GraphImages element={e} circleRadius={circleRadius} key={i} />
                                })
                            }
                        </defs>

                        <g className="links"></g>
                        <g className="nodes"></g>
                    </svg>
                ) :
                (
                    <p>LOADING...</p>
                )
            }
        </>
    );
}

export default Main;