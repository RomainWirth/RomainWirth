import './App.css'

import { Component } from 'react'

import ModalComponent from './components/ModalComponent.jsx'

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true })
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  render () {

    const modal = this.state.showModal ? <ModalComponent close={this.handleCloseModal} /> : null

    return (
      <div className="App relative">
        <h1>React Modal</h1>
        <button onClick={this.handleOpenModal}>Display modal</button>
        {modal}
      </div>
    )
  }
}

export default App
