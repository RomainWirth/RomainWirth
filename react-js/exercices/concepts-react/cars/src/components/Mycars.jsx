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

  noCopy = () => {
    alert("Copier c'est voler !");
  }

  addStyle = (e) => {
    if (e.target.classList.contains('styled')) {
      e.target.classList.remove('styled');
      return;
    }
    e.target.classList.add('styled');
    return;
  }

  render() {
    const { title, colorTitle } = this.props;
    console.log(colorTitle);

    return (
      <div>
        <h1 onMouseOver={this.addStyle}>{title}</h1>
        {/* <Header title={title} colorTitle={colorTitle} /> */}
        <p onCopy={this.noCopy}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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