import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
    colorTitle: 'green'
  }

  changeTitle = () => {
    this.setState({
      title: 'Nouveau titre'
    })
  }

  changeWithParam = (newTitle) => {
    this.setState({
      title: newTitle
    })
  }

  changeWithBind = (param) => {
    this.setState({
      title: param
    })
  }

  changeWithInput = (e) => {
    this.setState({
      title: e.target.value
    })
  }


  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
        <input type="text" onChange={(e) => this.changeWithInput(e)} value={this.state.title}/>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={this.changeTitle}>Changer le nom en dur</button>
          <button onClick={() => this.changeWithParam('Titre via paramètre')}>Changer le nom avec paramètre</button>
          <button onClick={this.changeWithBind.bind(this, 'Titre via bind')}>Changer le nom avec Bind</button>
        </div>
      </div>
    )
  }
}

export default App
