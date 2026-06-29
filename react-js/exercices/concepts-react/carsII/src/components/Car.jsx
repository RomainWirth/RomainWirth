export const Car = ({ brand, ageString, color }) => {  
  return brand && (
    <div className='flex column justify-center items-center gap-10 bordered p-10'>
      <p>Marque : {brand}</p>
      <p>Age : {ageString}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </div>
  );
}