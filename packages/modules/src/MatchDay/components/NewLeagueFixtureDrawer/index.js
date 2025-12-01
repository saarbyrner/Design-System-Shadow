// @flow
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import compact from 'lodash/compact';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer, Divider, Button } from '@kitman/playbook/components';
import {
  officialRoleEnumLike,
  defaultFixtureFormState,
} from '@kitman/modules/src/MatchDay/shared/constants';
import type { FixtureForm } from '@kitman/modules/src/MatchDay/shared/types';
import {
  getHasDuplicateOfficials,
  getTranslations,
  checkIsKickTimeSameOrBeforeDateTime,
} from '@kitman/modules/src/MatchDay/shared/utils';
import { createLeagueFixture, updateGameInformation } from '@kitman/services';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { dismissToasts } from '@kitman/modules/src/AthleteReviews/src/shared/utils';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import type { Event } from '@kitman/common/src/types/Event';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';

import { useGetGameOfficialsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import NewLeagueFixtureForm from '../NewLeagueFixtureForm';

type Props = {
  isOpen: boolean,
  event: Event | null,
  onClose: () => void,
  onSubmitSuccess: () => void,
};

const NewLeagueFixtureDrawer = ({
  t,
  isOpen,
  onClose,
  onSubmitSuccess,
  event,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const textEnum = getTranslations(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FixtureForm>(defaultFixtureFormState);
  const [isEditMode, setIsEditMode] = useState(false);
  const { preferences } = usePreferences();

  const currentOrganisation = useSelector(getOrganisation());

  const hasDuplicateTeams =
    form.homeTeam && form.awayTeam && form.homeTeam === form.awayTeam;

  let officialsIds = [];
  if (preferences?.league_game_officials) {
    officialsIds = [
      form[officialRoleEnumLike.Referee],
      form[officialRoleEnumLike.AssistantReferee1],
      form[officialRoleEnumLike.AssistantReferee2],
      form[officialRoleEnumLike.FourthReferee],
      form[officialRoleEnumLike.Var],
      form[officialRoleEnumLike.Avar],
    ].filter(Number);
  }

  // $FlowIgnore[incompatible-call] officialsIds can only be an array of numbers or an empty array
  const hasDuplicateOfficials = getHasDuplicateOfficials(officialsIds);

  const isKickTimeValid =
    preferences?.league_game_game_time &&
    checkIsKickTimeSameOrBeforeDateTime({
      date: form.date,
      kickTime: form.kickTime,
    });

  let isFormValid = !!(
    form.competition &&
    form.kickTime &&
    moment(form?.kickTime)?.isValid() &&
    form.timezone &&
    form.homeTeam &&
    form.awayTeam &&
    form.homeSquad &&
    form.awaySquad &&
    !hasDuplicateTeams
  );

  if (preferences?.league_game_game_time) {
    isFormValid =
      isFormValid && form.date && !!(form.kickTime && isKickTimeValid);
  }
  if (preferences?.league_game_officials) {
    isFormValid = isFormValid && !hasDuplicateOfficials;
  }
  if (preferences?.league_game_match_id) {
    isFormValid = isFormValid && !!form.matchId;
  }

  const gameOfficials = useGetGameOfficialsQuery(
    { eventId: event?.id },
    { skip: !event?.id }
  );

  useEffect(() => {
    if (isOpen && event) {
      setIsEditMode(true);
      const eventTimezone =
        event?.local_timezone ?? currentOrganisation?.timezone;
      const date = moment.tz(event?.game_time, eventTimezone);
      const kickTime = moment.tz(event?.start_date, eventTimezone);
      setForm({
        matchId: event.mls_game_key ?? null,
        competition: event.type === 'game_event' ? event.competition?.id : null,
        round: event.round_number ?? null,
        date,
        kickTime,
        homeTeam: event.squad?.owner_id ?? null,
        awayTeam: event.opponent_squad?.owner_id ?? null,
        homeSquad: event.squad?.id ?? null,
        awaySquad: event.opponent_squad?.id ?? null,
        timezone: eventTimezone,
        tvChannelIds:
          event.type === 'game_event' && event.tv_channels
            ? event.tv_channels?.map((item) => item.id)
            : null,
        tvContactIds:
          event.type === 'game_event' && event.tv_game_contacts
            ? event.tv_game_contacts?.map((item) => item.id)
            : null,
        referee: gameOfficials.data?.referee?.official_id ?? null,
        assistant_referee_1:
          gameOfficials.data?.assistant_referee_1?.official_id ?? null,
        assistant_referee_2:
          gameOfficials.data?.assistant_referee_2?.official_id ?? null,
        fourth_referee: gameOfficials.data?.fourth_referee?.official_id ?? null,
        reserve_ar: gameOfficials.data?.reserve_ar?.official_id ?? null,
        var: gameOfficials.data?.var?.official_id ?? null,
        avar: gameOfficials.data?.avar?.official_id ?? null,
        location: event.event_location?.id ?? null,
        matchDirectorId:
          event.type === 'game_event' && event.match_director?.id
            ? event.match_director.id
            : null,
        ...(preferences?.league_game_notification_recipient &&
        event?.association_contact
          ? {
              notificationsRecipient: event.association_contact?.id,
            }
          : {}),
        visible: preferences?.league_game_hide_club_game
          ? !event.visible // inverted value to support backend because backend requires only positive value!
          : null,
      });
    }

    return () => {
      const defaultFixture = {
        ...defaultFixtureFormState,
        timezone: currentOrganisation?.timezone,
      };
      setIsEditMode(false);
      setForm(defaultFixture);
    };
  }, [isOpen, event, gameOfficials.data, currentOrganisation]);

  const onCloseDrawer = () => {
    setIsEditMode(false);
    setForm(defaultFixtureFormState);
    onClose();
  };

  const formatGameTime = ({
    date,
    timezone,
  }: {
    date: moment.Moment | null,
    timezone: string | null,
  }): string | null => {
    if (!date) {
      return null;
    }

    return moment(date.tz(timezone, true)).format();
  };

  const setKickTime = ({
    date,
    kickTime,
    timezone,
  }: {
    date: moment.Moment | null,
    kickTime: moment.Moment | null,
    timezone: string | null,
  }): moment.Moment | null => {
    if (!(date && kickTime)) {
      return null;
    }

    const kickDate = date.clone().set({
      hour: kickTime.hour(),
      minute: kickTime.minute(),
    });

    return formatGameTime({ date: kickDate, timezone });
  };

  const onCreateFixture = async () => {
    try {
      setIsSubmitting(true);
      const newFixture = await createLeagueFixture(
        {
          ...form,
          date: formatGameTime({ date: form.date, timezone: form.timezone }),
          kickTime: preferences?.league_game_game_time
            ? setKickTime({
                date: form.date,
                kickTime: form.kickTime,
                timezone: form.timezone,
              })
            : formatGameTime({ date: form.kickTime, timezone: form.timezone }),
        },
        preferences
      );
      setIsSubmitting(false);
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: textEnum.createLeagueFixtureSuccess,
          links: [
            {
              id: newFixture.event.id,
              text: 'View fixture',
              link: `/planning_hub/events/${newFixture.event.id}`,
            },
          ],
        })
      );

      onCloseDrawer();
      onSubmitSuccess();
    } catch {
      setIsSubmitting(false);
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.createLeagueFixtureError,
        })
      );
      setTimeout(() => dismissToasts(dispatch), 2500);
    }
  };

  const onEditFixture = async () => {
    if (!event?.id) return;

    try {
      setIsSubmitting(true);
      let updatedPayload = {
        competition_id: form.competition,
        round_number: +form.round,
        home_organisation_id: form.homeTeam,
        away_organisation_id: form.awayTeam,
        home_squad_id: form.homeSquad,
        away_squad_id: form.awaySquad,
        local_timezone: form.timezone,
        event_location_id: form.location,
        start_time: preferences?.league_game_game_time
          ? setKickTime({
              date: form.date,
              kickTime: form.kickTime,
              timezone: form.timezone,
            })
          : formatGameTime({
              date: form.kickTime,
              timezone: form.timezone,
            }),
      };

      if (preferences?.league_game_officials) {
        updatedPayload = {
          ...updatedPayload,
          game_officials: compact([
            form[officialRoleEnumLike.Referee] && {
              role: officialRoleEnumLike.Referee,
              official_id: form[officialRoleEnumLike.Referee],
            },
            form[officialRoleEnumLike.AssistantReferee1] && {
              role: officialRoleEnumLike.AssistantReferee1,
              official_id: form[officialRoleEnumLike.AssistantReferee1],
            },
            form[officialRoleEnumLike.AssistantReferee2] && {
              role: officialRoleEnumLike.AssistantReferee2,
              official_id: form[officialRoleEnumLike.AssistantReferee2],
            },
            form[officialRoleEnumLike.FourthReferee] && {
              role: officialRoleEnumLike.FourthReferee,
              official_id: form[officialRoleEnumLike.FourthReferee],
            },
            preferences?.enable_reserve_ar &&
              form[officialRoleEnumLike.ReserveAR] && {
                role: officialRoleEnumLike.ReserveAR,
                official_id: form[officialRoleEnumLike.ReserveAR],
              },
            form[officialRoleEnumLike.Var] && {
              role: officialRoleEnumLike.Var,
              official_id: form[officialRoleEnumLike.Var],
            },
            form[officialRoleEnumLike.Avar] && {
              role: officialRoleEnumLike.Avar,
              official_id: form[officialRoleEnumLike.Avar],
            },
          ]),
        };
      }
      if (preferences?.league_game_game_time) {
        updatedPayload = {
          ...updatedPayload,
          game_time: formatGameTime({
            date: form.date,
            timezone: form.timezone,
          }),
        };
      }
      if (preferences?.league_game_match_director) {
        updatedPayload = {
          ...updatedPayload,
          match_director_id: form.matchDirectorId,
        };
      }
      if (preferences?.league_game_tv) {
        updatedPayload = {
          ...updatedPayload,
          tv_channel_ids: form.tvChannelIds,
          tv_game_contacts_ids: form.tvContactIds,
        };
      }
      if (preferences?.league_game_match_id) {
        updatedPayload = {
          ...updatedPayload,
          provider_external_id: form.matchId,
        };
      }
      if (
        preferences?.league_game_notification_recipient &&
        form?.notificationsRecipient
      ) {
        updatedPayload = {
          ...updatedPayload,
          association_contact_id: form.notificationsRecipient,
        };
      }
      if (preferences?.league_game_hide_club_game && form?.visible) {
        updatedPayload = {
          ...updatedPayload,
          visible_for_clubs: !form.visible, // inverted value to support backend because backend requires only positive value!
        };
      }

      const editedFixture = await updateGameInformation({
        eventId: event.id,
        updates: updatedPayload,
      });

      setIsSubmitting(false);
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: textEnum.updateLeagueFixtureSuccess,
          links: [
            {
              id: editedFixture.event.id,
              text: 'View fixture',
              link: `/planning_hub/events/${editedFixture.event.id}`,
            },
          ],
        })
      );

      onCloseDrawer();
      onSubmitSuccess();
    } catch {
      setIsSubmitting(false);
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.updateLeagueFixtureError,
        })
      );
      setTimeout(() => dismissToasts(dispatch), 2500);
    }
  };

  const onSubmit = () => {
    if (event?.id) {
      return onEditFixture();
    }

    return onCreateFixture();
  };

  const errors = {
    kickTime: isKickTimeValid ? null : textEnum.canNotBeBeforeStartTime,
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onCloseDrawer}
      anchor="right"
      sx={drawerMixin({ theme, isOpen, drawerWidth: 500 })}
    >
      <DrawerLayout.Title
        title={isEditMode ? t('Edit Fixture') : t('Create Fixture')}
        onClose={onCloseDrawer}
      />
      <Divider />
      <DrawerLayout.Content>
        <NewLeagueFixtureForm
          form={form}
          errors={errors}
          setForm={setForm}
          hasDuplicateTeams={hasDuplicateTeams}
          event={event}
        />
      </DrawerLayout.Content>

      <Divider />
      <DrawerLayout.Actions>
        <Button
          disabled={isSubmitting}
          color="secondary"
          onClick={onCloseDrawer}
        >
          {t('Cancel')}
        </Button>
        <Button onClick={onSubmit} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? `${t('Loading')}...` : t('Save')}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default withNamespaces()(NewLeagueFixtureDrawer);
