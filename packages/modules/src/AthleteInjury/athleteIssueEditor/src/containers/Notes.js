import { connect } from 'react-redux';
import { NotesTranslated as Notes } from '../components/Notes';
import { updateNote, updateIsRestricted, updatePsychOnly } from '../actions';

const mapStateToProps = (state) => ({
  notes: state.IssueData.notes,
  formType: state.ModalData.formType,
  currentNote: state.CurrentNote,
  isRestricted: state.CurrentNote.restricted,
  psychOnly: state.CurrentNote.psych_only,
});

const mapDispatchToProps = (dispatch) => ({
  updateIsRestricted: (isRestricted) => {
    dispatch(updateIsRestricted(isRestricted));
  },
  updatePsychOnly: (psychOnly) => {
    dispatch(updatePsychOnly(psychOnly));
  },
  updateNote: (note) => {
    dispatch(updateNote(note));
  },
});

const NotesContainer = connect(mapStateToProps, mapDispatchToProps)(Notes);

export default NotesContainer;
