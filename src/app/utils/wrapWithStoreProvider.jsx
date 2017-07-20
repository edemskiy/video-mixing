import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

function wrapWithStoreProvider(Content) {
  const WithStore = ({ store }) => (
    <Provider store={store}>
      <Content />
    </Provider>
  );
  WithStore.propTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
      dispatch: PropTypes.func,
      subscribe: PropTypes.func,
      replaceReducer: PropTypes.func,
    }).isRequired,
  };
  return WithStore;
}

export default wrapWithStoreProvider;
