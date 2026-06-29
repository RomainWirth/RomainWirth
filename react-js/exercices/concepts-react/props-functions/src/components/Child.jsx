const Child = (props) => {
  const { name, updatedState, childAnswer } = props;

  const btn = updatedState.messageParent !== null 
    ? <button onClick={() => childAnswer()}>Answer</button> 
    : <button disabled>Answer</button>;

  return (
    <div>
      <h2>{name}</h2>
      {btn}
      <p>{updatedState.messageChild}</p>
    </div>
  )
}

export default Child;

// const Toto = props => {
//   return (
//     <>
//         <h2>{props.name}</h2>
//         <button 
//           onClick={() => props.reponseTotoProps("Non, je veux regarder la télé")}
//           disabled={props.leState.disabled}
//         >Réponse</button>

//         <p>{props.leState.messageToto}</p>
//     </>
//   )
// }

// export default Totoc