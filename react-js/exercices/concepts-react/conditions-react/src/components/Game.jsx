import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    // if (this.state.winner) {  
    //   return (
    //     <div className="flex column align-center gap-10 bordered p-20 m-20">
    //       <h2>Game Component</h2>
    //       <p>Bravo {this.state.name}</p>
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="flex column align-center gap-10 bordered p-20 m-20">
    //       <h2>Game Component</h2>
    //       <p>Dommage {this.state.name}</p>
    //     </div>
    //   );
    // }
    
    // let result;
    // if (this.state.winner) {
    //   result = <p>Bravo {this.state.name}</p>;
    // } else {
    //   result = <p>Dommage {this.state.name}</p>;
    // }

    // return (
    //   <div className="flex column align-center gap-10 bordered p-20 m-20">
    //     <h2>Game Component</h2>
    //     {result}
    //   </div>
    // );

    return (
      <div className="flex column align-center gap-10 bordered p-20 m-20">
        <h2>Game Component</h2>
        <p>
          {this.state.winner 
            ? `Bravo ${this.state.name}` 
            : `Dommage ${this.state.name}`}
        </p>
      </div>
    )
  }
}

export default Game;