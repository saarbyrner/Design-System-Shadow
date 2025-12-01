import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { Dialogue } from '@kitman/components';
import { hideDialogue, clearAllVisibleVariables } from '../actions';

const mapStateToProps = (state) => {
  const selectedPlatform = state.variablePlatforms.filter(
    (platform) => platform.value === state.variables.selectedPlatform
  );

  const searchTerm =
    state.athletes.searchTerm && state.athletes.searchTerm.length > 0
      ? state.athletes.searchTerm
      : null;
  let message;

  if (searchTerm && selectedPlatform.length > 0) {
    message = i18n.t(
      'Are you sure you want to clear all {{plateformName}} questions for {{athleteName}}?',
      {
        plateformName: selectedPlatform[0].name,
        athleteName: state.athletes.searchTerm,
      }
    );
  } else if (selectedPlatform.length > 0) {
    message = i18n.t(
      'Are you sure you want to clear all {{plateformName}} questions?',
      { plateformName: selectedPlatform[0].name }
    );
  } else {
    message = i18n.t('Are you sure you want to clear all questions?');
  }

  return {
    message,
    isEmbed: false,
    visible: state.dialogues.clear_all_warning,
    confirmButtonText: i18n.t('Clear'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  cancelAction: () => {
    dispatch(hideDialogue());
  },
  confirmAction: () => {
    dispatch(clearAllVisibleVariables());
  },
});

const ClearAllDialogue = connect(mapStateToProps, mapDispatchToProps)(Dialogue);

export default ClearAllDialogue;
