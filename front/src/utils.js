import {apiUrl} from './misc.js';


function costructGraphqlRequest(query, variables) {

  let options = {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables})
  };

  return new Request(apiUrl, options)

}


export {costructGraphqlRequest};
