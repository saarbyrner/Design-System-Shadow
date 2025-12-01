// @flow
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { Drawer, Divider, Button, Skeleton } from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import {
  useFetchFormAssignmentsQuery,
  useUpdateFormAssignmentsMutation,
} from '@kitman/services/src/services/formTemplates';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { UpdateFormAssignmentsRequestBody } from '@kitman/services/src/services/formTemplates/api/formTemplates/updateFormAssignments';
import { SquadSelectTranslated as SquadSelect } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel/components/SquadSelect';
import {
  getIsAssignAthletesDrawerOpen,
  getSelectedFormId,
  getFormAssignments,
} from '../../redux/selectors/formTemplateSelectors';
import {
  toggleIsAssignAthletesDrawerOpen,
  setSelectedFormId,
  setFormAssignments,
} from '../../redux/slices/formTemplatesSlice';
import { getDrawerTranslations } from './utils/helpers';

const AssignAthletesDrawer = () => {
  const dispatch = useDispatch();
  const [selectedAthleteIds, setSelectedAthleteIds] = useState([]);
  const isDrawerOpen = useSelector(getIsAssignAthletesDrawerOpen);
  const { athleteIds, athleteIdsToAdd, athleteIdsToRemove } =
    useSelector(getFormAssignments);
  const theme = useTheme();
  const formId = useSelector(getSelectedFormId);
  const currentOrganisation = useSelector(getOrganisation());
  const currentOrgId = currentOrganisation?.id;
  const {
    title,
    saveButton,
    athletes,
    updateAssignmentsErrorMessage,
    updateAssignmentsSuccessMessage,
  } = getDrawerTranslations();

  const closeDrawer = () => {
    dispatch(toggleIsAssignAthletesDrawerOpen());
    dispatch(setSelectedFormId(null));
    setSelectedAthleteIds([]);

    dispatch(
      setFormAssignments({
        athleteIds: [],
        athleteIdsToAdd: [],
        athleteIdsToRemove: [],
      })
    );
  };

  const {
    data = {},
    isLoading: isFormAssignmentDataLoading,
  }: {
    data: { athlete_ids: Array<number>, athletes: Array<Athlete> },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useFetchFormAssignmentsQuery(formId, { skip: !formId || !isDrawerOpen });

  const [
    updateFormAssignments,
    { isLoading: isUpdateFormAssignmentsLoading },
  ]: [
    ReduxMutation<
      { formId: number, requestBody: UpdateFormAssignmentsRequestBody },
      void
    >,
    { isLoading: boolean }
  ] = useUpdateFormAssignmentsMutation();

  const SAVE_FORM_ASSIGNMENTS_ERROR_TOAST_ID =
    'SAVE_FORM_ASSIGNMENTS_ERROR_TOAST_ID';
  const SAVE_FORM_ASSIGNMENTS_SUCCESS_TOAST_ID =
    'SAVE_FORM_ASSIGNMENTS_SUCCESS_TOAST_ID';

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: SAVE_FORM_ASSIGNMENTS_ERROR_TOAST_ID,
    successToastId: SAVE_FORM_ASSIGNMENTS_SUCCESS_TOAST_ID,
  });

  useEffect(() => {
    // Athlete is assigned the form and is part of the current organisation
    if (data.athlete_ids && data.athletes && currentOrgId) {
      const selectedAthletes = (data.athletes || []).filter((athlete) =>
        (athlete.organisations || []).some((org) => org.id === currentOrgId)
      );
      const selectedIds = selectedAthletes.map((athlete) => athlete.id);

      dispatch(
        setFormAssignments({
          athleteIds: selectedIds,
          athleteIdsToAdd: [],
          athleteIdsToRemove: [],
        })
      );

      setSelectedAthleteIds(selectedIds);
    }
  }, [data, dispatch, currentOrgId, formId]);

  const handleSaveClick = async () => {
    try {
      unwrapResult(
        await updateFormAssignments({
          formId,
          requestBody: {
            athlete_ids_to_add: athleteIdsToAdd,
            athlete_ids_to_remove: athleteIdsToRemove,
          },
        })
      );

      showSuccessToast({
        translatedTitle: updateAssignmentsSuccessMessage,
      });

      closeDrawer();
    } catch {
      showErrorToast({
        translatedTitle: updateAssignmentsErrorMessage,
      });
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      hideBackdrop
      sx={drawerMixin({ theme, isOpen: isDrawerOpen, drawerWidth: 455 })}
      anchor="right"
    >
      <DrawerLayout.Title title={title} onClose={closeDrawer} />
      <Divider />
      <DrawerLayout.Content>
        {isFormAssignmentDataLoading ? (
          <>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </>
        ) : (
          <SquadSelect
            value={selectedAthleteIds}
            label={athletes}
            onUpdate={(newValue) => {
              const newSelectedAthleteIds = newValue.ids;

              const idsToAdd = newSelectedAthleteIds?.filter(
                (id) => !athleteIds.includes(id)
              );
              const idsToRemove = athleteIds?.filter(
                (id) => !newSelectedAthleteIds?.includes(id)
              );

              setSelectedAthleteIds(newSelectedAthleteIds);

              dispatch(
                setFormAssignments({
                  athleteIdsToAdd: idsToAdd,
                  athleteIdsToRemove: idsToRemove,
                  athleteIds,
                })
              );
            }}
          />
        )}
      </DrawerLayout.Content>
      <Divider />
      <DrawerLayout.Actions>
        <Button
          disabled={
            isFormAssignmentDataLoading || isUpdateFormAssignmentsLoading
          }
          onClick={handleSaveClick}
        >
          {saveButton}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default AssignAthletesDrawer;
