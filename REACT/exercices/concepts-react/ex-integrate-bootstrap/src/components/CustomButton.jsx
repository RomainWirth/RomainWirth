const CustomButton = ({ children, className, handleClick }) => {
  const customBtnStyle = {
    backgroundColor: 'grey',
    border: 'none',
    color: '#fff',
    fontSize: '19px',
    padding: '15px 30px',
    margin: '5px auto',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '7px',
    display: 'block',
    cursor: 'pointer',
  }

  return (
    <button style={{...customBtnStyle, ...className}} onClick={handleClick}>
      {children}
    </button>
  )
}

export default CustomButton