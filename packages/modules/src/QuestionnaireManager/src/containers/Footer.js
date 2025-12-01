import { connect } from 'react-redux';
import { FooterTranslated as FooterComponent } from '../components/Footer';
import { saveQuestionnaire, showDialogue } from '../actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  saveQuestionnaire: () => {
    dispatch(saveQuestionnaire());
  },
  clearAllVisibleVariables: () => {
    dispatch(showDialogue('clear_all_warning'));
  },
});

const Footer = connect(mapStateToProps, mapDispatchToProps)(FooterComponent);

export default Footer;
