import React from 'react';
import { BrowserRouter } from 'react-router-dom';

function wrapWithRouter(Content) {
  return function WithRouter() {
    return (
      <BrowserRouter>
        <Content />
      </BrowserRouter>
    );
  };
}

export default wrapWithRouter;
