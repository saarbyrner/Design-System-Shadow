import { connect } from 'react-redux';
import ActivateButtonComponent from '../components/ActivateButton';
import {
  showActivateDialogue,
  activateTemplateRequest,
  deactivateTemplateRequest,
} from '../actions';

const mapStateToProps = (state, ownProps) => ({
  // We disable the button when the template is the only one active
  // This prevents to deactivate the only remaining active template
  disabled:
    ownProps.isActive &&
    Object.values(state.templates).filter((template) => template.active)
      .length <= 1,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleActive: () => {
    if (window.featureFlags['athlete-forms-list']) {
      if (!ownProps.isActive) {
        dispatch(activateTemplateRequest(ownProps.templateId));
      } else {
        dispatch(deactivateTemplateRequest(ownProps.templateId));
      }
    } else if (!ownProps.isActive) {
      dispatch(showActivateDialogue(ownProps.templateId));
    }
  },
});

const ActivateButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivateButtonComponent);

export default ActivateButton;
