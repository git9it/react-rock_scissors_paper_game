import React from 'react';

function SimpleAlert({ classname, roundResults }) {
  return (
    <div className={classname}>
      {roundResults == 0 ? 'ПОРАЖЕНИЕ!' : null}
      {roundResults == 1 ? 'ПОБЕДА!' : null}
      {roundResults == 2 ? 'НИЧЬЯ!' : null}
    </div>
  );
}

export default SimpleAlert;
