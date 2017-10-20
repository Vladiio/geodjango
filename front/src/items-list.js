import React from 'react';


function ItemRow(props) {
  const lat = props.location[0];
  const lng = props.location[1];

  return (
    <tr>
      <td>{props.name}</td>
      <td>{lat}</td>
      <td>{lng}</td>
      <td>Unknown{/* TODO */}</td>
    </tr>
  );
}


function ItemsTable(props) {
  const items = props.items.map((item) => (
    <ItemRow key={item.id} name={item.name} location={item.location}/>
  ));
  return (
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Latitude</td>
          <td>Longitude</td>
          <td>Distance</td>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </table>

  );
}


export default ItemsTable;
