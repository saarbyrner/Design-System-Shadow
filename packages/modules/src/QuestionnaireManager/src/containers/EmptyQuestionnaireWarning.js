import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { Dialogue } from '@kitman/components';
import { hideDialogue } from '../actions';

const mapStateToProps = (state) => ({
  message: i18n.t(
    'You should have at least one question selected if you want to proceed.'
  ),
  isEmbed: false,
  visible: state.dialogues.empty_warning,
  confirmButtonText: i18n.t('Got it!'),
});

const mapDispatchToProps = (dispatch) => ({
  confirmAction: () => {
    dispatch(hideDialogue());
  },
});

const ActivateDialogue = connect(mapStateToProps, mapDispatchToProps)(Dialogue);

export default ActivateDialogue;
