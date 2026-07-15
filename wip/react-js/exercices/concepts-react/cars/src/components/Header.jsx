const Header = ({ title, colorTitle }) => {
  return (
    <div>
      <h1 style={{ color: colorTitle }} onMouseOver={this.addStyle}>{title}</h1>
    </div>
  );
}

export default Header;