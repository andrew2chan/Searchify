function RelatedArtistsNode(id, parentId, data, level, currentIndex) {
    this.id = id;
    this.parentId = parentId;
    this.level = level;
    this.currentIndex = currentIndex;
    this.data = data;
    this.topTracks = [];
}

export { RelatedArtistsNode }