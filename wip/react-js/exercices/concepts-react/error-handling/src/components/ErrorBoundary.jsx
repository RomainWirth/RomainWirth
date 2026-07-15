import { Component } from 'react';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {    
    // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
    console.error("Error caught by ErrorBoundary:", error); 
    return { 
      hasError: true 
    };  
  }

  // componentDidCatch(error, errorInfo) {    
  //   // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.    
  //   logErrorToMyService(error, errorInfo);  
  // }

  render() {
    if (this.state.hasError) {      
      // Vous pouvez afficher n'importe quelle UI de repli.      
      return (
        <div className="col p-5 text-white bg-danger">
          <div 
            style={{ height: "200px", width: "auto" }}
            className={`d-flex justify-content-center align-items-center overflow-hidden ${this.state.bg}`}
            onClick={this.handleClick}
          >
            <p>Houston we have a problem !</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;