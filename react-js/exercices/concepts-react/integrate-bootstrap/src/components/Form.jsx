import { Component } from "react";
import styled from 'styled-components';

const Title = styled.h2`
  color: purple;
  font-size: 24px;
`;

const Button = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

class Form extends Component {
  render() {
    return (
      <div>
        <Title>Formulaire</Title>
        <p>je suis un paragraphe du formulaire</p>
        {/* <button className="btn btn-danger">Valider</button> */}
        <Button>Valider</Button>
      </div>
    )
  };
};

export default Form;