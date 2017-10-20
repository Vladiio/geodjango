import React from 'react';
import ReactDOM from 'react-dom';

import {Row, Column} from 'react-foundation';

import ItemMap from './item-map.js';
import LoginForm from './login-form.js';
import costructGraphqlRequest from './utils.js';
import ItemsTable from './items-list.js';
import {query, mutation} from './misc.js';
import './index.css';


const LogoutButton = (props) => {
	return <a onClick={props.onClick}>Logout</a>
};

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
			<LogoutButton onClick={props.handleLogoutClick}/>
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
			isInvalidCredentials: false,
			isLoaded: false
		};

		this.handleFormSubmittion = this.handleFormSubmittion.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
		this.handleLogoutClick = this.handleLogoutClick.bind(this);
	}

	handleRightClick(event) {
		console.log(event.latLng.lat());
	}

	componentDidMount() {
		const vars = this.get_credentials()
		const request = costructGraphqlRequest(query, vars);
		fetch(request)
			.then(response => response.json()).
			then(data => {
				if (!data.errors) {
					this.login(data.data.user);
				} else {
					this.setAppStatus(true);
				}
			});
	}

	setAppStatus(status) {
		this.setState(prevState => {
			const newState = Object.assign({}, prevState);
			newState.isLoaded = status;
			return newState;
		})
	}

	login(user) {
		this.setState(prevState => {
			const newState = Object.assign({}, prevState);
			newState.user = user;
			newState.user.isLoggedIn = true;
			newState.isLoaded = true;

			return newState;
		});
	}

	handleLogoutClick(event) {
		const mutation = `
			mutation{
				logout{
					status
				}
			}`;
		const request = costructGraphqlRequest(mutation, {})

		fetch(request)
			.then(response => response.json())
			.then(data => {this.logout()})
			.catch(e => {console.log(e)});
	}

	logout() {
		this.setState(prevState => {
			const newState = Object.assign({}, prevState);
			newState.user.isLoggedIn = false;
			newState.user.username = '';
			newState.user.password = '';
			newState.isInvalidCredentials = false;

			return newState;
		});
	}

	get_credentials() {
		return {
			username: this.state.user.username,
			password: this.state.user.password
		};
	}

	loginFailed() {
		this.setState(prevState =>{
			const newState = Object.assign({}, prevState);
			newState.isInvalidCredentials = true;
			newState.user.login = '';
			newState.user.password = '';

			return newState
		});
	}

	handleFormSubmittion() {

		const variables = {
				username: this.state.user.username,
				password: this.state.user.password
		};
		const request = costructGraphqlRequest(mutation, variables);

		fetch(request)
			.then(response => response.json())
			.then(data => {
				if (data.errors) {
					this.loginFailed();
				} else {
					this.login(data.data.login.user);
				}
			}).catch(e => console.log(e));
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

	render() {
		const isLoggedIn = this.state.user.isLoggedIn;
		const isLoaded = this.state.isLoaded;

		return (
			<Row>
				<Column large={9} centerOnLarge>
					<div className="main-container">
						{isLoaded && <LoginForm
							isInvalidCredentials={this.state.isInvalidCredentials}
							onSubmit={this.handleFormSubmittion}
							onChange={this.handleInputChange}
							user={this.state.user}/>}
						<Welcome user={this.state.user}
							handleLogoutClick={this.handleLogoutClick}/>
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
