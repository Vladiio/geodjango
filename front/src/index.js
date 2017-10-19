import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import './index.css';
import LocationForm from './location-form.js'
import {query, entryUrl} from './graphql-data.js';


function Item(props) {
	return (
			<li>{props.name}</li>
	);
}

function List(props){
	const itemList = props.items.map((item) => (
			<Item key={item.id} name={item.name} />
	));
	return (
		<ul>
			{itemList}
		</ul>

	)
}


function ItemsContainer(props) {

	if (!props.items.length) {
		return null;
	}

	return (
		<Row>
			<Column large={6} centerOnLarge>
				<h3>Items located in radius 5 km:</h3>
				<List items={props.items} />
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

	handleFormSubmittion(longitude, latitude) {
		const variables = {
			longitude: parseFloat(longitude),
			latitude: parseFloat(latitude)
		};

		let options = {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({query, variables})
		};

		let request = new Request('/graphql', options)

		fetch(request).then(
			response => response.json()).then(
				data => {console.log(data)}).catch(e => {console.log(e)});
	}

	render() {
		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						<ItemsContainer items={this.state.items}/>
						<LocationForm onSubmit={this.handleFormSubmittion}/>
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
