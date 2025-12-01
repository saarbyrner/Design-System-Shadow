import { useSelector, useDispatch } from 'react-redux';
import { NoteDetailModalTranslated as NoteDetailModal } from '../components/NoteDetailModal';
import { closeNoteDetailModal } from '../redux/actions/noteDetailModal';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.noteDetailModal.isOpen);
  const annotation = useSelector((state) => state.noteDetailModal.annotation);
  const requestStatus = useSelector(
    (state) => state.noteDetailModal.requestStatus
  );

  return (
    <NoteDetailModal
      isOpen={isOpen}
      annotation={annotation}
      requestStatus={requestStatus}
      onClickCloseModal={() => {
        dispatch(closeNoteDetailModal());
      }}
      {...props}
    />
  );
};
