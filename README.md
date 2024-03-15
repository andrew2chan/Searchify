### Summary
This is an app that lets connects to your spotify API account and lets you search for an artist and returns a tree of related artists. You can click the icons and it will show their top 3 songs and you can click on those songs to play them.
*Spotify Premium required
**Spotify API has a bit of an issue if spotify isn't already playing so please start playing a song off the app itself before clicking on a top 3 song in the web app

## Available Scripts

In the project directory, you can run:

### `npm run start`

### `npm run build`

### Workboard
https://trello.com/b/5v8ul2T5/spotify-artist-recommendation

### Link
https://searchify-phi.vercel.app/

### Biggest takeaways
- TailwindCSS is a mobile first css framework and is meant to be built mobile first (Will keep this in mind for future projects)
- Getting familiar with the Spotify API and different authorization flows
- Getting familiar with d3.js and the usage of selectors, data driven graphics, joins, etc.
- Used a few things I didn't before useRef (persisting state between rerenders as well as keeping references on an element) and useCallback (caching functions unless the dependency changes)