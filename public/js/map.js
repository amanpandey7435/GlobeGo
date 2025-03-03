
mapboxgl.accessToken =mapToken ;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://style/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12, // starting zoom
});


// Create a default Marker and add it to the map.

// const [lng, lat] = coordinates; 

// map.on('load', () => {
//     console.log("Map has loaded"); // Debugging

//     // Add marker after map has fully loaded
//     new mapboxgl.Marker()
//         .setLngLat([lng, lat])
//         .addTo(map);

//     // Optionally, set center again
//     map.setCenter([lng, lat]);
// });
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates) //listing ka coordinates 
.addTo(map);
const popup = new mapboxgl.Popup({offset:25})
    .setLngLat(listing.geometry.coordinates)
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking!<p>`)

    .addTo(map);