// @flow
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  Divider,
  Button,
  Skeleton,
  TextField,
  Chip,
  Box,
} from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import {
  useFetchFormAssignmentsQuery,
  useUpdateFormAssignmentsMutation,
  useGetUnassignedAthletesQuery,
} from '@kitman/services/src/services/formTemplates';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { UpdateFormAssignmentsRequestBody } from '@kitman/services/src/services/formTemplates/api/formTemplates/updateFormAssignments';
import { useDebounceField } from '../../FormBuilder/hooks/useDebounceField';
import { MAX_SEARCH_LENGTH } from './utils/constants';
import {
  getIsAssignFreeAgentsDrawerOpen,
  getSelectedFormId,
  getFormAssignments,
} from '../../redux/selectors/formTemplateSelectors';
import {
  toggleIsAssignFreeAgentsDrawerOpen,
  setSelectedFormId,
  setFormAssignments,
} from '../../redux/slices/formTemplatesSlice';
import { getDrawerTranslations } from './utils/helpers';
import {
  renderAthleteList,
  handleToggle,
  handleSaveClick,
} from './utils/DrawerContent';

const AssignFreeAgentsDrawer = () => {
  const dispatch = useDispatch();
  const [selectedAthleteIds, setSelectedAthleteIds] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const isDrawerOpen = useSelector(getIsAssignFreeAgentsDrawerOpen);
  const { value: inputValue, onChange: handleInputChange } = useDebounceField({
    initialValue: isDrawerOpen ? '' : 'reset',
    onUpdate: setDebouncedSearchQuery,
  });
  const { freeAgentIds, athleteIdsToAdd, athleteIdsToRemove } =
    useSelector(getFormAssignments);
  const theme = useTheme();
  const formId = useSelector(getSelectedFormId);
  const {
    title,
    saveButton,
    athletes,
    updateAssignmentsErrorMessage,
    updateAssignmentsSuccessMessage,
    noAthletesFound,
    typeToSearch,
    searchFreeAgents,
  } = getDrawerTranslations();

  const closeDrawer = () => {
    dispatch(toggleIsAssignFreeAgentsDrawerOpen());
    dispatch(setSelectedFormId(null));
    setSelectedAthletes([]);
    setSelectedAthleteIds([]);
    setDebouncedSearchQuery('');

    dispatch(
      setFormAssignments({
        athleteIds: [],
        freeAgentIds: [],
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
  } = useFetchFormAssignmentsQuery(formId, {
    skip: !formId || !isDrawerOpen,
  });

  const { data: unassignedAthletesData, isFetching: areAthletesFetching } =
    useGetUnassignedAthletesQuery(
      { searchQuery: debouncedSearchQuery },
      { skip: debouncedSearchQuery.length < 3 }
    );

  const allAthletes: Array<Athlete> = useMemo(() => {
    if (!unassignedAthletesData?.athletes) {
      return [];
    }

    return unassignedAthletesData.athletes
      .map((athlete) => ({
        ...athlete,
      }))
      .sort((a, b) => a.fullname.localeCompare(b.fullname));
  }, [unassignedAthletesData]);

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
    errorToastOptions: {
      style: { zIndex: theme.zIndex.snackbar },
    },
  });

  useEffect(() => {
    // Athlete is assigned the form but their is marked as free agent
    if (formId && data.athlete_ids && data.athletes) {
      const freeAgents = (data.athletes || []).filter((athlete) =>
        (athlete.organisations || []).some((org) => org.free_agent === true)
      );
      const selectedFreeAgentIds = freeAgents.map((athlete) => athlete.id);

      dispatch(
        setFormAssignments({
          freeAgentIds: selectedFreeAgentIds,
          athleteIdsToAdd: [],
          athleteIdsToRemove: [],
        })
      );
      setSelectedAthleteIds(selectedFreeAgentIds);
      setSelectedAthletes(freeAgents);
    }
  }, [data, dispatch, formId]);

  const handleToggleWrapper = (athlete) => {
    handleToggle(
      athlete,
      selectedAthleteIds,
      selectedAthletes,
      setSelectedAthleteIds,
      setSelectedAthletes,
      freeAgentIds,
      dispatch,
      setFormAssignments
    );
  };

  const handleSaveClickWrapper = async () => {
    await handleSaveClick(
      formId,
      athleteIdsToAdd,
      athleteIdsToRemove,
      updateFormAssignments,
      showSuccessToast,
      showErrorToast,
      closeDrawer,
      updateAssignmentsSuccessMessage,
      updateAssignmentsErrorMessage
    );
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
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <TextField
              label={athletes}
              placeholder={searchFreeAgents}
              value={inputValue}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2, flexShrink: 0 }}
              inputProps={{ maxLength: MAX_SEARCH_LENGTH }}
            />
            {selectedAthletes.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  p: 0.75,
                  mb: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  maxHeight: '9.375rem',
                  minHeight: '2.4rem',
                  overflowY: 'auto',
                }}
              >
                {selectedAthletes.map((athlete) => (
                  <Chip
                    key={athlete.id}
                    label={athlete.fullname}
                    onDelete={() => handleToggleWrapper(athlete)}
                    size="small"
                  />
                ))}
              </Box>
            )}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {renderAthleteList(
                areAthletesFetching,
                inputValue,
                allAthletes,
                selectedAthleteIds,
                handleToggleWrapper,
                { typeToSearch, noAthletesFound }
              )}
            </Box>
          </Box>
        )}
      </DrawerLayout.Content>
      <Divider />
      <DrawerLayout.Actions>
        <Button
          disabled={
            isFormAssignmentDataLoading || isUpdateFormAssignmentsLoading
          }
          onClick={handleSaveClickWrapper}
        >
          {saveButton}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default AssignFreeAgentsDrawer;
