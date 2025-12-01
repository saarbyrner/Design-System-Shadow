// @flow
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  Button,
  DatePicker,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getIsNewUserFormPanelOpen,
  getUnregisteredPlayer,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import {
  onToggleNewUserFormPanel,
  onSetUnregisteredPlayer,
  onSetUnregisteredPlayers,
  onResetUnregisteredPlayerForm,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import ManageSectionLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ManageSectionLayout';
import type {
  UnregisteredPlayer,
  VenueType,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getMatchMonitorTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getMatchMonitorData';

type Props = {
  homeTeam: string,
  awayTeam: string,
};

const AddNewPlayerPanel = (props: I18nProps<Props>) => {
  const { t, homeTeam, awayTeam } = props;
  const dispatch = useDispatch();
  const isOpen = useSelector(getIsNewUserFormPanelOpen);
  const theme = useTheme();
  const unregisteredPlayer: ?UnregisteredPlayer = useSelector(
    getUnregisteredPlayer
  );
  const { trackEvent } = useEventTracking();
  const [selectedTeam, setSelectedTeam] = useState<VenueType>('home');
  const dropdownOptions = [
    {
      label: homeTeam,
      value: 'home',
    },
    {
      label: awayTeam,
      value: 'away',
    },
  ];

  const isFormComplete =
    unregisteredPlayer &&
    unregisteredPlayer.firstname &&
    unregisteredPlayer.lastname &&
    unregisteredPlayer.date_of_birth &&
    moment(unregisteredPlayer.date_of_birth).isValid() &&
    unregisteredPlayer.registration_status &&
    unregisteredPlayer.notes;

  const handleOnClose = () => {
    dispatch(onResetUnregisteredPlayerForm());
    dispatch(onToggleNewUserFormPanel({ isOpen: false }));
  };

  const onUnregisteredPlayerChange = (
    key: string,
    value: ?UnregisteredPlayer
  ) => {
    if (key === 'registration_status') {
      trackEvent(
        leagueOperationsEventNames.registrationTypeToggled,
        getMatchMonitorTrackingData({
          product: 'league-ops',
          productArea: 'match-monitor-report',
          feature: 'match-monitor',
        })
      );
    }
    dispatch(onSetUnregisteredPlayer({ [(key: string)]: value }));
  };

  const onSaveUnregisteredPlayer = () => {
    dispatch(
      onSetUnregisteredPlayers({
        ...unregisteredPlayer,
        venue_type: selectedTeam,
      })
    );
    handleOnClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedTeam('home');
    }
  }, [isOpen]);

  const renderContent = () => {
    if (!isOpen) return null;

    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={t('Add New Player')}
          onClose={handleOnClose}
        />
        <ManageSectionLayout.Content>
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                label={t('First name')}
                value={unregisteredPlayer?.firstname}
                fullWidth
                onChange={(event) => {
                  onUnregisteredPlayerChange('firstname', event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('Last name')}
                value={unregisteredPlayer?.lastname}
                fullWidth
                onChange={(event) => {
                  onUnregisteredPlayerChange('lastname', event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label={t('Date of birth')}
                value={
                  unregisteredPlayer?.date_of_birth &&
                  moment(
                    unregisteredPlayer.date_of_birth,
                    DateFormatter.dateTransferFormat
                  )
                }
                sx={{ width: '100%' }}
                onChange={(date) => {
                  onUnregisteredPlayerChange(
                    'date_of_birth',
                    date ? date.format(DateFormatter.dateTransferFormat) : null
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="choose-team-select-label">
                  {t('Club')}
                </InputLabel>
                <Select
                  labelId="choose-team-select-label"
                  id="chose-team-select"
                  value={selectedTeam}
                  label={t('Club')}
                  onChange={({ target }) => {
                    setSelectedTeam(target.value);
                  }}
                >
                  {dropdownOptions.map(({ value, label }) => (
                    <MenuItem value={value} key={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel
                  id="radio-buttons-registration-type-label"
                  sx={{ marginBottom: 0 }}
                >
                  {t('Registration type')}
                </FormLabel>
                <RadioGroup
                  value={unregisteredPlayer?.registration_status}
                  row
                  aria-labelledby="radio-buttons-registration-type-label"
                  name="row-radio-buttons-group"
                  onChange={(event) => {
                    onUnregisteredPlayerChange(
                      'registration_status',
                      event.target.value
                    );
                  }}
                >
                  <FormControlLabel
                    value="registered"
                    control={<Radio />}
                    label={t('Registered')}
                    sx={{ marginBottom: 0 }}
                  />
                  <FormControlLabel
                    value="trialist"
                    control={<Radio />}
                    label={t('Trialist')}
                    sx={{ marginBottom: 0 }}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('Notes')}
                value={unregisteredPlayer?.notes}
                fullWidth
                inputProps={{
                  maxLength: 100,
                }}
                helperText={
                  unregisteredPlayer?.notes &&
                  unregisteredPlayer.notes.length === 100 &&
                  props.t('Maximum of 100 characters allowed.')
                }
                error={
                  unregisteredPlayer?.notes &&
                  unregisteredPlayer.notes.length > 100
                }
                onChange={(event) => {
                  onUnregisteredPlayerChange('notes', event.target.value);
                }}
              />
            </Grid>
          </Grid>
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            width="100%"
          >
            <Button onClick={handleOnClose} color="secondary">
              {t('Cancel')}
            </Button>
            <Button
              onClick={onSaveUnregisteredPlayer}
              disabled={!isFormComplete}
            >
              {t('Save')}
            </Button>
          </Stack>
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleOnClose}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};
export default AddNewPlayerPanel;

export const AddNewPlayerPanelTranslated = withNamespaces()(AddNewPlayerPanel);
