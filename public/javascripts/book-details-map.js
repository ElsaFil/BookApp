mapboxgl.accessToken =
  "pk.eyJ1IjoiZWxzYS1maWwiLCJhIjoiY2s2Z2tycDZxMTFocjNlbnY5N3NhNGJ0ZCJ9.PPsz6gEMZD6k2sdY0raCXg";

// get book info
// const bookId = location.pathname.split("/")[2];
// axios
//   .get(`http://localhost:3000/${bookId}/owners`)
//   .then(response => {
//     // TODO
//     // let owner = ...;
//     // let adress = ...;
//     // draw map in here
//   })
//   .catch(err => {
//     console.log(err);
//   });

// add pins/markers
let address = "Prenzlauer Allee, 212";
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
mapboxClient.geocoding
  .forwardGeocode({
    query: address,
    autocomplete: false,
    limit: 1
  })
  .send()
  .then(function(response) {
    if (
      response &&
      response.body &&
      response.body.features &&
      response.body.features.length
    ) {
      var feature = response.body.features[0];

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

      // create the popup
      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>Owner: blablabla </strong> <br> Address: ${address}`
      );

      // // create DOM element for the marker
      // var el = document.createElement("div");
      // el.id = "marker";
      new mapboxgl.Marker()
        .setLngLat(feature.center)
        .setPopup(popup)
        .addTo(map);

      // add zoom and current location controls on top right of the map
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");
      const geolocate = new mapboxgl.GeolocateControl({
        showUserLocation: false,
        trackUserLocation: true
      });
      map.addControl(geolocate, "top-right");
      let test = true;
    }
  });
