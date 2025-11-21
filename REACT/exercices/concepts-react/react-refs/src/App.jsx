import './App.css'

import React, { Component } from 'react'

// import RefComponent from './components/RefComponent.jsx'
import MyRef from './components/MyRef.jsx'

class App extends Component {
  constructor(props) {
    super(props)
    this.refComp = React.createRef();
  }

  handleClick = () => {
    console.log(this.refComp.current);
    this.refComp.current.focus();
  }

  render() {
    console.log(this.refComp);
    return (
      <div className="container">
        <h1>React Refs</h1>
        {/* <RefComponent /> */}
        <MyRef ref={this.refComp} name="Toto" />
        <button onClick={this.handleClick}>Valider</button>
      </div>
    )
  }
}

export default App
