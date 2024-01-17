const GraphImages = (props) => {
    let { element, circleRadius } = props;

    return (
        <pattern id={`images${element.currentIndex}`} x="0" y="0" width="1" height="1">
            <image x="0" y="0" width={`${circleRadius * 2}`} height={`${circleRadius * 2}`} xlinkHref={element.data.images[0].url} />
        </pattern>
    )
}

export default GraphImages;