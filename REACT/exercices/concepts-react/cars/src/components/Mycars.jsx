import React from 'react';
import { Car } from './Car';
import Header from './Header';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        color: 'black',
      }, 
      {
        brand: 'BMW',
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        color: 'grey',
      },
    ],
  }

  render() {
    const { title, colorTitle } = this.props;

    return (
      <div>
        <Header title={title} colorTitle={colorTitle} />
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>{car.brand}</Car>
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;