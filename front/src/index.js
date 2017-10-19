import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker} from 'react-google-maps';
import {compose, withProps} from 'recompose';

import LoginForm from './location-form.js';
import {costructGraphqlRequest} from './utils.js';
import {
	query,
	googleMapsUrl,
	mapsKey,
	defaultCoords
} from './misc.js';
import './index.css';


const ItemMap = compose(
	withProps({
		googleMapURL: googleMapsUrl,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />
	}),
	withScriptjs,
	withGoogleMap
)((props) => {
	const lat = props.user.isLoggedIn ? props.user.location[0] : defaultCoords[0];
	const lng = props.user.isLoggedIn ? props.user.location[1] : defaultCoords[1];

	return (
		<GoogleMap
			bootstrapURLKeys={{key: mapsKey}}
			center={{lat: lat, lng: lng}}
			defaultZoom={6}>

			{props.user.isLoggedIn && <Marker position={{lat: lat, lng: lng}}/>}
		</GoogleMap>
	)
});


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: [],
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
	}

	handleFormSubmittion() {
		this.setState(prevState => {
			const newState = Object.assign({}, prevState);
			newState.user.username = '';
			newState.user.password = '';
			return newState;
		});

		const variables = {
				username: this.state.user.username,
				password: this.state.user.password
		};
		const request = costructGraphqlRequest(query, variables);

		fetch(request).then(
			response => response.json()).then(
				(data) => {this.handleFetchUser(data)}).catch(e => console.log(e));
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

	handleFetchUser(data) {
		console.log(data);
		const defaultUser = {};
		const defaultState = {};

		if (data.data && data.data.user) {
			defaultUser.isLoggedIn = true;
			defaultUser.location = data.data.user.location;
		} else {
			defaultState.isInvalidCredentials = true;
		}

		this.setState(prevState => {
			const newUser = Object.assign({}, prevState.user, defaultUser)
			const newState = Object.assign({}, prevState, defaultState);
			newState.user = newUser;
			console.log(newState);
			return newState;
		});
	}

	render() {
		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						<LoginForm
							isInvalidCredentials={this.state.isInvalidCredentials}
							onSubmit={this.handleFormSubmittion}
							onChange={this.handleInputChange}
							username={this.state.user.username}
							password={this.state.user.password}
							isLoggedIn={this.state.user.isLoggedIn}/>
						<ItemMap
							user={this.state.user}/>
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
