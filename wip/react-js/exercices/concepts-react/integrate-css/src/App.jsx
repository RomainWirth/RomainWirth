import './App.css'
import './styles.css'
import styles from './style.module.css'

import Form from './components/Form'
import Header from './components/Header'

function App() {
  const paragrapheStyle = {
    fontSize: '20px',
    color: 'red',
  }

  return (
    <>
      {/* <h1 style={{fontSize: '50px', color: 'blue'}}>Hello World !</h1> */}
      <Header className="bigFont blue"/>
      <p className={styles.green}>premier paragraphe</p>
      <p style={paragrapheStyle}>paragraphe</p>
      <p className="blue">paragraphe</p>
      <Form head={true} />
    </>
  )
}

export default App
