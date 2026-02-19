import { Component } from 'react'
import countHits from './countHits.jsx'

import { Randbetween } from '../utils/randbetween.js'

import GokuImage from '../assets/goku.jpg'

const hitGenerator = () => Randbetween(7, 17);

class Goku extends Component {
  render() {
    const { name, addOneHit, hocState, healthPoint, isMyTurn } = this.props;

    const healthStatus  = healthPoint > 0 
      ? (<td>{healthPoint} %</td>) 
      : (
          <td>
            <span className="badge badge-danger">
              K.O.
            </span>
          </td>
        );
        
    const canPlay = isMyTurn && healthPoint > 0;

    const button = canPlay
      ? (
          <button 
            className="btn btn-success m-3"
            onClick={addOneHit}
          >
            {name} hits
          </button>
        )
      : (
          <button 
            className="btn btn-danger m-3"
            disabled
          >
            {name} hits
          </button>
      );

    return (
      <div className="col">
        <h2>Goku</h2>
        <div  
          style={{ height: '300px' }} 
          className="d-flex justify-content-center align-items-end"
        >
          <img
            src={GokuImage}
            alt="Goku"
            width="200"
          />
        </div>
        <br />
        {button}

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Stikes</th>
              <th scope="col">Last Hit Delivered</th>
              <th scope="col">Health points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{hocState.hits}</td>
              <td>{hocState.lastHit}</td>
              {healthStatus}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const GokuWithHits = countHits(Goku, hitGenerator);

export default GokuWithHits;