import { Component } from 'react';

import SingerFunction from './SingerFunction';
import SingerClass from './SingerClass';

class Display extends Component {
  render() {
    return (
      <div className='flex column items-center justify-center gap-10'>
        <h2>Chanteurs</h2>
        <div className="flex gap-20">
          <SingerFunction name="Eric Clapton" age="74" />
          <SingerFunction name="Jimi Hendrix" age="27" />
          <SingerClass name="David Gilmor" age="73" />
          <SingerClass name="Carlos Santana" age="71" />
        </div>
      </div>
    )
  } 
};

export default Display;