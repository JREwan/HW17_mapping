// Store our API endpoint inside queryUrl
var quakedata = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-05-01&endtime=2018-06-01&minmagnitude=3";
//var quakedata = "all_week.json"; 
console.log(quakedata);

// Perform a GET request to the query URL
//d3.json(queryUrl, function(error, data) {
  d3.json(quakedata, function(error, data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + " " + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoianJld2FuIiwiYSI6ImNqaDl2dWE0MTBoejIzNnF3ZDY5cXhweGYifQ.oWV3q70-NX0R-i3GSeI6Ig");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoianJld2FuIiwiYSI6ImNqaDl2dWE0MTBoejIzNnF3ZDY5cXhweGYifQ.oWV3q70-NX0R-i3GSeI6Ig");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
