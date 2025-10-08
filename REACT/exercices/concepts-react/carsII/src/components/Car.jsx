export const Car = ({ brand, age, color }) => {  
  return brand && (
    <div className='flex column justify-center items-center gap-10 bordered p-10'>
      <p>Marque : {brand}</p>
      <p>Age : {age} ans</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </div>
  );
}