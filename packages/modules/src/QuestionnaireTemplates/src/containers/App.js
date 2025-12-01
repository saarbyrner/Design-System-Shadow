import { connect } from 'react-redux';
import { AppTranslated as AppComponent } from '../components/App';
import { getTemplates } from '../redux/selectors';

const mapStateToProps = (state) => ({
  templates: getTemplates(state) || [],
});

const mapDispatchToProps = () => ({});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
