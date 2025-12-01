// @flow
import { useState, useEffect, useRef, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  FormControl,
  TextField,
  DatePicker,
  TimePicker,
  Autocomplete,
  MenuItem,
  Checkbox,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { getEventSelector } from '@kitman/modules/src/MatchDay/shared/selectors';
import { colors } from '@kitman/common/src/variables';
import moment from 'moment-timezone';
import {
  formatJustTimeWithAMPM,
  formatShort,
} from '@kitman/common/src/utils/dateFormatter';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { Option } from '@kitman/components/src/Select';
import { useUpdateGameInformationMutation } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import {
  checkIsKickTimeSameOrBeforeDateTime,
  getTranslations,
} from '@kitman/modules/src/MatchDay/shared/utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import type { MatchInformationForm } from '@kitman/modules/src/MatchDay/shared/types';
import { defaultFormState } from '@kitman/modules/src/MatchDay/shared/constants';
import { dismissToasts } from '@kitman/modules/src/AthleteReviews/src/shared/utils';
import { useGetTvChannelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { useGetEventLocationsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventLocationsApi';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import Card from '../Card';
import Col from '../Col';
import InformationRow from '../InformationRow';

const styles = {
  columns: (columnsCount: number) => ({
    display: 'grid',
    gap: 3,
    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
  }),
};

type Props = {};

const MatchInformation = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const event = useSelector(getEventSelector);
  const { isLeague } = useLeagueOperations();
  const { permissions } = usePermissions();

  const canManageGameInformation =
    isLeague && permissions?.leagueGame.manageGameInformation;

  const textEnum = getTranslations(t);
  const eventTimezone = event?.local_timezone;
  const eventTimezoneAbbreviation = moment.tz(eventTimezone).zoneAbbr();
  const startGameTime = moment.tz(event?.game_time, eventTimezone);
  const startDateTime = moment.tz(event?.start_date, eventTimezone);
  const isStartGameTimeValid = startGameTime.isValid();
  const isStartDateTimeValid = startDateTime.isValid();

  const [form, setForm] = useState<MatchInformationForm>(defaultFormState);
  const formRef = useRef(defaultFormState);

  const isKickTimeValid = checkIsKickTimeSameOrBeforeDateTime({
    date: form.time,
    kickTime: form.kickTime,
  });

  const isFormValid =
    form.matchNumber &&
    form.date &&
    form.time &&
    form.kickTime &&
    isKickTimeValid &&
    (form.tvChannelIds || []).length > 0;

  const hasTvChannelsSelected = (form.tvChannelIds || []).length > 0;

  const { data: activeSquadId } = useGetActiveSquadQuery(
    {},
    {
      selectFromResult: (result) => {
        return {
          data: result?.data?.division[0]?.id,
        };
      },
    }
  );

  const { data: tvChannels } = useGetTvChannelsQuery(undefined, {
    selectFromResult: (result) => {
      return {
        ...result,
        data: (result?.data ?? []).map((item) => ({
          label: item.name,
          value: item.id,
        })),
      };
    },
  });

  const { data: locations } = useGetEventLocationsQuery(
    {
      eventType: eventTypePermaIds.game.type,
      paginate: false,
      divisionId: activeSquadId,
    },
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: defaultMapToOptions(result?.data ?? []),
        };
      },
      skip: !activeSquadId,
    }
  );

  const { data: tvContactsData } = useSearchContactsQuery(
    { paginate: false },
    {
      selectFromResult: (result) => {
        return {
          data: result?.data?.game_contacts ?? [],
        };
      },
    }
  );

  const tvContacts = useMemo(() => {
    return tvContactsData?.filter((contact) => {
      return form.tvChannelIds?.includes(contact.tv_channel_id);
    });
  }, [form.tvChannelIds, tvContactsData]);

  useEffect(() => {
    if (event) {
      const formValues = {
        matchNumber: event.mls_game_key, // NOTE: will be replaced by "provider_external_id" in a future iteration
        date: isStartDateTimeValid ? startDateTime : null,
        time: isStartGameTimeValid ? startGameTime : null,
        kickTime: isStartDateTimeValid ? startDateTime : null,
        locationId: event.event_location?.id ?? null,
        tvChannelIds: event?.tv_channels?.map((channel) => channel.id) ?? [],
        tvContactIds:
          event?.tv_game_contacts?.map((contact) => contact.id) ?? [],
      };
      setForm(formValues);
      formRef.current = formValues;
    }
  }, [event]);

  const [updateGameInformation, { isLoading: isSaving }] =
    useUpdateGameInformationMutation();

  if (!event) {
    return null;
  }

  const renderInformation = (value?: string | number) => {
    return `${value ?? '--'}`;
  };

  const getOnChange = (name: string) => (e) => {
    // NOTE: remove e.persist() if React version is 17+.
    e.persist();
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const getOnChangeDateOrTime = (name: string) => (date: moment.Moment) => {
    setForm((prev) => ({ ...prev, [name]: date }));
  };

  const renderSelect = ({
    name,
    label,
    options,
    multiple = false,
    checkbox = false,
    indent = false,
  }: {
    name: string,
    label: string,
    options: Array<Option>,
    multiple?: boolean,
    checkbox?: boolean,
    indent?: boolean,
  }) => {
    return (
      <FormControl
        sx={{ width: indent ? '93%' : '100%', alignSelf: 'flex-end' }}
      >
        <Autocomplete
          id={`${name.toLowerCase()}-autocomplete`}
          options={options}
          multiple={multiple}
          renderInput={(params) => <TextField {...params} label={label} />}
          renderTags={(value) => value.map((option) => option.label).join(', ')}
          value={
            multiple
              ? options.filter((i) => form[name]?.includes(i.value)) ?? []
              : options.find((i) => i.value === form[name]) ?? null
          }
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, selectedValue) => {
            setForm((prev) => ({
              ...prev,
              [name]: multiple
                ? selectedValue.map((item) => item.value)
                : selectedValue?.value ?? null,
            }));
          }}
          getOptionLabel={(option) => option.label ?? ''}
          getOptionKey={(option) => option.value}
          clearOnBlur
          clearOnEscape
          disableClearable={false}
          disableCloseOnSelect={multiple} // Keep the dropdown open in multi-select mode
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
        />
      </FormControl>
    );
  };

  const setDateToTime = ({
    date,
    time,
  }: {
    date: moment.Moment | null,
    time: moment.Moment | null,
  }): moment.Moment | null => {
    if (!date || !time) {
      return null;
    }

    const newDate = time.set({
      year: date.year(),
      month: date.month(),
      date: date.date(),
      second: 0,
      millisecond: 0,
    });

    return moment.tz(newDate, eventTimezone).format();
  };

  const onSaveGameInformation = async () => {
    try {
      await updateGameInformation({
        eventId: event.id,
        updates: {
          provider_external_id: form.matchNumber,
          game_time: setDateToTime({
            date: form.date,
            time: form.time,
          }),
          start_time: setDateToTime({
            date: form.date,
            time: form.kickTime,
          }),
          local_timezone: eventTimezone,
          tv_channel_ids: form.tvChannelIds,
          tv_game_contacts_ids: form.tvContactIds,
          event_location_id: form.locationId,
          include_tv_channels: true,
        },
      }).unwrap();
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.informationSavedError,
        })
      );

      setTimeout(() => dismissToasts(dispatch), 2500);
      return;
    }

    dispatch(
      add({
        status: toastStatusEnumLike.Success,
        title: textEnum.informationSavedSuccess,
      })
    );
  };

  const renderEditForm = () => {
    return (
      <Box sx={styles.columns(2)}>
        <Col>
          <FormControl>
            <TextField
              label={t('Match #')}
              value={form.matchNumber}
              onChange={getOnChange('matchNumber')}
            />
          </FormControl>
          <FormControl>
            <TimePicker
              label={t('Match Time')}
              ampm
              value={form.time}
              onChange={getOnChangeDateOrTime('time')}
            />
          </FormControl>
          <FormControl>
            <TimePicker
              label={t('Kick Time')}
              ampm
              value={form.kickTime}
              onChange={getOnChangeDateOrTime('kickTime')}
              slotProps={{
                textField: {
                  error: !isKickTimeValid,
                  helperText: isKickTimeValid
                    ? ''
                    : textEnum.canNotBeBeforeStartTime,
                },
              }}
            />
          </FormControl>
        </Col>
        <Col>
          <FormControl>
            <DatePicker
              label={t('Date')}
              value={form.date}
              onChange={getOnChangeDateOrTime('date')}
            />
          </FormControl>
          <FormControl>
            {renderSelect({
              name: 'locationId',
              label: t('Venue'),
              options: locations,
            })}
          </FormControl>
          {renderSelect({
            name: 'tvChannelIds',
            label: t('TV'),
            options: tvChannels,
            multiple: true,
          })}
          {hasTvChannelsSelected && tvContacts?.length > 0 && (
            <Box
              sx={{
                borderLeft: 1,
                borderColor: colors.neutral_300,
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              {renderSelect({
                name: 'tvContactIds',
                label: t('TV users'),
                options: tvContacts.map((contact) => ({
                  label: contact.name,
                  value: contact.id,
                })),
                multiple: true,
                checkbox: true,
                indent: true,
              })}
            </Box>
          )}
        </Col>
      </Box>
    );
  };

  return (
    <Card
      title={t('Match Information')}
      onSubmitForm={onSaveGameInformation}
      isSubmitting={isSaving}
      isFormValid={isFormValid}
      editForm={renderEditForm()}
      isFormEditable={canManageGameInformation}
      onResetForm={() => setForm(formRef.current)}
    >
      <Box sx={styles.columns(2)}>
        <Col>
          <InformationRow
            label={t('Match #:')}
            value={renderInformation(event.mls_game_key)}
          />
          <InformationRow
            label={`${t('Match Time')}:`}
            value={renderInformation(
              isStartGameTimeValid
                ? `${formatJustTimeWithAMPM(
                    startGameTime
                  )} ${eventTimezoneAbbreviation}`
                : ''
            )}
          />
          <InformationRow
            label={`${t('Kick Time')}:`}
            value={renderInformation(
              isStartDateTimeValid
                ? `${formatJustTimeWithAMPM(
                    startDateTime
                  )} ${eventTimezoneAbbreviation}`
                : ''
            )}
          />
        </Col>

        <Col>
          <InformationRow
            label={`${t('Date')}:`}
            value={renderInformation(
              isStartDateTimeValid ? formatShort(startDateTime) : ''
            )}
          />
          <InformationRow
            label={`${t('Venue')}:`}
            value={renderInformation(event.event_location?.name)}
          />
          <InformationRow
            label={`${t('TV')}:`}
            value={renderInformation(
              event.tv_channels?.map((channel) => channel?.name).join(', ')
            )}
          />
        </Col>
      </Box>
    </Card>
  );
};

export default withNamespaces()(MatchInformation);
