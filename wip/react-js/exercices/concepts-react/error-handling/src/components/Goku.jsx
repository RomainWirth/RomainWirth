import { Component } from "react";
import goku from "../assets/goku.jpg";

import HandleClicks from "./HandleClicks";

class Goku extends Component {
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

const GokuWithHandleClicks = HandleClicks(Goku);

export default GokuWithHandleClicks;