import { Component } from "react";
import goku from "../assets/goku.jpg";

class Goku extends Component {
  render() {
    return (
      <div className="col">
        <div 
          style={{ height: "200px", width: "auto" }}
          className="d-flex justify-content-center align-items-start overflow-hidden"
        >
          <img 
            src={goku} 
            alt="Goku" 
            width="200"
          />
          <br />
        </div>
      </div>
    )
  }
}

export default Goku;