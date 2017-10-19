import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import LocationForm from './location-form.js';
import {query} from './graphql-data';
import {costructGraphqlRequest} from './utils.js';
import './index.css';




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

	updateItems(data) {
		console.log(data)
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
