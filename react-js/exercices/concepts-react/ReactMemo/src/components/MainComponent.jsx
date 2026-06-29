import { Component } from 'react';

import SimpleComp from './SimpleComp';
import PureComp from './PureComp';
import FunctionComp from './FunctionComp';

class MainComponent extends Component {

  constructor (props) {
    super (props);

    this.state = {
      name: 'Toto'
    }
  }

  changeName = () => {
    this.setState ({
      name: 'Tata'
    })
  }

  render () {
    console.log('%c Main Component Rendered', 'color: red;');
    return (
      <div>
        <h2>Main Component</h2>
        <p>
          <span className="red">Parent Component</span>
          {this.state.name}
        </p>
        
        <SimpleComp name={this.state.name} />
        <PureComp name={this.state.name} />
        <FunctionComp name={this.state.name} />

        <button onClick={this.changeName}>Change Name</button>
      </div>
    )
  }
}

export default MainComponent;