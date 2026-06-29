import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container fluid="md">
      <Row>
        <Col>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg="4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
        <Col lg="4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
        <Col lg="4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg="6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
        <Col lg="6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
            Nullam ac erat ante. Sed vel urna at dui iaculis gravida. 
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
            Proin eget tortor risus. Donec sollicitudin molestie malesuada.
          </p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg="6">
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6">
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Welcome;