import React from 'react';
import { Car } from './Car';
import Welcome from './Welcome';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        year: 2025,
        color: 'black',
      }, 
      {
        brand: 'BMW',
        year: 2024,
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        year: 2022,
        color: 'grey',
      },
    ],
  }

  getAge = (year) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age > 1) {
      return `${age} ans.`;
    }
    if (age === 1) {
      return `${age} an.`;
    }
    return '';
  }

  addTenYears = () => {
    const updateState = this.state.cars.map(car => {
      return car.year -= 10;
    });
    this.setState({ updateState });
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>Ajouter 10 ans</button>
        <div className='flex justify-center items-center gap-20'>
          {this.state.cars.map(({brand, year, color}, index) => (
            <Car key={index} brand={brand} ageString={this.getAge(year)} color={color} />
          ))}
        </div>
        <Welcome />
      </div>
    );
  }
}

export default Mycars;