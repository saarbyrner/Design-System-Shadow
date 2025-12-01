import { useSelector, useDispatch } from 'react-redux';
import Attachments from '../components/AddIssueSidePanel/Attachments';
import {
  removeAdditionalAnnotation,
  updateAnnotationContent,
  updateAnnotationVisibility,
  updateAnnotationAttachmentAttributes,
  updateAnnotationFilesQueue,
} from '../redux/actions';

export default (props) => {
  const dispatch = useDispatch();
  const selectedAdditionalAttachments = useSelector(
    (state) => state.addIssuePanel.additionalInfo.annotations
  );

  return (
    <Attachments
      {...props}
      onRemoveAdditionalAnnotation={(index) => {
        dispatch(removeAdditionalAnnotation(index));
      }}
      onUpdateAnnotationContent={(index, content) =>
        dispatch(updateAnnotationContent(index, content))
      }
      onUpdateAnnotationVisibility={(index, visibility) =>
        dispatch(updateAnnotationVisibility(index, visibility))
      }
      onAddAttachment={(index, files) => {
        dispatch(updateAnnotationAttachmentAttributes(index, files));
      }}
      onSelectAnnotationFiles={(index, files) => {
        dispatch(updateAnnotationFilesQueue(index, files));
      }}
      selectedAttachments={selectedAdditionalAttachments}
    />
  );
};
