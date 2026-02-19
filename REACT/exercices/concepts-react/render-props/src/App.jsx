import { Component } from 'react'
import './App.css'

import Vegeta from './components/Vegeta';
import Goku from './components/Goku';
import AddHits from './components/AddHits';

class App extends Component {

  render () {
    return (
      <div className="container text-center">
        <h1>Goku vs Vegeta</h1>
        <div className="row">
          <AddHits 
            render={(hits, addOne, saiyan) => {
              return (
                saiyan.vegeta && <Vegeta hits={hits} addOne={addOne} name="Vegeta" />
              )
            }}
          />
          <AddHits 
            render={(hits, addOne, saiyan) => {
              return (
                saiyan.goku &&<Goku hits={hits} addOne={addOne} name="Goku" />
              )
            }}
          />
        </div>
      </div>
    )
  }
}

export default App
