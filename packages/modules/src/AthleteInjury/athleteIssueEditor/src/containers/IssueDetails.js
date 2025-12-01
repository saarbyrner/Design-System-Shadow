import { connect } from 'react-redux';
import { IssueDetailsTranslated as IssueDetails } from '../components/IssueDetails';
import {
  populateIssueDetails,
  updateOsicsClassification,
  updateBodyArea,
  updateSide,
  updateType,
  updateHasSupplementaryPathology,
  updateSupplementaryPathology,
  updateBamicGradeId,
  updateBamicSiteId,
} from '../actions';

const mapStateToProps = (state) => ({
  osicsPathologyOptions: state.ModalData.osicsPathologyOptions,
  osicsClassificationOptions: state.ModalData.osicsClassificationOptions,
  bodyAreaOptions: state.ModalData.bodyAreaOptions,
  sideOptions: state.ModalData.sideOptions,
  issueTypeOptions: state.ModalData.issueTypeOptions,
  isFetchingIssueDetails: state.ModalData.isFetchingIssueDetails,
  osicsPathology: state.IssueData.osics.osics_pathology_id,
  osicsClassification: state.IssueData.osics.osics_classification_id,
  bodyArea: state.IssueData.osics.osics_body_area_id,
  side: state.IssueData.side_id,
  osicsCode: state.IssueData.osics.osics_id,
  icdCode: state.IssueData.osics.icd,
  typeId: state.IssueData.type_id,
  formType: state.ModalData.formType,
  hasRecurrence: state.IssueData.has_recurrence,
  hasSupplementaryPathology: state.IssueData.has_supplementary_pathology,
  supplementaryPathology: state.IssueData.supplementary_pathology,
  bamicGradeId: state.IssueData.bamic_grade_id,
  bamicSiteId: state.IssueData.bamic_site_id,
  bamicGrades: state.staticData.bamicGrades,
  injuryOsics: state.staticData.injuryOsics,
});

const mapDispatchToProps = (dispatch) => ({
  populateIssueDetails: (osicsPathology) => {
    dispatch(populateIssueDetails(osicsPathology));
  },
  updateOsicsClassification: (osicsClassification) => {
    dispatch(updateOsicsClassification(osicsClassification));
  },
  updateHasSupplementaryPathology: (hasSupplementaryPathology) => {
    dispatch(updateHasSupplementaryPathology(hasSupplementaryPathology));
  },
  updateSupplementaryPathology: (supplementaryPathology) => {
    dispatch(updateSupplementaryPathology(supplementaryPathology));
  },
  updateBodyArea: (bodyArea) => {
    dispatch(updateBodyArea(bodyArea));
  },
  updateSide: (side) => {
    dispatch(updateSide(side));
  },
  updateType: (typeId) => {
    dispatch(updateType(typeId));
  },
  updateBamicGradeId: (gradeId) => {
    dispatch(updateBamicGradeId(gradeId));
  },
  updateBamicSiteId: (siteId) => {
    dispatch(updateBamicSiteId(siteId));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(IssueDetails);

export default App;
