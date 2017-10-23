// GRAPHQL

const mutation = `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user{
        location
        username
        items{
          id
          name
          location
          distance
        }
      }
    }
  }
`;

const query = `
  query user{
    user{
      location,
      username,
      items{
        id
        name,
        location,
        distance
      }
    }
  }
`


const apiUrl = '/graphql';

// GOOGLE MAPS API
const googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places';
const mapsKey = 'AIzaSyDlGRR2kb-wJ8UtdxPKciweRfl-xscVxts';

const defaultCoords = [49.24, -123.11];

export {
  googleMapsUrl,
  apiUrl,
  mutation,
  query,
  mapsKey,
  defaultCoords
};
