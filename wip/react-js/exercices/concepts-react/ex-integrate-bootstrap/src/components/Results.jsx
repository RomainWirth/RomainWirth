import { Component } from "react";

import CustomButton from "./CustomButton";

class Results extends Component {
  state = {
    name: "Mario",
    winner: false
  }

  changeStatus = () => this.setState({ winner: !this.state.winner });

  render () {
    const result = this.state.winner ? `Bravo ${this.state.name}` : `Dommage ${this.state.name}`;
    const alertStatus = this.state.winner ? 'alert-success' : 'alert-danger';

    const success = {
      backgroundColor: 'green',
      color: 'black'
    }

    // const danger = {
    //   backgroundColor: 'red',
    //   color: 'black',
    //   borderRadius: '20px'
    // }

    // const primary = {
    //   backgroundColor: 'blue'
    // }

    return (
      <div className="container d-flex flex-column align-items-center">
        <p className={`alert ${alertStatus}`} role="alert">
          {result}
        </p>
        {/* <button
          onClick={this.changeStatus} 
          className="btn btn-primary"
        >
          change state
        </button>
        <CustomButton>
          Cliquer ici
        </CustomButton> */}
        <CustomButton
          className={success}
          handleClick={this.changeStatus} 
        >
          Cliquer ici
        </CustomButton>
        {/* <CustomButton
          className={danger}
        >
          Cliquer ici
        </CustomButton>
        <CustomButton
          className={primary}
        >
          Cliquer ici
        </CustomButton> */}
      </div>
    )
  }
}

export default Results