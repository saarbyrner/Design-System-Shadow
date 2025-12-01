// @flow
import { useState, useMemo, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment-timezone';
import {
  FormControl,
  Stack,
  Box,
  DateTimePicker,
  TimePicker,
  Autocomplete,
  TextField,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@kitman/playbook/components';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { useDispatch } from 'react-redux';
import { colors } from '@kitman/common/src/variables';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { officialRoleEnumLike } from '@kitman/modules/src/MatchDay/shared/constants';
import type {
  FixtureForm,
  Option,
} from '@kitman/modules/src/MatchDay/shared/types';
import DuplicateOfficialsAlert from '@kitman/modules/src/MatchDay/components/DuplicateOfficialsAlert';
import { useNewLeagueFixtureFormData } from '@kitman/modules/src/MatchDay/shared/hooks';
import type { SetState } from '@kitman/common/src/types/react';
import { useLazyGetClubSquadsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { Event } from '@kitman/common/src/types/Event';

import styles from './styles';

type Props = {
  hasDuplicateTeams?: boolean,
  form: FixtureForm,
  setForm: SetState<FixtureForm>,
  errors?: {
    [key: $Keys<FixtureForm>]: string | void,
  },
  event: Event | null,
};

const LOCATION_SEARCH_DEBOUNCE_MS = 400;

const NewLeagueFixtureForm = ({
  t,
  hasDuplicateTeams,
  form,
  setForm,
  errors = {},
  event,
}: I18nProps<Props>) => {
  const officialsIds = [
    form[officialRoleEnumLike.Referee],
    form[officialRoleEnumLike.AssistantReferee1],
    form[officialRoleEnumLike.AssistantReferee2],
    form[officialRoleEnumLike.FourthReferee],
    form[officialRoleEnumLike.Var],
    form[officialRoleEnumLike.Avar],
  ].filter(Number);

  const [locationSearchExpression, setLocationSearchExpression] = useState('');

  const debouncedLocationSearch = useDebouncedCallback((searchText) => {
    setLocationSearchExpression(searchText);
  }, LOCATION_SEARCH_DEBOUNCE_MS);

  const { preferences } = usePreferences();
  const shouldLoadOfficials =
    !!preferences?.league_game_officials || !!preferences?.enable_reserve_ar;
  const shouldLoadTvData = !!preferences?.league_game_tv;
  const shouldLoadMatchDirectors = !!preferences?.league_game_match_director;
  const shouldLoadNotificationsRecipients =
    !!preferences?.league_game_notification_recipient;

  const {
    competitions,
    clubs,
    officials,
    tvChannels,
    locations,
    tvContactsData,
    matchDirectors,
    notificationsRecipients,
    isFetchingLocations,
  } = useNewLeagueFixtureFormData({
    locationSearchExpression,
    shouldLoadOfficials,
    shouldLoadTvData,
    shouldLoadMatchDirectors,
    shouldLoadNotificationsRecipients,
  });

  const dispatch = useDispatch();

  const [refetchClubSquads] = useLazyGetClubSquadsQuery();
  const [homeSquads, setHomeSquads] = useState<Array<Option>>([]);
  const [awaySquads, setAwaySquads] = useState<Array<Option>>([]);

  const tvContacts: Array<Option> = useMemo(() => {
    return tvContactsData
      ?.filter((contact) => form.tvChannelIds?.includes(contact.tv_channel_id))
      .map(({ label, value }) => ({ label, value }));
  }, [form.tvChannelIds, tvContactsData]);

  const getRefetchedClubSquadOptions = async (orgId: number) => {
    try {
      const { data } = await refetchClubSquads(orgId);
      return defaultMapToOptions(data);
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: 'Squad fetch failed.',
        })
      );
    }
    return [];
  };

  // Fires off the initial fetch of squads if the form is in edit mode with the teams existing already
  useEffect(() => {
    if (form?.homeTeam) {
      getRefetchedClubSquadOptions(form.homeTeam).then((squads) =>
        setHomeSquads(squads)
      );
    }
    if (form?.awayTeam) {
      getRefetchedClubSquadOptions(form.awayTeam).then((squads) =>
        setAwaySquads(squads)
      );
    }
  }, []);

  useEffect(() => {
    if (event) {
      setLocationSearchExpression(event.event_location?.name ?? '');
    }
  }, [event]);

  const getOnChange = (name: string) => (e) => {
    // // NOTE: remove e.persist() if React version is 17+.
    e?.persist?.();
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const getOnChangeDateOrTime = (name: string) => (date: moment.Moment) => {
    setForm((prev) => ({ ...prev, [name]: date }));
  };

  const getOnChangeCheckbox = (name: string) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const handleAutoCompleteOnChange = async ({
    selectedValue,
    fieldName,
    multiple,
  }: {
    selectedValue: any,
    fieldName: string,
    multiple: boolean,
  }) => {
    // handles the team change and fetches the squads for the selected team
    if (['homeTeam', 'awayTeam'].includes(fieldName)) {
      const squadFieldName: string =
        fieldName === 'homeTeam' ? 'homeSquad' : 'awaySquad';
      const updatedForm = {
        ...form,
        [fieldName]: selectedValue?.value ?? null,
        [squadFieldName]: null,
      };
      // sets the team id first and removes the existing squad
      setForm(updatedForm);

      if (selectedValue.value) {
        const squadOptions = await getRefetchedClubSquadOptions(
          selectedValue?.value
        );
        if (fieldName === 'homeTeam') {
          setHomeSquads(squadOptions);
        } else {
          setAwaySquads(squadOptions);
        }

        // sets the updated squad default value fetched from the api
        setForm({
          ...updatedForm,
          [squadFieldName]: squadOptions[0]?.value,
        });
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [fieldName]: multiple
          ? selectedValue.map((item) => item.value)
          : selectedValue?.value ?? null,
      }));
    }
  };

  const renderAutocomplete = ({
    name,
    label,
    options,
    disabled,
    optional,
    multiple = false,
    checkbox = false,
    indent = false,
    useSearch = false,
    isLoading = false,
    setInputChange = undefined,
  }: {
    name: string,
    label: string,
    options: Array<Option>,
    disabled?: boolean,
    optional?: boolean,
    multiple?: boolean,
    checkbox?: boolean,
    indent?: boolean,
    useSearch?: boolean,
    isLoading?: boolean,
    setInputChange?: (value: string) => void,
  }) => {
    return (
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '6px',
          width: indent ? '93%' : '100%',
          alignSelf: 'flex-start',
        }}
      >
        <Autocomplete
          id={`${name.toLowerCase()}-autocomplete`}
          options={options}
          multiple={multiple}
          renderInput={(params) => <TextField {...params} label={label} />}
          renderTags={(value) => value.map((option) => option.label).join(', ')}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props}>
              {multiple && checkbox ? (
                <>
                  <Checkbox checked={selected} />
                  {option.label}
                </>
              ) : (
                option.label
              )}
            </MenuItem>
          )}
          freeSolo={useSearch}
          value={
            multiple
              ? options.filter((option) =>
                  form[name]?.includes(option.value)
                ) || []
              : options.find((option) => option.value === form[name]) || null
          }
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onInputChange={(_, newInputValue) => {
            setInputChange?.(newInputValue);
          }}
          onChange={async (_, selectedValue) => {
            await handleAutoCompleteOnChange({
              selectedValue,
              fieldName: name,
              multiple,
            });
          }}
          getOptionLabel={(option) => {
            return option.label ?? '';
          }}
          loading={isLoading}
          getOptionKey={(option) => option.value}
          clearOnBlur
          clearOnEscape
          disableClearable={false}
          disableCloseOnSelect={multiple}
          disabled={disabled}
        />
        {optional && <Box sx={styles.optionalField}>Optional</Box>}
      </FormControl>
    );
  };

  const hideFromClub = () => {
    return (
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '6px',
          width: '100%',
          alignSelf: 'flex-start',
        }}
      >
        <FormControlLabel
          sx={{
            whiteSpace: 'normal',
          }}
          control={
            <Checkbox
              onChange={getOnChangeCheckbox('visible')}
              checked={form.visible}
            />
          }
          label={t(
            "Hide from club view (if checked game won't show on club schedule)"
          )}
        />
      </FormControl>
    );
  };
  return (
    <Box>
      {preferences?.league_game_match_id && (
        <Stack gap={1} sx={{ marginBottom: '10px' }}>
          {/* competition / round */}
          <Box sx={styles.columns(1)}>
            <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                label={t('Match #')}
                value={form.matchId}
                onChange={getOnChange('matchId')}
                type="number"
              />
            </FormControl>
          </Box>
        </Stack>
      )}

      <Stack gap={2}>
        {/* competition / round */}
        <Box sx={styles.columns(2)}>
          {renderAutocomplete({
            name: 'competition',
            label: t('Competition'),
            options: competitions,
          })}
          <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              label={t('Match Day')}
              value={form.round}
              onChange={getOnChange('round')}
              type="number"
            />
            <Box sx={styles.optionalField}>Optional</Box>
          </FormControl>
        </Box>
        <Box sx={styles.columns(2)}>
          <FormControl>
            <DateTimePicker
              label={
                preferences?.league_game_game_time
                  ? t('Date')
                  : t('Date and time')
              }
              value={
                preferences?.league_game_game_time ? form.date : form.kickTime
              }
              ampm
              onChange={getOnChangeDateOrTime(
                preferences?.league_game_game_time ? 'date' : 'kickTime'
              )}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-testid': 'fixture-date-time-input',
                  },
                },
              }}
            />
          </FormControl>
          {preferences?.league_game_game_time && (
            <FormControl>
              <TimePicker
                label={t('Kick Time')}
                ampm
                value={form.kickTime}
                onChange={getOnChangeDateOrTime('kickTime')}
                slotProps={{
                  textField: {
                    error: !!errors.kickTime,
                    helperText: errors.kickTime,
                    inputProps: {
                      'data-testid': 'fixture-kick-time-input',
                    },
                  },
                }}
              />
            </FormControl>
          )}
          {!preferences?.league_game_game_time &&
            renderAutocomplete({
              name: 'timezone',
              label: t('Timezone'),
              options: moment.tz.names().map((tzName) => ({
                value: tzName,
                label: tzName,
              })),
            })}
        </Box>
        {preferences?.league_game_game_time &&
          renderAutocomplete({
            name: 'timezone',
            label: t('Timezone'),
            options: moment.tz.names().map((tzName) => ({
              value: tzName,
              label: tzName,
            })),
          })}
        {/* home team and away team */}
        {hasDuplicateTeams && (
          <Alert severity="warning">{t('Please select different teams')}</Alert>
        )}
        <Box sx={styles.columns(2)}>
          {renderAutocomplete({
            name: 'homeTeam',
            label: t('Home Team'),
            options: clubs,
          })}
          {renderAutocomplete({
            name: 'awayTeam',
            label: t('Away Team'),
            options: clubs,
          })}
        </Box>
        <Box sx={styles.columns(2)}>
          {renderAutocomplete({
            name: 'homeSquad',
            label: t('Home Squad'),
            options: homeSquads,
            disabled: !form.homeTeam,
          })}
          {renderAutocomplete({
            name: 'awaySquad',
            label: t('Away Squad'),
            options: awaySquads,
            disabled: !form.awayTeam,
          })}
        </Box>
        {renderAutocomplete({
          name: 'location',
          label: t('Search venue'),
          options: locations,
          optional: true,
          useSearch: true,
          setInputChange: debouncedLocationSearch,
          isLoading: isFetchingLocations,
        })}

        {preferences?.league_game_tv &&
          renderAutocomplete({
            name: 'tvChannelIds',
            label: t('TV (optional)'),
            options: tvChannels,
            multiple: true,
            optional: true,
          })}
        {preferences?.league_game_tv &&
          (form.tvChannelIds || []).length > 0 &&
          tvContacts?.length > 0 && (
            <Box
              sx={{
                borderLeft: 1,
                borderColor: colors.neutral_300,
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              {renderAutocomplete({
                name: 'tvContactIds',
                label: t('TV users'),
                options: tvContacts,
                multiple: true,
                checkbox: true,
                indent: true,
              })}
            </Box>
          )}
        {preferences?.league_game_match_director &&
          renderAutocomplete({
            name: 'matchDirectorId',
            label: t('Match Director (optional)'),
            options: matchDirectors,
            optional: true,
          })}
        {preferences?.league_game_officials && (
          <DuplicateOfficialsAlert
            officialsIds={officialsIds}
            sx={{ marginBottom: '6px' }}
          />
        )}
        {preferences?.league_game_officials && (
          <Box sx={styles.columns(2)}>
            {renderAutocomplete({
              name: officialRoleEnumLike.Referee,
              label: t('Referee'),
              options: officials,
              optional: true,
            })}
            {renderAutocomplete({
              name: officialRoleEnumLike.AssistantReferee1,
              label: t('AR1'),
              options: officials,
              optional: true,
            })}
            {renderAutocomplete({
              name: officialRoleEnumLike.AssistantReferee2,
              label: t('AR2'),
              options: officials,
              optional: true,
            })}
            {renderAutocomplete({
              name: officialRoleEnumLike.FourthReferee,
              label: t('4th Official'),
              options: officials,
              optional: true,
            })}

            {preferences?.enable_reserve_ar &&
              renderAutocomplete({
                name: officialRoleEnumLike.ReserveAR,
                label: t('Reserve AR'),
                options: officials,
                optional: true,
              })}

            {renderAutocomplete({
              name: officialRoleEnumLike.Var,
              label: t('VAR'),
              options: officials,
              optional: true,
            })}
            {renderAutocomplete({
              name: officialRoleEnumLike.Avar,
              label: t('AVAR'),
              options: officials,
              optional: true,
            })}
          </Box>
        )}

        {!preferences?.league_game_officials &&
          preferences?.enable_reserve_ar && (
            <Box sx={styles.columns(2)}>
              {renderAutocomplete({
                name: officialRoleEnumLike.ReserveAR,
                label: t('Reserve AR'),
                options: officials,
                optional: true,
              })}
            </Box>
          )}

        {preferences?.league_game_notification_recipient &&
          renderAutocomplete({
            name: 'notificationsRecipient',
            label: t('Notifications recipient'),
            options: notificationsRecipients,
            multiple: false,
            optional: true,
          })}
        {preferences?.league_game_hide_club_game && hideFromClub()}
      </Stack>
    </Box>
  );
};

export default withNamespaces()(NewLeagueFixtureForm);
