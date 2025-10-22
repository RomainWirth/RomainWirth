import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"

const Template = ({className}) => {
  return (
    <Navbar bg="success" variant="dark" expand="sm" className={className}>
      <Container className="d-flex justify-content-between">
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-2">
          <img src="/vite.svg" alt="logo vite" width="30" height="30" className="d-inline-block align-top" />
          <span>Formation React-Bootstrap</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default Template