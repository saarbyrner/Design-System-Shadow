// @flow
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { UPDATE_DISCIPLINARY_ISSUE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { useFetchDisciplineCompetitionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import {
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import {
  FormControl,
  Grid,
  Select,
  Checkbox,
  MenuItem,
  InputLabel,
  ListItemText,
} from '@kitman/playbook/components';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';

type Props = {
  label: string,
  selectedDisciplineCompetitions: Array<number>,
  onChange: (competitionIds: Array<number>) => void,
};

const DisciplineCompetitionDropdown = (props: I18nProps<Props>) => {
  const { label, selectedDisciplineCompetitions, onChange } = props;
  const panelMode = useSelector(getDisciplinaryIssueMode);
  const issue = useSelector(getCurrentDisciplinaryIssue);
  const currentSquad = useSelector(getActiveSquad());
  const divisionId = currentSquad?.division[0]?.id;
  const {
    data: disciplineCompetitions = [],
    isFetching: areCompetitionsFetching,
  } = useFetchDisciplineCompetitionsQuery({ divisionIds: divisionId });

  // Handle changes to the select dropdown
  const handleSelectAllChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    // If 'all' is selected, toggle select all, which is the first option
    if (value.includes('all')) {
      // Toggle select all
      if (
        selectedDisciplineCompetitions.length === disciplineCompetitions.length
      ) {
        // All were selected, so unselect all
        onChange([]);
      } else {
        // Not all were selected, so select all
        onChange(disciplineCompetitions.map((competition) => competition.id));
      }
    } else {
      onChange(value);
    }
  };

  // Determine if all competitions are selected
  const isAllSelected =
    disciplineCompetitions.length > 0 &&
    selectedDisciplineCompetitions.length === disciplineCompetitions.length;

  useEffect(() => {
    // If in update mode and no competitions are selected, select all competitions by default
    if (
      panelMode === UPDATE_DISCIPLINARY_ISSUE &&
      Array.isArray(issue?.competition_ids) &&
      issue.competition_ids.length === 0
    ) {
      onChange(disciplineCompetitions.map((competition) => competition.id));
    }
  }, []);

  return (
    <Grid sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel
          id="discipline-competition-label"
          data-testid="discipline-competition-label"
        >
          {label}
        </InputLabel>
        <Select
          labelId="discipline-competition-label"
          data-testid="discipline-competition-select"
          multiple
          value={selectedDisciplineCompetitions}
          onChange={handleSelectAllChange}
          renderValue={(selected) =>
            disciplineCompetitions?.length &&
            disciplineCompetitions
              .filter((option) => selected?.includes(option.id))
              .map((option) => option.name)
              .join(', ')
          }
          isLoading={areCompetitionsFetching}
        >
          <MenuItem value="all" sx={{ pl: 0 }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={
                selectedDisciplineCompetitions?.length > 0 && !isAllSelected
              }
            />
            <ListItemText primary={props.t('Select all')} />
          </MenuItem>

          {/* Individual discipline competition options with checkbox and text indented */}
          {disciplineCompetitions?.map((option) => (
            <MenuItem key={option.id} value={option.id} sx={{ pl: 2 }}>
              <Checkbox
                checked={selectedDisciplineCompetitions.includes(option.id)}
              />
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default DisciplineCompetitionDropdown;
export const DisciplineCompetitionDropdownTranslated = withNamespaces()(
  DisciplineCompetitionDropdown
);
