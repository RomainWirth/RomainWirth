import { Component } from 'react';

class SimpleComp extends Component {
  render () {
    console.log('%c Simple Component Rendered', 'color: blue;');
    return (
      <div>
        <h2>Simple Component</h2>
        <p>
          <span className="blue">
            Simple component paragraph for name : 
          </span>
          {this.props.name}
        </p>
      </div>
    )
  }
}

export default SimpleComp;