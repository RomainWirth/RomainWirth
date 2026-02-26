import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Menu from './components/Menu'
import Docs from './components/Docs'
import Tutorials from './components/Tutorials'
import Community from './components/Community'
import NotFound from './components/NotFound'

function App() {

  return (
    <BrowserRouter>
      <Menu />
      <Switch>
        <Route exact path="/" component={Docs} />
        <Route path="/tutorial" component={Tutorials} />
        <Route strict path="/community" component={Community} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
