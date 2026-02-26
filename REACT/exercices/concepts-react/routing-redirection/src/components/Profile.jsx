import { Component } from 'react'

class Profile extends Component {

  state = {
    id: null,
  }

  componentDidMount () {
    const data = this.props.match.params.profileId
  
    this.setState({
      id: data
    })
  }

  render () {
    return (
      <div className="container mt-3">
        <h1>Profile</h1>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">ID: {this.state.id}</li>
          <li className="list-group-item"></li>
          <li className="list-group-item"></li>
          <li className="list-group-item"></li>
          <li className="list-group-item"></li>
        </ul>
      </div>
    )
  }
}

export default Profile