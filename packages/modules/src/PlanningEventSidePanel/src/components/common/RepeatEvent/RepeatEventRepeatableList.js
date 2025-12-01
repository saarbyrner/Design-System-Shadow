// @flow
import { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';

import i18n from '@kitman/common/src/utils/i18n';
import {
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  CircularProgress,
} from '@kitman/playbook/components';
import getRecurrencePreferences, {
  type RecurrencePreferencesOptions,
} from '@kitman/services/src/services/planning/getRecurrencePreferences';
import colors from '@kitman/common/src/variables/colors';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import { type CalendarEventsPanelMode } from '@kitman/modules/src/CalendarPage/src/components/CalendarEventsPanel/types';

type Props = {
  selectedRecurrencePreferences: ?RecurrencePreferencesOptions,
  updateRecurrencePreferences: (
    recurrencePreferences: RecurrencePreferencesOptions
  ) => void,
  eventDate: Date,
  hasAthletes: boolean,
  panelMode: CalendarEventsPanelMode,
};

const RepeatEventRepeatableList = ({
  selectedRecurrencePreferences,
  updateRecurrencePreferences,
  eventDate,
  hasAthletes,
  panelMode,
}: Props) => {
  const checkIsMounted = useIsMountedCheck();
  const initialEventDate = useRef(moment(eventDate).toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedRepeatableItems, setCheckedRepeatableItems] =
    useState<RecurrencePreferencesOptions>([]);
  const [recurrencePreferencesResponse, setRecurrencePreferencesResponse] =
    useState<RecurrencePreferencesOptions>([]);

  const handleChecked = (option) => {
    let currentCheckedRepeatableItems = checkedRepeatableItems;

    if (
      currentCheckedRepeatableItems.some(
        (checkedItem) => checkedItem.id === option.id
      )
    ) {
      currentCheckedRepeatableItems = checkedRepeatableItems.filter(
        (checked) => checked.id !== option.id
      );
    } else {
      currentCheckedRepeatableItems = [
        ...currentCheckedRepeatableItems,
        option,
      ];
    }

    setCheckedRepeatableItems(currentCheckedRepeatableItems);
    updateRecurrencePreferences(currentCheckedRepeatableItems);
  };

  const shouldDisableCheckbox = (permaId: string) => {
    switch (permaId) {
      case 'surface_type':
        return window.getFlag('surface-type-mandatory-sessions');
      case 'athletes':
        return !hasAthletes && panelMode === 'CREATE';
      default:
        return false;
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const { preferences } = await getRecurrencePreferences();
      setRecurrencePreferencesResponse(preferences);
      const recurrencePreferences =
        selectedRecurrencePreferences ?? preferences;
      setCheckedRepeatableItems(recurrencePreferences);
      updateRecurrencePreferences(recurrencePreferences);
      // eslint-disable-next-line no-empty
    } catch {}
    setIsLoading(false);
  };

  // This handles changes to the event when side panel is open,
  // and another edit of event is triggered from EventTooltip
  useEffect(() => {
    const eventDateMoment = eventDate.toISOString();
    if (eventDateMoment !== initialEventDate.current) {
      initialEventDate.current = eventDateMoment;
      getData();
    }
  }, [eventDate]);

  useEffect(() => {
    if (checkIsMounted()) {
      getData();
    }
  }, []);

  if (recurrencePreferencesResponse?.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ borderLeft: `4px solid ${colors.neutral_400}`, margin: '12px 0px' }}
    >
      <List
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          padding: 0,
        }}
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              lineHeight: 'initial',
              padding: '0px 10px 10px',
              color: colors.grey_100,
            }}
          >
            {i18n.t('Choose the fields to copy for all repeated sessions')}
          </ListSubheader>
        }
      >
        {recurrencePreferencesResponse?.map(
          ({ id, preference_name: preferenceName, perma_id: permaId }) => (
            <ListItem
              sx={{ width: '50%', padding: 0, color: colors.grey_300 }}
              key={id}
            >
              <ListItemButton
                dense
                onClick={() =>
                  handleChecked({
                    id,
                    preference_name: preferenceName,
                    perma_id: permaId,
                  })
                }
                disabled={shouldDisableCheckbox(permaId)}
              >
                <ListItemIcon sx={{ minWidth: 'initial' }}>
                  <Checkbox
                    edge="start"
                    checked={checkedRepeatableItems.some(
                      (checkedItem) => checkedItem.id === id
                    )}
                    sx={{ padding: '4px' }}
                  />
                </ListItemIcon>
                <ListItemText id={1} primary={preferenceName} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
};

export default RepeatEventRepeatableList;
