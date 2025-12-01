import { connect } from 'react-redux';
import HeaderComponent from '../components/Header';
import { showAddModal } from '../actions';

const mapStateToProps = (state) => ({
  templates: state.templates || [],
});

const mapDispatchToProps = (dispatch) => ({
  addTemplate: () => {
    dispatch(showAddModal());
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default App;
