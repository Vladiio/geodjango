import {entryUrl} from './graphql-data.js';


function costructGraphqlRequest(query, variables) {

  let options = {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables})
  };

  return new Request('/graphql', options)

}


export {costructGraphqlRequest};
