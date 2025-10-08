import { Component } from 'react';
import Child from './Child';

class Parent extends Component {
  state = {
    messageParent: null,
    messageChild: null,
  }

  orderParent = () => {
    this.setState({ messageParent: "Range ta chambre" })
  }

  answerChild = () => {
    this.setState({ messageChild: "Oui, Papa" })
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <h2>Parent</h2>
        <button onClick={this.orderParent}>Parent order</button>
        <p>{this.state.messageParent}</p>
        <hr />
        <Child name="Toto" updatedState={this.state} childAnswer={this.answerChild} />
      </div>
    );
  }
}

export default Parent;


// // Exercice Maman/Toto
// import { Component } from 'react';
// import Toto from './Child';

// class Maman extends Component {
//     state = {
//         messageMaman: null,
//         messageToto: null,
//         disabled: true
//     }

//     ordreMaman = msg => this.setState({ messageMaman: msg, disabled: false });
//     reponseToto = msg => this.setState({ messageToto: msg });

//     render() {
//         return (
//             <div>
//                 <h1>Maman</h1>
//                 <button 
//                     onClick={() => this.ordreMaman("Va ranger ta chambre")}
//                 >Order de la mère</button>

//                 <p>{this.state.messageMaman}</p>

//                 <hr />
                
//                 <Toto 
//                     name="Toto"
//                     reponseTotoProps={this.reponseToto}
//                     leState={this.state}
//                 />
//             </div>
//         )
//     }
// }

// export default Maman;