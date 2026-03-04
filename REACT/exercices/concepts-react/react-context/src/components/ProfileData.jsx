import ContentData from "./ContentData"

const ProfileData = () => {
  return (
    <div>
      <p>
        <a 
          className="btn btn-primary" 
          data-toggle="collapse" 
          href="#collapseExample" 
          role="button" 
          aria-expanded="false" 
          aria-controls="collapseExample"
        >
          Profile Data for xxxx
        </a>
      </p>
      <ContentData />
    </div>
  )
}

export default ProfileData