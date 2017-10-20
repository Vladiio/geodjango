import React from 'react';
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker} from 'react-google-maps';
import {compose, withProps} from 'recompose';

import {
  googleMapsUrl,
  mapsKey,
  defaultCoords
} from './misc.js';


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
	const items = props.user.items;

	let itemList = null;
	if (props.user.isLoggedIn) {
		itemList = items.map(item => (
			<Marker key={item.id} position={{lat: item.location[0], lng: item.location[1]}}/>
		));
	}
	return (
		<GoogleMap
			bootstrapURLKeys={{key: mapsKey}}
			center={{lat: lat, lng: lng}}
			defaultZoom={6}
			onRightClick={props.onRightClick}>

			{props.user.isLoggedIn && <Marker position={{lat: lat, lng: lng}}/>}
			{itemList}
		</GoogleMap>
	)
});

export default ItemMap;
