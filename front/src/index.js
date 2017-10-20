import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import ItemMap from './item-map.js';
import LoginForm from './login-form.js';
import costructGraphqlRequest from './utils.js';
import ItemsTable from './items-list.js';
import {query} from './misc.js';
import './index.css';


const Welcome = (props) => {
	if (!props.user.isLoggedIn) {
		return null;
	}
	const lat = props.user.location[0];
	const lng = props.user.location[1];

	return (
		<Column large={9} centerOnLarge>
			<h3>It's nice to see you again, {props.user.username}.</h3>
			<p>Your coordinates now are: lat - {lat}, lng - {lng}
				(right click on the map will change them).
				You can find here some items located in radius 5 km near you.
			</p>
		</Column>
	);
}


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: {
				username: '',
				password: '',
				location: [],
				isLoggedIn: false,
			},
			isInvalidCredentials: false
		};

		this.handleFormSubmittion = this.handleFormSubmittion.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
	}

	handleRightClick(event) {
		console.log(event.latLng.lat());
	}

	handleFormSubmittion() {

		const variables = {
				username: this.state.user.username,
				password: this.state.user.password
		};
		const request = costructGraphqlRequest(query, variables);

		fetch(request).then(
			response => response.json()).then(
				(data) => {this.processUserData(data)}).catch(e => console.log(e));
	}

	handleInputChange(fieldName, newValue) {
		const user = {
			[fieldName]: newValue
		};

		this.setState(prevState => {
			// save previous user field e.g. password
			const newUser = Object.assign({}, prevState.user, user);
			const newState = Object.assign({}, prevState);
			newState.user = newUser;
			return newState;
		});
	}

	processUserData(data) {
		const defaultUser = {};
		const defaultState = {};

		if (data.data && data.data.user) {
			// success
			defaultUser.isLoggedIn = true;
			defaultUser.password = '';
			defaultUser.location = data.data.user.location;
			defaultUser.items = data.data.user.items;
		} else {
			// fail
			defaultState.isInvalidCredentials = true;
			defaultUser.username = '';
			defaultUser.password = '';
		}

		this.setState(prevState => {
			const newUser = Object.assign({}, prevState.user, defaultUser)
			const newState = Object.assign({}, prevState, defaultState);
			newState.user = newUser;
			return newState;
		});
	}

	render() {
		const isLoggedIn = this.state.user.isLoggedIn;

		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						<LoginForm
							isInvalidCredentials={this.state.isInvalidCredentials}
							onSubmit={this.handleFormSubmittion}
							onChange={this.handleInputChange}
							user={this.state.user}/>
						<Welcome user={this.state.user} />
						{isLoggedIn && <ItemsTable items={this.state.user.items}/>}
						{isLoggedIn && <ItemMap
							user={this.state.user}
							onRightClick={this.handleRightClick}/>}
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
