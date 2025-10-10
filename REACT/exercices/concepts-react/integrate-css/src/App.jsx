import './App.css'
import './styles.css'

import Form from './components/Form'

function App() {
  const paragrapheStyle = {
    fontSize: '20px',
    color: 'red',
  }

  return (
    <>
      <h1 style={{fontSize: '50px', color: 'blue'}}>Hello World !</h1>
      <p style={paragrapheStyle}>paragraphe</p>
      <p className="blue">paragraphe</p>
      <Form />
    </>
  )
}

export default App
