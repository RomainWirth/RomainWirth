import './App.css'

import { Accordion } from 'react-bootstrap';

import Template from './components/Template';
import Buttons from './components/Buttons';
import Welcome from './components/Welcome';

function App() {

  return (
    <main>
      <Template />
      <div className="pt-5">
        <h1>Hello World !</h1>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Buttons</Accordion.Header>
            <Accordion.Body>
              <Buttons />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Welcome />
      </div>
    </main>
  )
}

export default App;
