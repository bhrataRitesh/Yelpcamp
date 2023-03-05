

// mapboxgl.accessToken = 'pk.eyJ1Ijoicml0ZXNoMTYiLCJhIjoiY2xldTU0Z2VmMDFqaDNzcGt6dmV6eGNidCJ9.UfyMAreOoeXzwC5COd9CIA';
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
    new mapboxgl.Popup({
        offset: 25
    })
            .setHTML(
        `<h2>${campground.title}</h2><p>${campground.location}</p>`)
    
    )
    .addTo(map)
