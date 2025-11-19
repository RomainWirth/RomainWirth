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
    this.refComp.current.addFocus();
  }

  render() {
    return (
      <div className="container">
        <h1>React Refs</h1>
        {/* <RefComponent /> */}
        <MyRef ref={this.refComp} />
        <button onClick={this.handleClick}>Valider</button>
      </div>
    )
  }
}

export default App
