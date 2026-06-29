import { Component } from "react"
import lisa from '../assets/lisa.jpg'
import ProfileData from "./ProfileData"

class Profile extends Component {
  render () {
    return (
      <div className="container">
        <h1>xxxx</h1>
        <img src={lisa} alt="lisa" className="img-thumbnail mb-3"/>
        <ProfileData />
      </div>
    )
  }
}

export default Profile