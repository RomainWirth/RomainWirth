import { Component } from 'react'
import './App.css'

import LifeCycle from './components/LifeCycle.jsx'

class App extends Component {

  state = {
    display: true,
  }

  toggleDisplay = () => {    
    console.log('bouton cliqué')
    this.setState({ display: !this.state.display })
  }

  render() {
    const showComponent = this.state.display ? (<LifeCycle />) : null;

    return (
      <>
        <div>Hello world !</div>
        {showComponent}
        <button onClick={this.toggleDisplay}>
          click here
        </button>
      </>
    );
  }
}

export default App
