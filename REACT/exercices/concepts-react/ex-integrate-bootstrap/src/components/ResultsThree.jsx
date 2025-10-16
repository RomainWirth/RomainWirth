import { Component } from "react";

import CustomButton from "./CustomButton";

class ResultsThree extends Component {
  render() {
    const primary = {
      backgroundColor: 'yellow',
      color: 'green'
    }

  const sayHello = () => alert('Hello world!')

    return (
      <div className="container d-flex flex-column align-items-center">
        <CustomButton
          className={primary}
          handleClick={sayHello}
        >
          Cliquer ici
        </CustomButton>
      </div>
    )
  } 
}

export default ResultsThree;