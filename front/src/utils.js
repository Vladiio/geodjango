import $ from 'jquery';


function fetchItems() {
  let data = {
    "query": " { closestItems(userLocation: [1.2, 1.2]) { id name }} "
  }

  $.post({
    url: "/graphql",
    data: JSON.stringify(data),
    contentType: 'application/json'
  })
    .done(response => {
      console.log(response);
    })
    .fail(response => {
      console.log('failed with status: ' + response.status);
      console.log(response.responseText);
    });
}



function getCSRF() {
  let CSRFValue = null;

  if (document.cookie && document.cookie !== '') {
    let cookiesList = document.cookie.split('; ');

    for (let value of cookiesList) {
      if (value.startsWith('csrftoken')) {
        console.log(value);
        CSRFValue = value.split('=')[1];
        break;
      }
    }
  }

  return CSRFValue;
}

function fetchItemsList() {
  const CSRFValue = getCSRF();
  if (!CSRFValue) {
    throw TypeError('Something went wrong with CSRF token');
  }

  const options = {
    method: "POST",
    headers: {
      "X-CSRFToken": CSRFValue,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }

	fetch('/graphql', options).then((response) => {
		console.log(response.data);
	});
}

export {fetchItemsList, fetchItems};
