import { Component } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Vegeta from './components/Vegeta';
import Goku from './components/Goku';
import Frieza from './components/Frieza';
import ErrorBoundary from './components/ErrorBoundary';

class App extends Component {

  render() {
    return (
      <div className="container text-center">
        <h1 className="mb-5">cliquer sur les gentils</h1>
        <div className="row">
          <ErrorBoundary>
            <Vegeta />
          </ErrorBoundary>
          <ErrorBoundary>
            <Goku />
          </ErrorBoundary>
          <ErrorBoundary>
            <Frieza />
          </ErrorBoundary>
        </div>
      </div>
    )
  }
}

export default App
