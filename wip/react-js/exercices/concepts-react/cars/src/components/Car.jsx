import { Wrapper } from './Wrapper';

export const Car = ({ children, color }) => {
  
  return children && (
    <Wrapper>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </Wrapper>
  );
}