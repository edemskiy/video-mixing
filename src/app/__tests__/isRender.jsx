import React from 'react';
import { mount } from 'enzyme';
import App from '../index';

it('App: renders without crashing', () => {
  const wrapper = mount(<App />);
  console.log(wrapper.debug());
});
