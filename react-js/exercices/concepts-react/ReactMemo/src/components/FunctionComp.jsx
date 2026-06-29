import { memo } from 'react';

const FunctionComp = (props) => {
  console.log('%c Function Component Rendered', 'color: purple;');
  return (
    <div>
      <h2>Function Component</h2>
      <p>
        <span className="purple">
          Function component paragraph for name :
        </span>
        {props.name}
      </p>
    </div>
  );
};

export default memo(FunctionComp);