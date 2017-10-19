
const query = `
  query items($longitude: Float!, $latitude: Float!) {
    closestItems(userLocation: [$longitude, $latitude]) {
      id
      name
      location
    }
  }
`;

const entryUrl = '/graphql';

export {entryUrl, query};
