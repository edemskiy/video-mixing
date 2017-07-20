import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/index';

export default function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'));
}
