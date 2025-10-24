import { Component } from 'react';
import ChildComponent from './ChildComponent.jsx';

class LifeCycle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'LifeCycle',
      step: 1,
    };

    console.log(`step [${this.state.step}] - dans le constructor`);
  }

  componentDidMount() {
    console.log(`step [${this.state.step}] - dans le componentDidMount`);

    this.setState({ step: this.state.step +1 }, () => {
      console.log(`step [${this.state.step}] - après le setState du componentDidMount`);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
    console.log('Previous state: ', prevState);
    console.log('Current state: ', this.state);

    if (this.state.step === 2) {
      this.setState({ step: 3 }, () => {
        console.log(`step [${this.state.step}] - après le setState du componentDidUpdate`);
      });
    }
  }

  render() {
    console.log(`step [${this.state.step}] - dans le render`);
    return (
      <div>
        {console.log(`step [${this.state.step}] - mise à jour du DOM`)}
        <p>Life cycle component</p>
        <p>Name: {this.state.name}</p>
        <p>chargement : {this.state.step}</p>
        <ChildComponent />
      </div>
    );
  }
}

export default LifeCycle;