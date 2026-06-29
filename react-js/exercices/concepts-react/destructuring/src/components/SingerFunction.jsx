const SingerFunction = ({ name, age }) => {
  return (
    <div className="flex column items-center justify-center gap-10 bordered p-10">
      <h3>Chanteur :</h3>
      <p>Nom : {name}</p>
      <p>Age : {age} ans</p>
    </div>
  );
};

export default SingerFunction;