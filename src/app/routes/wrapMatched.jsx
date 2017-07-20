import React from 'react';

function wrapMatched(View) {
  return function Match() {
    return <View />;
  };
}

export default wrapMatched;
