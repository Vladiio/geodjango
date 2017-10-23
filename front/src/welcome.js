import React from 'react';
import {Column} from 'react-foundation';

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
			<h3>It's nice to see you, {props.user.username}.</h3>
			<p>Your coordinates now are: lat - {lat}, lng - {lng}.
				You can find here some items located in radius 5 km near you.
			</p>
			<LogoutButton onClick={props.handleLogoutClick}/>
		</Column>
	);
};


export default Welcome;
