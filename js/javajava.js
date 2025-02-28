// Initialize the map 
var map = L.map('map').setView([51.505, -0.09], 5);

// Add the tile layer 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Fetch and display the GeoJSON data
// I used ChatGPT to help with getting the pop ups to work
fetch('data/Capitals.geojson')
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        // Generate Voronoi polygons using Turf.js
        var vorP = turf.voronoi(data);

        // Add the Voronoi polygons to the map with transparency
        L.geoJSON(vorP, {
            style: function (feature) {
                return {
                    color: '#3388ff', // Border color (blue)
                    weight: 2, // Border weight
                    opacity: 0, // Border transparency (0 is fully transparent, 1 is fully opaque)
                    fillColor: '#3388ff', // Fill color (blue)
                    fillOpacity: 0 // Fill transparency (0 is fully transparent, 1 is fully opaque)
                };
            },
            onEachFeature: function (feature, layer) {
                // Check if the feature has the "LS_NAME" and "SOV0NAME" properties
                if (feature.properties) {
                    var capitalName = feature.properties.LS_NAME || "Unknown Capital";
                    var countryName = feature.properties.SOV0NAME || "Unknown Country";

                    // Corrected popup binding
                    layer.bindPopup('<b> Closest Capital: ' + capitalName + ', ' + countryName + '</b>');
                }
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading the GeoJSON file:', error);
        alert("There was an error loading the GeoJSON data.");
    });
