import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../images/Novek.png'

const NavBar = () => {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="80"
              height="80"
              className="d-inline-block align-top"
            />
        </Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="#MainTable">Main</Nav.Link>
            <Nav.Link href="#TopN">TopN</Nav.Link>
            <Nav.Link href="#DeliveriesChart">Deliveries Over Time</Nav.Link>
          </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Button variant="outline-success">Sign in</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;