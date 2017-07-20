import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stateKeys } from '../../constants/example';
import { startTimer } from '../../actions/example';
import Test from '../../components/Test/index';

function TestView({ count, onTestButtonClick }) {
  return (
    <div className="test-view">
      <Test count={count} onClick={onTestButtonClick} />
    </div>
  );
}

TestView.propTypes = {
  count: PropTypes.number.isRequired,
  onTestButtonClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onTestButtonClick: () => dispatch(startTimer()),
});

const mapStateToProps = state => ({
  count: state.example.get(stateKeys.count),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestView);
