import { Component } from "react";

import CustomButton from "./CustomButton";

class ResultsTwo extends Component {
  render() {
    const success = {
      backgroundColor: 'green',
      color: 'black'
    }

    const danger = {
      backgroundColor: 'red',
      color: 'black',
      borderRadius: '20px'
    }

    const primary = {
      backgroundColor: 'blue'
    }

    return (
      <div className="container d-flex flex-column align-items-center">
        <CustomButton>
          Cliquer ici
        </CustomButton>
        <CustomButton
          className={success}
        >
          Cliquer ici
        </CustomButton>
        <CustomButton
          className={danger}
        >
          Cliquer ici
        </CustomButton>
        <CustomButton
          className={primary}
        >
          Cliquer ici
        </CustomButton>
      </div>
    )
  } 
}

export default ResultsTwo;