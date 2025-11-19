import React, { Component } from 'react'

class RefComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }

    this.myTitle = React.createRef();
    this.myInput = React.createRef();
  }

  update = (e) => {
    this.setState({ value: e.target.value })
  }

  componentDidMount() {
    this.myInput.current.focus();
  }

  componentDidUpdate() {
    this.myTitle.current.style.color = 'red';
  }

  handleClick = () => {
    console.log(this.myInput.current.value);
  }

  render () {
    return (
      <div>
        <h2 ref={this.myTitle}>Valeur : {this.state.value}</h2>
        {/* <input 
          ref={this.myInput}
          type="text" 
          id="" 
          name="" 
          value={this.state.value} 
          onChange={e => this.setState({ value: e.target.value })} 
        /> */}
        <input 
          ref={this.myInput} 
          type="text" 
        />
        <button onClick={this.handleClick}>Valider</button>
      </div>
    )
  }
}

export default RefComponent