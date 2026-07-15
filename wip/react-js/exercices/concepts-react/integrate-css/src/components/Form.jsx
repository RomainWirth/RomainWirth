import { Component } from "react";

class Form extends Component {
  render() {

    const myClass = this.props.head ? "blue" : "red";

    return (
      <div>
        <h2>Formulaire</h2>
        <p className={`${myClass} bigFont`}>je suis rouge ou bleu</p>
        <button>Valider</button>
      </div>
    )
  };
};

export default Form;