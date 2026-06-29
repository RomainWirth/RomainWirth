import { Component } from 'react'
import gokuImage from '../assets/goku.jpg'


class Goku extends Component {
  render () {
    const {hits, addOne, name} = this.props;
    
    return (
      <div className="col">
        <h2>{name}</h2>
        <div 
          style={{ height: '300px' }} 
          className="d-flex justify-content-center align-items-end"
        >
          <img
            src={gokuImage}
            alt="Goku"
            width="200"
          />
        </div>
        <br />
        <button onClick={addOne} className="btn btn-success">{name} Strikes</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Hits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{hits}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Goku;