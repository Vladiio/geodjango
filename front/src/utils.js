import {apiUrl} from './misc.js';


function costructGraphqlRequest(query, variables) {

  let options = {
    method: 'post',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables})
  };

  return new Request(apiUrl, options)

}


export default costructGraphqlRequest;
