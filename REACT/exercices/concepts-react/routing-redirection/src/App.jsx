import './App.css'
import { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Menu from './components/Menu'
import Docs from './components/Docs'
import Tutorials from './components/Tutorials'
import Community from './components/Community'
import Profile from './components/Profile'
import NotFound from './components/NotFound'

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      underConstruction: {
        Docs: false,
        Tutorials: true,
        Community: false,
        Profile: false
      }
    }
  }


  render () {
    return (
      <BrowserRouter>
        <Menu />
        <Switch>
          <Route exact path="/" component={Docs} />
          <Route path="/tutorial" component={Tutorials} />
          {/* <Route path="/tutorial" component={() => (
            this.state.underConstruction.Tutorials ? (
              <Redirect to="/" />
            ) : (
              <Tutorials />
            )
          )} /> */}
          <Route strict path="/community" component={Community} />
          <Route path="/users/:profileId" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
