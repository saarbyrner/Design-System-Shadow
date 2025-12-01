// @flow
import {
  Skeleton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Checkbox,
} from '@kitman/playbook/components';
import { unwrapResult } from '@reduxjs/toolkit';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Dispatch } from 'redux';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { UpdateFormAssignmentsRequestBody } from '@kitman/services/src/services/formTemplates/api/formTemplates/updateFormAssignments';

type Translations = {
  typeToSearch: string,
  noAthletesFound: string,
};

type ToastOptions = {
  translatedTitle: string,
  translatedDescription?: string,
};

export const renderAthleteList = (
  areAthletesFetching: boolean,
  inputValue: string,
  allAthletes: Array<Athlete>,
  selectedAthleteIds: Array<number>,
  handleToggle: (athlete: Athlete) => void,
  translations: Translations
) => {
  if (areAthletesFetching) {
    return <Skeleton variant="rectangular" height={200} />;
  }
  if (inputValue.length < 3) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ p: 2, textAlign: 'center' }}
      >
        {translations.typeToSearch}
      </Typography>
    );
  }
  if (allAthletes.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ p: 2, textAlign: 'center' }}
      >
        {translations.noAthletesFound}
      </Typography>
    );
  }
  return (
    <List
      dense
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      {allAthletes.map((athlete) => {
        const labelId = `checkbox-list-label-${athlete.id}`;
        const isSelected = selectedAthleteIds.includes(athlete.id);

        return (
          <ListItem key={athlete.id} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => handleToggle(athlete)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={isSelected}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <Avatar
                src={athlete.avatar_url}
                sx={{ width: 32, height: 32, mr: 1.5 }}
              />
              <ListItemText
                id={labelId}
                primary={athlete.fullname}
                secondary={athlete.position}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

type FormAssignmentsPayload = {
  athleteIdsToAdd: Array<number>,
  athleteIdsToRemove: Array<number>,
  freeAgentIds: Array<number>,
};

export const handleToggle = (
  athlete: Athlete,
  selectedAthleteIds: Array<number>,
  selectedAthletes: Array<Athlete>,
  setSelectedAthleteIds: (ids: Array<number>) => void,
  setSelectedAthletes: (athletes: Array<Athlete>) => void,
  freeAgentIds: Array<number>,
  dispatch: Dispatch<any>,
  setFormAssignments: (payload: FormAssignmentsPayload) => void
) => {
  const athleteId = athlete.id;
  const currentIndex = selectedAthleteIds.indexOf(athleteId);
  const newSelectedAthleteIds = [...selectedAthleteIds];
  const newSelectedAthletes = [...selectedAthletes];

  if (currentIndex === -1) {
    newSelectedAthleteIds.push(athleteId);
    newSelectedAthletes.push(athlete);
  } else {
    newSelectedAthleteIds.splice(currentIndex, 1);
    const athleteIndex = newSelectedAthletes.findIndex(
      (a) => a.id === athleteId
    );
    if (athleteIndex > -1) {
      newSelectedAthletes.splice(athleteIndex, 1);
    }
  }

  setSelectedAthleteIds(newSelectedAthleteIds);
  setSelectedAthletes(newSelectedAthletes);

  const idsToAdd = newSelectedAthleteIds.filter(
    (id) => !freeAgentIds.includes(id)
  );
  const idsToRemove = freeAgentIds.filter(
    (id) => !newSelectedAthleteIds.includes(id)
  );

  dispatch(
    setFormAssignments({
      athleteIdsToAdd: idsToAdd,
      athleteIdsToRemove: idsToRemove,
      freeAgentIds,
    })
  );
};

export const handleSaveClick = async (
  formId: number,
  athleteIdsToAdd: Array<number>,
  athleteIdsToRemove: Array<number>,
  updateFormAssignments: ReduxMutation<
    { formId: number, requestBody: UpdateFormAssignmentsRequestBody },
    void
  >,
  showSuccessToast: (options: ToastOptions) => void,
  showErrorToast: (options: ToastOptions) => void,
  closeDrawer: () => void,
  updateAssignmentsSuccessMessage: string,
  updateAssignmentsErrorMessage: string
) => {
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
