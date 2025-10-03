export const Wrapper = ({ children }) => {
  return (
    <div 
      style={{ 
        border: '2px solid red', 
        padding: '10px', 
        margin: '10px', 
        width: '170px', 
        backgroundColor: 'purple', 
      }}
    >
      {children}
    </div>
  );
}