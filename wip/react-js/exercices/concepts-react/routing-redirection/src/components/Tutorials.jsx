const Tutorials = (props) => {

  setTimeout(() => {
    props.history.push('/')
  }, 5000)

  return (
    <div className="container mt-3">
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> This page is under construction. You will be redirected to the home page in 5 seconds.
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <h1>Tutorials</h1>
      <p>This is the tutorials page.</p>
    </div>
  )
}

export default Tutorials