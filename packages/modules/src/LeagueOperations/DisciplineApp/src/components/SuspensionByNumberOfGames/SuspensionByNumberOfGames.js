// @flow
import { useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';

import {
  Box,
  TextField,
  DateTimePicker,
  Grid2 as Grid,
  FormControl,
  Autocomplete,
  FormHelperText,
} from '@kitman/playbook/components';
import type { CreateDisciplinaryIssueParams } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { getUserToBeDisciplined } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import useNextGameDisciplineIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue';

interface SquadOption {
  value: number;
  label: string;
}

const SuspensionByNumberOfGames = ({
  onIssueChange,
  locale,
  issue,
}: {
  onIssueChange: (field: string, value: any) => void,
  locale?: string,
  issue: CreateDisciplinaryIssueParams,
}) => {
  const selectedUser = useSelector(getUserToBeDisciplined);
  const { isNextGameValid } = useNextGameDisciplineIssue();

  // Map the user's squads to and format suitable for the Autocomplete component
  const mapOrganizations = (): SquadOption[] => {
    if (selectedUser?.squads && selectedUser.squads.length > 0) {
      return selectedUser.squads.map((squad: { id: number, name: string }) => ({
        value: squad.id,
        label: squad.name,
      }));
    }
    return [];
  };
  // Function to find the selected squad based on the issue's squad_id
  const findSelectedSquad = () => {
    const squads = mapOrganizations();
    if (issue.squad_id) {
      const selectedSquad = squads.find(
        (squad) => squad.value === issue.squad_id
      );
      return selectedSquad;
    }
    return null;
  };

  const handleDateChange = (newValue: Object) => {
    onIssueChange('start_date', newValue ? newValue.toISOString() : null);
  };

  const handleSquadChange = (event: Object, newValue: SquadOption | null) => {
    onIssueChange('squad_id', newValue ? newValue.value : null);
  };

  const handleNumberOfGamesChange = (
    event: Object,
    newValue: number | null
  ) => {
    onIssueChange('number_of_games', newValue ? parseInt(newValue, 10) : null);
  };
  // creates an array of numbers from 1 to 10
  const numberOfGamesOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Grid xs={12}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ flex: 1.5, minWidth: 0 }}>
          <Autocomplete
            id="number-of-games-autocomplete"
            options={numberOfGamesOptions}
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) =>
              option === parseInt(value, 10)
            }
            value={issue.number_of_games ? issue.number_of_games : null}
            onChange={handleNumberOfGamesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={i18n.t('Number of games')}
                fullWidth
                error={isNextGameValid}
              />
            )}
          />
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label={i18n.t('Start date and time')}
            value={issue.start_date ? moment(issue.start_date) : null}
            onChange={handleDateChange}
            format={
              locale === 'en-US' ? 'MM/DD/YYYY  HH:mm' : 'DD/MM/YYYY  HH:mm'
            }
            slotProps={{
              textField: {
                fullWidth: true,
                sx: { flex: 2 },
              },
              field: {
                clearable: true,
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      {isNextGameValid && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <KitmanIcon
            sx={{ color: 'error.main', fontSize: 20, mr: 0.5 }}
            name={KITMAN_ICON_NAMES.Error}
          />
          <FormHelperText
            sx={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              color: 'error.main',
            }}
          >
            {i18n.t('Suspension exceeds remaining games')}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <Autocomplete
            id="squads-autocomplete"
            options={mapOrganizations()}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            value={findSelectedSquad() || null}
            onChange={handleSquadChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={i18n.t('Team to apply suspension')}
                fullWidth
              />
            )}
          />
          <FormHelperText sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {i18n.t(
              'Chose the team the user will be suspended from (ie-if suspended for U13 games, chose U13)'
            )}
          </FormHelperText>
        </FormControl>
      </Box>
    </Grid>
  );
};
export default SuspensionByNumberOfGames;
