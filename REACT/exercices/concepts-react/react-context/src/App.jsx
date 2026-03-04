import { Component } from 'react'
import './App.css'
import Profile from './components/Profile'

class App extends Component {
  state = {
    name: 'Lisa',
    age: 8
  }

  render () {
    return (
      <main>
        <Profile />
      </main>
    )
  }
}

export default App
