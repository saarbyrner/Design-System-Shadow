import { connect } from 'react-redux';
import { Checkbox as CheckboxComponent } from '@kitman/components';
import { toggleVariable } from '../actions';

const mapStateToProps = (state, ownProps) => {
  const athleteId = ownProps.athleteId;
  const variableId = ownProps.currentVariableId;

  return {
    id: `questionBox[${ownProps.athleteId}_${ownProps.currentVariableId}]`,
    isChecked: state.checkedVariables[athleteId][variableId] || false,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggle: () => {
    dispatch(toggleVariable(ownProps.athleteId, ownProps.currentVariableId));
  },
});

const Checkbox = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckboxComponent);

export default Checkbox;
