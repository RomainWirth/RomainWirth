import { Component } from "react";
import vegeta from "../assets/vegeta-arc.jpg";

import HandleClicks from "./HandleClicks";

class Vegeta extends Component {
  render() {
    const { backGround, clickHandler } = this.props;

    return (
      <div className={`col p-5 ${backGround}`}>
        <div 
          style={{ height: "200px", width: "auto" }}
          className={`d-flex justify-content-center align-items-start overflow-hidden ${backGround}`}
          onClick={clickHandler}
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

const VegetaWithHandleClicks = HandleClicks(Vegeta);

export default VegetaWithHandleClicks;