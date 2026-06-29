import { forwardRef } from 'react';

const MyRef = forwardRef((props, ref) => {

  console.log({name: props.name});
  
  return (
    <div>
      <input ref={ref} type="text" />
    </div>
  );
});

export default MyRef;