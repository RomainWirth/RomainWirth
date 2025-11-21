import { Component } from 'react'

import vegetaImage from '../assets/vegeta-arc.jpg'

class Vegeta extends Component {
  state = {
    hits: 0
  }

  addHit = () => {
    this.setState((prevState) => {
      return { hits: prevState.hits + 1 }
    })
  }

  render() {
    return (
      <div className="col">
        <h2>Vegeta</h2>
        <img
          src={vegetaImage}
          alt="Vegeta"
          width="200"
        />
        <br />
        <button 
          className="btn success m-3"
          onClick={this.addHit}
        >
          Hit
        </button>

        <table className="table table-striped">
          <th>
            <tr>
              <th scope="col">Stikes</th>
            </tr>
          </th>
          <tbody>
            <tr>
              <td>{this.state.hits}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Vegeta