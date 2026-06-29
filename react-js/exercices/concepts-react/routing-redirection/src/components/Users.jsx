import { Component } from 'react';
import { Link } from 'react-router-dom';

class Users extends Component {
  state = {
    users: [],
    error: null,
  }

  componentDidMount () {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((users) => {
        console.log({users});
        this.setState({ users });
      })
      .catch((error) => {
        console.log('Error fetching users:', error);
        this.setState({ error: error.message });
      });
  }

  render () {
    return (
      <div className="container mt-3">
        <h1>Users</h1>
        {this.state.error && <p className="text-danger">{this.state.error}</p>}
        <ul className="list-group list-group-flush">
          {this.state.users.map((user) => (
            <li key={user.id} className="list-group-item">
              <p>{user.name}</p>
              <Link to={`/users/${user.id}`}>see profile information</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Users;