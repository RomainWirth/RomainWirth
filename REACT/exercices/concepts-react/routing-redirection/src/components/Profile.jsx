import { Component } from 'react'

class Profile extends Component {

  state = {
    user: null,
    error: null,
  }

  componentDidMount () {
    console.log(this.props.match.params)
    const { userId } = this.props.match.params

    console.log({userId})

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((user) => {
        this.setState({
          user,
        });
      })
      .catch((error) => {
        console.log('Error fetching user:', error);
        this.setState({ error: error.message })
      });
  }

  render () {
    const { user, error } = this.state

    if (error) {
      return (
        <div className="container mt-3 text-danger">{error}</div>
      )
    }

    if (!user) {
      return (
        <div className="container mt-3">Loading...</div>
      )
    }

    const { id, name, username, email, phone, website } = user

    return (
      <div className="container mt-3">
        <h1>Profile</h1>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">ID: {id}</li>
          <li className="list-group-item">Name: {name}</li>
          <li className="list-group-item">Username: {username}</li>
          <li className="list-group-item">Email: {email}</li>
          <li className="list-group-item">Phone: {phone}</li>
          <li className="list-group-item">
            <a href={`http://${website}`} target="_blank" rel="noopener noreferrer">Website</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Profile