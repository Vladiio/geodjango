// GRAPHQL

const query = `
  query items($longitude: Float!, $latitude: Float!) {
    closestItems(userLocation: [$longitude, $latitude]) {
      id
      name
      location
    }
  }
`;

const apiUrl = '/graphql';

// GOOGLE MAPS API
const googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places';
const mapsKey = 'AIzaSyDlGRR2kb-wJ8UtdxPKciweRfl-xscVxts';


export {
  googleMapsUrl,
  apiUrl,
  query,
  mapsKey
};
