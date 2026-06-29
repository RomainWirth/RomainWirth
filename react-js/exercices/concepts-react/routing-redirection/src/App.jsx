import './App.css'
import { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Menu from './components/Menu'
import Docs from './components/Docs'
import Tutorials from './components/Tutorials'
import Community from './components/Community'
import Users from './components/Users'
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
          {/* Test de redirection conditionnelle : si la page est en construction, on redirige vers la page d'accueil, sinon on affiche la page demandée */}
          {/* <Route path="/tutorial" component={() => (
            this.state.underConstruction.Tutorials ? (
              <Redirect to="/" />
            ) : (
              <Tutorials />
            )
          )} /> */}
          <Route strict path="/community" component={Community} />
          <Route exact path="/users" component={Users} />
          <Route path="/users/:userId" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
