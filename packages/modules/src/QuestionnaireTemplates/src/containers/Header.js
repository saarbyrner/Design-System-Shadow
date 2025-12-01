import { connect } from 'react-redux';
import { HeaderTranslated as Header } from '../components/Header';
import { addTemplate } from '../actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  addTemplate: () => {
    dispatch(addTemplate());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
