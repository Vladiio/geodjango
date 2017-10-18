import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Column, Button} from 'react-foundation';

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


function ItemsList(props){
	return (
		<Row>
			<Column large={5} centerOnLarge>
				<h3>Items List</h3>
				<List items={items} />
				<Button>Submit</Button>
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
