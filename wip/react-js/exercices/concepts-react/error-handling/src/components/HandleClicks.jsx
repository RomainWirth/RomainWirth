import { Component } from 'react';

const HandleClicks = (WrappedComponent) => {
  return class HandleClicksHOC extends Component {
    state = {
      bg: ''
    }

    handleClick = () => {
      if (WrappedComponent.name === 'Frieza') {
        this.setState({ bg: 'bg-danger' });
      } else {
        this.setState({ bg: 'bg-success' })  
      }
    }

    render () {
      if (this.state.bg === 'bg-danger') {
        throw new Error(`${WrappedComponent.name} est méchant !`);
      }
      
      return (
        <WrappedComponent
          backGround={this.state.bg}
          clickHandler={this.handleClick}
        />
      )
    }
  }
};

export default HandleClicks;