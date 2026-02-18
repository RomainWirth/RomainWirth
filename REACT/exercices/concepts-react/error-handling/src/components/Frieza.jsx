import { Component } from "react";
import frieza from "../assets/frieza.jpeg";

import HandleClicks from "./HandleClicks";

class Frieza extends Component {
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
            src={frieza} 
            alt="Frieza"
            width="200"
          />
          <br />
        </div>
      </div>
    )
  }
}

const FriezaWithHandleClicks = HandleClicks(Frieza);

export default FriezaWithHandleClicks;