import React from 'react';

import {Column} from 'react-foundation';


class LoginForm extends React.Component {

	constructor(props) {
		super(props);

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
	}

	handleInputChange(event) {
		const currentValue = event.target.value;
		const fieldName = event.target.name;

		this.props.onChange(fieldName, currentValue);
	}

	render() {
		if (this.props.user.isLoggedIn) {
			return null;
		}
		const label = (this.props.isInvalidCredentials ?
									 <p style={{color: "red"}}>"Invalid credentials"</p> :
									 <p>Please enter your credentials</p>);
		return (
			<form onSubmit={this.handleSubmit}>
				<Column large={4} centerOnLarge>

					<label>{label}
						<input onChange={this.handleInputChange}
							value={this.props.user.username}
							type="text"
							name="username"
							placeholder="username"/>
					</label>

					<input onChange={this.handleInputChange}
						value={this.props.user.password}
						type="password"
						name="password"
						placeholder="password"/>

					<input type="submit"
						className="button expanded"
						onClick={this.handleSubmit}
						value="Sign in"/>

				</Column>


			</form>
		);
	}
}


export default LoginForm;
