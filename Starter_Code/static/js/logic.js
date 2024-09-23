// Create a tile layer that will be the background of our map
console.log("Step 1 Working");

// Create the tile layer that will be the background of our map
let basemap = L.tileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
	{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map object with options
  let map = L.map("map", {
	center: [
		40.7, -94.5
	],
	zoom: 3
  });

  // Then add base map tile layer to map
  basemap.addTo(map);

  // Make an AJAX call that retreievs our earthquake GeoJSON data on the map
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data){
	// This function returns style data for each of the earthquakes we plot on the map
	function styleInfo(feature) {
	  return {
		opacity: 1,
		fillOpacity: 1,
		fillColor: getColor(feature.geometry.coordinates[2]),
		color: "#000000",
		radius: getRadius(feature.properties.mag),
		stroke: true,
		weight: 0.5
	  };
	}
	// This function determines the color of the marker based on the magnitude of the earthquake
	function getColor(depth){
	  switch (true) {
		case depth > 90:
		  return "#ea2c2c";
		case depth > 70:
		  return "#ea822c";
		case depth > 50:
		  return "#ee9c00";
		case depth > 30:
		  return "#eecc00";
		case depth > 10:
		  return "#d4ee00";
		default: 
		  return "#98ee00";
	  }
	}

	// This function determines the radius of the earthquake marker based on its magnitude
	function getRadius(magnitude) {
	  if (magnitude === 0) {
		return 1;
	  }

	  return magnitude * 4;
	}

	// Add a GeoJSON layer to the map once the file is loaded
	L.geoJson(data, {
		// Turn each feature into a circleMarker on the map
		pointToLayer: function (feature, latlng) {
		  return L.circleMarker(latlng);
		},
		// Set the style for each circleMarker using our styleInfo function.
		style: styleInfo,
		// Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
		onEachFeature: function (feature, layer) {
		  layer.bindPopup(
			"Magnitude: "
			+ feature.properties.mag
			+ "<br>Depth: "
			+ feature.geometry.coordinates[2]
			+ "<br>Location: "
			+ feature.properties.place
		  );
		}
	  }).addTo(map);
 

// Following code from chatGPT to help with map legend.
	  // Create a legend control
let legend = L.control({ position: 'bottomright' });

// When the layer control is added, insert a div with the class of 'legend'
legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend');
  const depths = [0, 10, 30, 50, 70, 90];
  const colors = [
	"#98ee00", 
	"#d4ee00", 
	"#eecc00", 
	"#ee9c00", 
	"#ea822c", 
	"#ea2c2c"
  ];

  // Loop through the depth intervals and generate a label with a colored square for each interval
  for (let i = 0; i < depths.length; i++) {
	div.innerHTML += 
	  '<i style="background:' + colors[i] + '"></i> ' +
	  depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(map);
});