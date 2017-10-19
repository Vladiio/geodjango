import React from 'react';

import {Column} from 'react-foundation';


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
    const longitude = this.state.longitude;
    const latitude = this.state.latitude;

    event.preventDefault();

    this.props.onSubmit(longitude, latitude);
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
					onClick={this.handleSubmit}
					value="Find items"/>

			</form>
		);
	}
}


export default LocationForm;
