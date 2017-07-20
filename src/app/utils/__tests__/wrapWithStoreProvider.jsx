import React from 'react';
import { shallow } from 'enzyme';
import wrapWithStoreProvider from '../wrapWithStoreProvider';

describe(wrapWithStoreProvider.name, () => {
  const TestComponent = () => <div>Ok</div>;
  it('success connection with signature store', () => {
    const syntheticStore = createSyntheticStore();
    const StoreBind = wrapWithStoreProvider(TestComponent);
    const wrapper = shallow(<StoreBind store={syntheticStore} />);
  });
});

function createSyntheticStore() {
  return {
    getState: () => null,
    dispatch: () => null,
    subscribe: () => null,
    replaceReducer: () => null,
  };
}
