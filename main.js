import Map from 'https://cdn.skypack.dev/ol@6.5.0/Map.js';
import OSM from 'https://cdn.skypack.dev/ol@6.5.0/source/OSM.js';
import TileLayer from 'https://cdn.skypack.dev/ol@6.5.0/layer/Tile.js';
import View from 'https://cdn.skypack.dev/ol@6.5.0/View.js';
import Feature from 'https://cdn.skypack.dev/ol@6.5.0/Feature.js';
import Geolocation from 'https://cdn.skypack.dev/ol@6.5.0/Geolocation.js';
import Point from 'https://cdn.skypack.dev/ol@6.5.0/geom/Point.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'https://cdn.skypack.dev/ol@6.5.0/style.js';
import { Vector as VectorSource } from 'https://cdn.skypack.dev/ol@6.5.0/source.js';
import { Vector as VectorLayer } from 'https://cdn.skypack.dev/ol@6.5.0/layer.js';

// Create the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [107.6191, -6.9175], // Set to Bandung City
    zoom: 2,
  }),
});

// Geolocation setup
const geolocation = new Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});

// Create a feature to display the user's position
const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: '#ff0000', // Red color for the user's position marker
      }),
      stroke: new Stroke({
        color: '#fff', // White border for better visibility
        width: 2,
      }),
    }),
  })
);

// When the position changes, update the feature
geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  map.getView().setCenter(coordinates); // Optionally, center the map on the user's location
  map.getView().setZoom(15); // Optionally, set a zoom level
});

// When the accuracy changes, show the accuracy geometry (optional)
const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

// Add a vector layer for the position and accuracy
new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});

// Start tracking the geolocation
geolocation.setTracking(true);
