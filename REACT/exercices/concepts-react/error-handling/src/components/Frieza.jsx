import { Component } from "react";
import frieza from "../assets/frieza.jpeg";

class Frieza extends Component {
  state = {
    bg: ''
  }

  handleClick = () => {
    this.setState({ bg: 'bg-success' })  
  }

  render() {
    return (
      <div className="col">
        <div 
          style={{ height: "200px", width: "auto" }}
          className={`d-flex justify-content-center align-items-start overflow-hidden ${this.state.bg}`}
          onClick={this.handleClick}
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

export default Frieza;