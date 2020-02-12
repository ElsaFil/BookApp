mapboxgl.accessToken =
  "pk.eyJ1IjoiZWxzYS1maWwiLCJhIjoiY2s2Z2tycDZxMTFocjNlbnY5N3NhNGJ0ZCJ9.PPsz6gEMZD6k2sdY0raCXg";

// create map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [13.404012, 52.520156],
  zoom: 12,
  maxBounds: [
    [13.2, 52.4],
    [13.6, 52.65]
  ]
});

// add zoom and current location controls on top right of the map
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");
const geolocate = new mapboxgl.GeolocateControl({
  showUserLocation: false,
  trackUserLocation: true
});
map.addControl(geolocate, "top-right");
