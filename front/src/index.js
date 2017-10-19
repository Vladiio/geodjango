import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

import LocationForm from './location-form.js';
import {costructGraphqlRequest} from './utils.js';
import {
	query,
	googleMapsUrl,
	mapsKey
} from './misc.js';
import './index.css';


const ItemMap = withScriptjs(withGoogleMap((props) =>
	<GoogleMap
		bootstrapURLKeys={{key: mapsKey}}
		defaultCenter={{lat: 1.2, lng: 1.2}}
		defaultZoom={11}/>
));



function ItemRow(props) {
	return (
		<tr>
			<td>{props.name}</td>
			<td>{props.longitude}</td>
			<td>{props.latitude}</td>
			<td>Unknown{/* TODO */}</td>
		</tr>
	);
}

function ItemsBody(props){
	const itemList = props.items.map((item) => (
			<ItemRow key={item.id}
				name={item.name}
			 	longitude={item.location[0]}
				latitude={item.location[1]}/>
	));
	return (
		<tbody>
			{itemList}
		</tbody>

	)
}


function ItemsTable(props) {

	if (!props.items.length) {
		return null;
	}

	return (
		<Row>
			<Column large={7} centerOnLarge>
				<h3>Items located in radius 5 km:</h3>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Longitude</th>
							<th>Latitude</th>
							<th>Distance</th>
						</tr>
					</thead>
					<ItemsBody items={props.items} />
				</table>

			</Column>
		</Row>
	);
}


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: []
		};

		this.handleFormSubmittion = this.handleFormSubmittion.bind(this);
	}

	updateItems(data) {
		this.setState({
			items: data.closestItems
		});
	}

	handleFormSubmittion(longitude, latitude) {
		const data = {
			longitude: parseFloat(longitude),
			latitude: parseFloat(latitude)
		}
		const request = costructGraphqlRequest(query, data);

		fetch(request).then(
			response => response.json()).then(
				data => {this.updateItems(data.data)}).catch(e => {console.log(e)});
	}

	render() {
		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						<LocationForm onSubmit={this.handleFormSubmittion}/>
						<ItemsTable items={this.state.items}/>
						<ItemMap
							googleMapURL={googleMapsUrl}
							loadingElement={<div style={{ height: `100%` }} />}
							containerElement={<div style={{ height: `400px` }} />}
							mapElement={<div style={{ height: `100%` }} />}/>
					</div>
				</Column>
			</Row>
		);
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('root')
)
