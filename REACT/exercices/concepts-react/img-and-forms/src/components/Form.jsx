import { Component } from 'react';

import Romain from './Romain';
import IconCircleUser from './IconCircleUser';

class Form extends Component {

  state = {
    username: '',
    color: '',
    colors: ['', 'green', 'blue', 'red', 'yellow', 'black', 'white'],
    comment: '',
  }

  handlePseudo = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  handleColor = (e) => {
    this.setState({
      color: e.target.value
    })
  }

  handleComments = (e) => {
    this.setState({
      comment: e.target.value
    })
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    alert(`Pseudo : ${this.state.username} \nCommentaire : ${this.state.comment}`);
  }

  render() {
    return (
      <div className="flex column justify-center items-center gap-10 bordered p-20 m-10">
        <div className="flex column gap-10">
          <Romain />
        </div>
        <h2>User</h2>
        <div className="flex gap-20 items-start">
          <IconCircleUser width="100" height="100" color={this.state.color} />
          <p className='flex column gap-10'>
            <span>
              utilisateur : 
            </span>
            <span>
              {this.state.username}
            </span>
          </p>
          <p className='flex column gap-10'>
            <span>
              Commentaire : 
            </span>
            <span>
              {this.state.comment}
            </span>
          </p>
        </div>
        <form className="flex gap-20" onSubmuit={this.handleSubmitForm}>
          <div className="flex column items-start gap-5 m-20">
            <label>Pseudo</label>
            <input type="text" value={this.state.username} onChange={this.handlePseudo} />
          </div>
          <div className="flex column items-start gap-5 m-20">
            <label>Couleur</label>
            <select onChange={this.handleColor}>
              {this.state.colors.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="flex column items-start gap-5 m-20">
            <label>Message</label>
            <textarea onChange={this.handleComments}></textarea>
          </div>
          <button>Valider</button>
        </form>
      </div>
    )
  }
}

export default Form;