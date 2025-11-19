import React, { Component } from 'react';

class MyRef extends Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
  }

  addFocus() {
    this.myInput.current.focus();
  }

  render() {
    return (
      <div>
        <input ref={this.myInput} type="text" />
      </div>
    );
  }
}

export default MyRef;