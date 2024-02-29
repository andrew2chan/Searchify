const GraphImages = (props) => {
    let { element, circleRadius, url } = props;

    return (
        <pattern id={`images${element.currentIndex}`} x="0" y="0" width="1" height="1">
            <image x="0" y="0" width={`${circleRadius * 2}`} height={`${circleRadius * 2}`} href={url} />
        </pattern>
    )
}

export default GraphImages;