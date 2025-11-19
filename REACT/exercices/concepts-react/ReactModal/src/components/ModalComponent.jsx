import { Component } from 'react';
import ReactDOM from 'react-dom';

class ModalComponent extends Component {
  constructor(props) {
    super(props);

    this.popUpContainer = document.createElement('div');

    document.body.appendChild(this.popUpContainer);
  }

  componentWillUnmount() {
    document.body.removeChild(this.popUpContainer);
  }

  render () {
    return ReactDOM.createPortal(
      <div className="modal" onClick={this.props.close}>
        <div className="modal-content">
          <p>
            Je suis dans le modal !
          </p>
          <button>Fermer</button>    
        </div>
      </div>,
      this.popUpContainer
    )
  }
}

export default ModalComponent;