import { Component } from "react";
import vegeta from "../assets/vegeta-arc.jpg";

class Vegeta extends Component {
  render() {
    return (
      <div className="col">
        <div 
          style={{ height: "200px", width: "auto" }}
          className="d-flex justify-content-center align-items-start overflow-hidden"
        >
          <img 
            src={vegeta} 
            alt="Vegeta" 
            width="200"
          />
          <br />
        </div>
      </div>
    )
  }
}

export default Vegeta;