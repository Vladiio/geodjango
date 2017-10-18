import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column, Button} from 'react-foundation';

import './index.css';
import {fetchItemsList, fetchItems} from './utils.js';


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

class LocationForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			longitude: '',
			latitude: ''
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		alert(this.state.longitude, this.state.latitude);
		event.preventDefault();
	}

	handleInputChange(event) {
		const currentValue = event.target.value;
		const name = event.target.name;

		this.setState({
			[name]: currentValue
		});

	}

	render() {

		return (
			<form onSubmit={this.handleSubmit}>
				<Column large={4} centerOnLarge>

					<label>Please enter your location data
						<input onChange={this.handleInputChange}
							value={this.state.latitude}
							type="number"
							name="latitude"
							placeholder="Latitude "/>
					</label>

					<input onChange={this.handleInputChange}
						value={this.state.longitude}
						type="number"
						name="longitude"
						placeholder="Longitude"/>
				</Column>

				<input type="submit"
					className="button"
					onClick={fetchItems}
					value="Find items"/>

			</form>
		);
	}
}


function ItemsList(props){
	return (
		<Row>
			<Column large={6} centerOnLarge>
				<h3>Items located in radius 5 km:</h3>
				<List items={items} />
			</Column>
		</Row>
	);
}


class App extends React.Component {

	render() {
		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						<ItemsList items={items}/>
						<LocationForm />
					</div>
				</Column>
			</Row>
		);
	}
}


const items = [
	{name: 'potato', id: 1},
	{name: 'pizza', id: 2},
	{name: 'chicken', id: 3},
	{name: 'big-mack', id: 4},
]

ReactDOM.render(
	<App />,
	document.getElementById('root')
)
