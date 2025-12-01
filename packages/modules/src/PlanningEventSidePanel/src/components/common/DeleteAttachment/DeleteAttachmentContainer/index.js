// @flow
import deleteEventAttachment from '@kitman/services/src/services/planning/deleteEventAttachment';
import deleteEventLink from '@kitman/services/src/services/planning/deleteEventLink';
import { DeleteAttachmentModalTranslated as DeleteAttachmentModal } from '@kitman/modules/src/DeleteAttachmentModal/index';
import { ATTACHMENT_DELETE_TYPE } from '@kitman/modules/src/PlanningEventSidePanel/src/components/utils/enum-likes';
import type { AttachmentDeleteType } from '@kitman/modules/src/PlanningEventSidePanel/src/components/utils/types';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

type Props = {
  event: Object,
  idToDelete: number,
  titleToDelete: string,
  deleteType?: AttachmentDeleteType,
  isOpen: boolean,
  onClose: Function,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDeleteStart: Function,
  onDeleteSuccess: Function,
  onDeleteFailure: Function,
};

const DeleteAttachmentModalContainer = (props: Props) => {
  const onDeleteAttachment = (): Promise<void> => {
    props.onDeleteStart(props.idToDelete, props.titleToDelete);

    return deleteEventAttachment(props.event.id, props.idToDelete)
      .then((data) => {
        const currentFiles = props.event.attachments?.filter(
          ({ id }) => id !== data.id
        );
        props.onUpdateEventDetails({
          attachments: currentFiles,
        });
        props.onDeleteSuccess(props.idToDelete, props.titleToDelete);
        props.onClose();
      })
      .catch(() => {
        props.onDeleteFailure(props.idToDelete, props.titleToDelete);
        props.onClose();
      });
  };

  const onDeleteAttachedLink = (): Promise<void> => {
    props.onDeleteStart(props.idToDelete, props.titleToDelete);

    return deleteEventLink(props.event.id, props.idToDelete)
      .then((data) => {
        const currentLinks = props.event.attached_links?.filter(
          ({ id }) => id !== data.id
        );
        props.onUpdateEventDetails({
          attached_links: currentLinks,
        });
        props.onDeleteSuccess(props.idToDelete, props.titleToDelete);
        props.onClose();
      })
      .catch(() => {
        props.onDeleteFailure(props.idToDelete, props.titleToDelete);
        props.onClose();
      });
  };

  return (
    <DeleteAttachmentModal
      {...props}
      attachmentTitle={props.titleToDelete}
      onDeleteAttachment={
        props.deleteType === ATTACHMENT_DELETE_TYPE.ATTACHMENT
          ? onDeleteAttachment
          : onDeleteAttachedLink
      }
    />
  );
};

export default DeleteAttachmentModalContainer;
