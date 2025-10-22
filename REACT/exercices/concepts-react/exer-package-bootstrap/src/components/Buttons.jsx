import { Alert, Container } from 'react-bootstrap';

const Buttons = () => {
  const buttonClasses = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]

  return (
    <Container>
      {buttonClasses.map((variant) => (
        <Alert variant={variant} key={variant} className="text-center">
          This is a {variant} alert—check it out!
        </Alert>
      ))}
    </Container>
  )
}

export default Buttons;