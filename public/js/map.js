mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 7, // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) // Listing --> geometry --> coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<b><h5>${listing.location}</h5></b>
      <p>Exact location provided after booking!</p>`
    )
  )
  .addTo(map);
