import { PureComponent } from 'react';

class PureComp extends PureComponent {
  render () {
    console.log('%c Pure Component Rendered', 'color: green;');
    return (
      <div>
        <h2>Pure Component</h2>
        <p>
          <span className="green">
            Pure component paragraph for name : 
          </span>
          {this.props.name}
        </p>
      </div>
    )
  }
}

export default PureComp;