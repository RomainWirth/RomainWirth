import { Component } from "react";

class ResultsOne extends Component {
  state = {
    name: "Mario",
    winner: false
  }

  changeStatus = () => this.setState({ winner: !this.state.winner });

  render() {
    const result = this.state.winner ? `Bravo ${this.state.name}` : `Dommage ${this.state.name}`;
    const alertStatus = this.state.winner ? 'alert-success' : 'alert-danger';

    return (
      <div className="container d-flex flex-column align-items-center">
        <p className={`alert ${alertStatus}`} role="alert">{result}</p>
        <button
          onClick={this.changeStatus} 
          className="btn btn-primary"
        >
          change state
        </button>
      </div>
    )
  } 
}

export default ResultsOne;