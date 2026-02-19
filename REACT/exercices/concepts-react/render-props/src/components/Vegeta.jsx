import { Component } from 'react'
import vegetaImage from '../assets/vegeta-arc.jpg'


class Vegeta extends Component {
  state = {
    hits: 0
  }

  addOne = () => {
    this.setState(prevState => { return { hits: prevState.hits + 1 } })
  }

  render () {
    return (
      <div className="col">
        <h2>Vegeta</h2>
        <div 
          style={{ height: '300px' }} 
          className="d-flex justify-content-center align-items-end"
        >
          <img
            src={vegetaImage}
            alt="Vegeta"
            width="200"
          />
        </div>
        <br />
        <button onClick={this.addOne} className="btn btn-success">{this.props.name} Strikes</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Hits</th>
            </tr>
          </thead>
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

export default Vegeta;