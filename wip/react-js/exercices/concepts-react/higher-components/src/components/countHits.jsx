import { Component } from "react";

const countHits = (WrappedComponent, hitGenerator) => {
  class CountHists extends Component {
      state = {
        hits: 0,
        lastHit: 0
      }
    
      addHit = () => {
        const newHit = hitGenerator();
        this.setState((prevState) => {
          return { 
            hits: prevState.hits + 1, 
            lastHit: newHit 
          }
        })
      }

      componentDidUpdate(prevProps, prevState) {
        if(this.state !== prevState) {
          const CompName = WrappedComponent.name;
          this.props.reduceHealthPoint(CompName, this.state.lastHit);
        }
      }
    
    render () {
      return (
        <WrappedComponent 
          addOneHit={this.addHit} 
          hocState={this.state} 
          {...this.props} 
        />
      )
    }
  }
  return CountHists;
}

export default countHits;