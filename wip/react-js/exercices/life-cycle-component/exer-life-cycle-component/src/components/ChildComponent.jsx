import { Component } from 'react';

class ChildComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    console.log('ChildComponent - constructor');
  }

  componentDidMount() {
    console.log('ChildComponent - componentDidMount');
  }

  render() {
    console.log('ChildComponent - render');
    return (
      <div>
        {console.log('ChildComponent - mise à jour du DOM')}
        Child Component
      </div>
    );
  }
}

export default ChildComponent;