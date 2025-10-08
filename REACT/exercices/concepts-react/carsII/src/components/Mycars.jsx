import React from 'react';
import { Car } from './Car';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        year: 2010,
        color: 'black',
      }, 
      {
        brand: 'BMW',
        year: 2012,
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        year: 2020,
        color: 'grey',
      },
    ],
  }

  age = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  }

  addTenYears = () => {
    const updateState = this.state.cars.map(car => {
      return car.year -= 10;
    });
    this.setState({ updateState });
  }

  render() {
    const currentYear = new Date().getFullYear();

    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>Ajouter 10 ans</button>
        <div className='flex justify-center items-center gap-20'>
          {this.state.cars.map((car, index) => (
            <Car key={index} brand={car.brand} age={currentYear - car.year} color={car.color} />
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;