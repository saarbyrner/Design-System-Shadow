// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { ViewType } from '@kitman/modules/src/Medical/shared/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import EditViewContainer from './EditViewContainer';
import { openAddMedicalNotePanel } from '../../../../redux/actions';
import { PresentationViewTranslated as PresentationView } from './PresentationView';
import { ArchiveNoteContainerTranslated as ArchiveNoteContainer } from '../ArchiveNoteModal/ArchiveNoteContainer';

type Props = {
  currentUser?: CurrentUserData,
  athleteId: ?number,
  isLoading: boolean,
  note: MedicalNote,
  onReloadData: Function,
  hasActions: boolean,
  isPastAthlete?: boolean,
  athleteData?: AthleteData,
};

const MedicalNoteCard = (props: Props) => {
  const { permissions } = usePermissions();
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);

  return viewType === 'PRESENTATION' ? (
    <>
      <PresentationView
        currentUser={props.currentUser}
        withAvatar={!!props.athleteId}
        note={props.note}
        hasActions={props.hasActions}
        isLoading={props.isLoading}
        onSetViewType={(val) => setViewType(val)}
        onArchiveNote={() => setArchiveModalOpen(true)}
        onDuplicateNote={() =>
          dispatch(
            openAddMedicalNotePanel({
              isDuplicatingNote: true,
              isAthleteSelectable: true,
              duplicateNote: props.note,
            })
          )
        }
        isPastAthlete={props.isPastAthlete}
        athleteData={props.athleteData}
      />

      {archiveModalOpen && permissions.medical.notes.canArchive && (
        <ArchiveNoteContainer
          isOpen={archiveModalOpen}
          note={props.note}
          onClose={() => setArchiveModalOpen(false)}
          onPressEscape={() => setArchiveModalOpen(false)}
          onReloadData={props.onReloadData}
        />
      )}
    </>
  ) : (
    <EditViewContainer
      currentUser={props.currentUser}
      athleteId={props.athleteId}
      withAvatar={!!props.athleteId}
      note={props.note}
      isLoading={props.isLoading}
      viewType={viewType}
      onSetViewType={(val) => setViewType(val)}
      onReloadData={props.onReloadData}
      isPastAthlete={props?.isPastAthlete || false}
      athleteData={props.athleteData}
    />
  );
};

export const MedicalNoteCardTranslated: ComponentType<Props> =
  withNamespaces()(MedicalNoteCard);
export default MedicalNoteCard;
