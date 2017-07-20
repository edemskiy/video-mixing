import React from 'react';
import { Route } from 'react-router-dom';
import wrapMatched from './wrapMatched';
import TestView from './TestView';

function Routes() {
  return (
    <div className="routes">
      <Route path="/test" component={wrapMatched(TestView)} />
    </div>
  );
}

export default Routes;
