import { connect } from 'react-redux';
import {
  fetchCodingSystemCategories,
  updateGraphFormType,
} from '../../actions';
import { GraphFormTranslated as GraphForm } from '../../components/GraphForm';

const mapStateToProps = (state) => ({
  graphType: state.GraphFormType,
  graphGroup: state.GraphGroup,
  canAccessMedicalGraph: state.StaticData.canAccessMedicalGraph,
});

const mapDispatchToProps = (dispatch) => ({
  updateGraphFormType: (graphType, graphGroup) => {
    dispatch(updateGraphFormType(graphType, graphGroup));
  },
  fetchCodingSystemCategories: (codingSystemKey) => {
    dispatch(fetchCodingSystemCategories(codingSystemKey));
  },
});

const GraphFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphForm);

export default GraphFormContainer;
