const Welcome = () => {
  const hello = () => {
    console.log('Hello');
  }

  const helloWithParam = (param) => {
    console.log(param);
  }

  return (
    <div className='flex column justify-center items-center gap-10 bordered p-10'>
      <button onClick={hello}>Invoque a function</button>
      <button onClick={() => helloWithParam('Bonsoir')}>Invoque a function with "Hello" as param</button>
      <button onClick={() => console.log('Good night')}>start a console.log("Good night") without invoquing a function</button>
    </div>
  );
}

export default Welcome;