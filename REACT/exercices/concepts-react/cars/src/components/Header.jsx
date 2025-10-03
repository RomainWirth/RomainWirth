const Header = ({ title, colorTitle }) => {
  return (
    <div>
      <h1 style={{ color: colorTitle }}>{title}</h1>
    </div>
  );
}

export default Header;