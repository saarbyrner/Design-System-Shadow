// @flow
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AnnotationMedicalTypes } from '@kitman/services/src/services/medical/getAnnotationMedicalTypes';
import type { SelectOption } from '@kitman/components/src/types';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { AddMedicalNoteSidePanelTranslated as AddMedicalNoteSidePanel } from '../components/AddMedicalNoteSidePanel';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';
import type { StaffUserSelectOption } from '../types/medical/StaffUsers';
import {
  closeAddMedicalNotePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import {
  useGetAnnotationMedicalTypesQuery,
  useGetSquadAthletesQuery,
  useGetStaffUsersQuery,
} from '../redux/services/medical';

export const getAnnotationTypes = (
  annotationTypes: AnnotationMedicalTypes,
  customAnnotationTypesFilter: ?Function
): Array<SelectOption> => {
  let filtered;

  if (customAnnotationTypesFilter) {
    filtered = annotationTypes.filter(customAnnotationTypesFilter);
  } else if (window.featureFlags['rehab-note']) {
    filtered = annotationTypes; // No filter
  } else {
    filtered = annotationTypes.filter(({ type }) => {
      return type !== 'OrganisationAnnotationTypes::RehabSession';
    });
  }

  const output = filtered.filter(
    (annotationType) =>
      annotationType.creation_allowed &&
      annotationType.type !== 'OrganisationAnnotationTypes::Document'
  );

  return output.map(({ id, name, type }) => ({
    value: id,
    label: name,
    type,
  }));
};

const AddMedicalNoteSidePanelContainer = (props: any) => {
  const dispatch = useDispatch();
  const [athleteId, setAthleteId] = useState(props.athleteId || null);
  const isOpen = useSelector((state) => state.addMedicalNotePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addMedicalNotePanel.initialInfo.isAthleteSelectable
  );
  const isDuplicatingNote = useSelector(
    (state) => state.addMedicalNotePanel.initialInfo.isDuplicatingNote
  );
  const duplicateNote = useSelector(
    (state) => state.addMedicalNotePanel.initialInfo?.duplicateNote || null
  );
  const {
    data: annotationTypes = [],
    error: annotationTypesError,
    isLoading: isAnnotationTypesLoading,
  } = useGetAnnotationMedicalTypesQuery(null, { skip: !isOpen });

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const {
    data: documentNoteCategories = [],
    error: documentNoteCategoriesError,
    isLoading: isDocumentNoteCategoriesLoading,
  } = useGetDocumentNoteCategoriesQuery(null, { skip: !isOpen });

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: isStaffUsersLoading,
  } = useGetStaffUsersQuery(null, { skip: !isOpen });

  const { data: currentUser } = useGetCurrentUserQuery(null, {
    skip: !isOpen,
  });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname, firstname, lastname }): StaffUserSelectOption => ({
      value: id,
      label: fullname,
      firstname,
      lastname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (
      annotationTypesError ||
      squadAthletesError ||
      documentNoteCategoriesError ||
      staffUsersError
    ) {
      return 'FAILURE';
    }
    if (
      isAnnotationTypesLoading ||
      isSquadAthletesLoading ||
      isDocumentNoteCategoriesLoading ||
      isStaffUsersLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <AthleteConstraints athleteId={athleteId}>
      {({ organisationStatus }) => (
        <AddMedicalNoteSidePanel
          {...props}
          isOpen={isOpen}
          athleteConstraints={{
            organisationStatus,
          }}
          isAthleteSelectable={isAthleteSelectable}
          isDuplicatingNote={isDuplicatingNote}
          duplicateNote={duplicateNote}
          currentUser={currentUser}
          staffUsers={sortedStaffUsers}
          onSaveNote={() => {
            dispatch(closeAddMedicalNotePanel());
            props.onSaveNote?.();
          }}
          onClose={() => {
            dispatch(closeAddMedicalNotePanel());
            props.oncloseAddMedicalNotePanel?.();
          }}
          annotationTypes={getAnnotationTypes(
            annotationTypes,
            props.customAnnotationTypesFilter
          )}
          documentCategoryOptions={documentNoteCategories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          squadAthletes={athletesSelectOptions}
          defaultAnnotationType={
            annotationTypes.find(({ type }) =>
              props.defaultAnnotationType
                ? type === props.defaultAnnotationType
                : type === 'OrganisationAnnotationTypes::Medical'
            )?.id || null
          }
          onFileUploadStart={(fileName, fileSize, fileId) =>
            dispatch(
              addToast({
                title: fileName,
                description: fileSize,
                status: 'LOADING',
                id: fileId,
              })
            )
          }
          onFileUploadSuccess={(fileId) => {
            dispatch(updateToast(fileId, { status: 'SUCCESS' }));
            setTimeout(() => dispatch(removeToast(fileId)), 5000);
          }}
          onFileUploadFailure={(fileId) =>
            dispatch(updateToast(fileId, { status: 'ERROR' }))
          }
          initialDataRequestStatus={getInitialDataRequestStatus()}
          setAthleteId={setAthleteId}
        />
      )}
    </AthleteConstraints>
  );
};

export default AddMedicalNoteSidePanelContainer;
