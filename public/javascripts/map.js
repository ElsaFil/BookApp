mapboxgl.accessToken =
  "pk.eyJ1IjoiZWxzYS1maWwiLCJhIjoiY2s2Z2tycDZxMTFocjNlbnY5N3NhNGJ0ZCJ9.PPsz6gEMZD6k2sdY0raCXg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [13.404012, 52.520156],
  zoom: 12
});

// for marker popup
/**
    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat([-96, 37.8])
      .setHTML('<h1>Hello World!</h1>')
      .addTo(map);
      */

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // limit results to Germany
    countries: "de",

    // further limit results to the geographic bounds for Berlin
    bbox: [13.115448, 52.375902, 13.769121, 52.3364],

    // apply a client side filter to further limit results
    filter: function(item) {
      // returns true if item contains New South Wales region
      return item.context
        .map(function(i) {
          // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
          // this example attempts to find the `region` named `Berlin`
          return i.id.split(".").shift() === "region" && i.text === "Berlin";
        })
        .reduce(function(acc, cur) {
          return acc || cur;
        });
    },
    mapboxgl: mapboxgl
  })
);
