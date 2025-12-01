// @flow
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import { useGetOfficialUsersQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type {
  Option,
  GameDayRolesForm,
  Contact,
  UseGamedayRolesArgs,
  UseGamedayRolesReturn,
} from '@kitman/modules/src/MatchDay/shared/types';
import { useGetTvChannelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetEventLocationsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventLocationsApi';
import { useGetNotificationsRecipientsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/notificationsRecipientsApi';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { dismissToasts } from '@kitman/modules/src/AthleteReviews/src/shared/utils';
import updateGamedayRoles from '@kitman/services/src/services/contacts/updateGamedayRoles';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import searchAdditionalUsers from '@kitman/modules/src/AdditionalUsers/shared/redux/services/api/searchAdditionalUsers';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';

type Props = {
  locationSearchExpression: string | null,
  shouldLoadOfficials?: boolean,
  shouldLoadTvData?: boolean,
  shouldLoadMatchDirectors?: boolean,
  shouldLoadNotificationsRecipients?: boolean,
};

const MINIMUM_LOCATION_CHARACTERS = 3;

export const useNewLeagueFixtureFormData = ({
  locationSearchExpression,
  shouldLoadOfficials = true,
  shouldLoadTvData = true,
  shouldLoadMatchDirectors = true,
  shouldLoadNotificationsRecipients = true,
}: Props): {
  competitions: Array<Option>,
  clubs: Array<Option>,
  officials: Array<Option>,
  tvChannels: Array<Option>,
  locations: Array<Option>,
  tvContactsData: Array<Option & { tv_channel_id: number }>,
  matchDirectors: Array<Option>,
  notificationsRecipients: Array<Option>,
  isFetchingLocations: boolean,
} => {
  const [matchDirectors, setMatchDirectors] = useState<Array<Option>>([]);
  const currentSquad = useSelector(getActiveSquad());

  const { data: competitions } = useGetCompetitionsQuery(
    {
      divisionIds: currentSquad?.division[0]?.id,
    },
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: defaultMapToOptions(result?.data ?? []),
        };
      },
    }
  );

  const { data: clubs } = useGetClubsQuery(
    { divisionIds: currentSquad?.division[0]?.id },
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: defaultMapToOptions(result?.data ?? []),
        };
      },
    }
  );

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

  const { data: officials } = useGetOfficialUsersQuery(
    {},
    {
      selectFromResult: (result) => {
        const officialIds = {};
        (result?.data ?? []).forEach((item) => {
          officialIds[item.id] = {
            label: item.fullname,
            value: item.id,
          };
        });

        return {
          ...result,
          data: orderBy(Object.values(officialIds), ['fullname'], ['asc']),
        };
      },
      skip: !shouldLoadOfficials,
    }
  );

  const { data: tvChannels } = useGetTvChannelsQuery(undefined, {
    selectFromResult: (result) => {
      return {
        ...result,
        data: defaultMapToOptions(result?.data ?? []),
      };
    },
    skip: !shouldLoadTvData,
  });

  const { data: tvContactsData } = useSearchContactsQuery(
    { paginate: false },
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: (result?.data?.game_contacts ?? []).map((item) => ({
            tv_channel_id: item.tv_channel_id,
            label: item.name,
            value: item.id,
          })),
        };
      },
      skip: !shouldLoadTvData,
    }
  );

  const { data: locations, isFetching: isFetchingLocations } =
    useGetEventLocationsQuery(
      {
        eventType: eventTypePermaIds.game.type,
        paginate: false,
        divisionId: activeSquadId,
        searchValue: locationSearchExpression,
      },
      {
        selectFromResult: (result) => {
          return {
            ...result,
            data: defaultMapToOptions(result?.data ?? []),
          };
        },
        skip:
          !locationSearchExpression ||
          locationSearchExpression.length < MINIMUM_LOCATION_CHARACTERS,
      }
    );

  const { data: notificationsRecipients } = useGetNotificationsRecipientsQuery(
    {},
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: defaultMapToOptions(result?.data ?? []),
        };
      },
      skip: !activeSquadId || !shouldLoadNotificationsRecipients,
    }
  );

  useEffect(() => {
    if (!shouldLoadMatchDirectors) {
      setMatchDirectors([]);
      return undefined;
    }

    let isMounted = true;

    searchAdditionalUsers({
      search_expression: '',
      is_active: true,
      include_inactive: false,
      types: ['match_director'],
      per_page: 1000, // TODO: remove this once we have a proper way to turn off pagination
      page: 0,
    }).then((result) => {
      if (!isMounted) {
        return;
      }
      setMatchDirectors(
        result.data?.map((item) => ({
          label: item.fullname,
          value: item.id,
        })) ?? []
      );
    });

    return () => {
      isMounted = false;
    };
  }, [shouldLoadMatchDirectors]);

  return {
    competitions: competitions ?? [],
    clubs: clubs ?? [],
    officials: officials ?? [],
    tvChannels: tvChannels ?? [],
    tvContactsData: tvContactsData ?? [],
    locations: locations ?? [],
    matchDirectors,
    notificationsRecipients: notificationsRecipients ?? [],
    isFetchingLocations,
  };
};

export const useGamedayRoles = ({
  t,
  eventId,
  contactRoles,
  eventGameContacts,
  fetchEventGameContacts,
}: UseGamedayRolesArgs): UseGamedayRolesReturn => {
  const [form, setForm] = useState<GameDayRolesForm>({});
  const [order, setOrder] = useState<Array<number>>([]);
  const [selectedOptionalRoleIds, setSelectedOptionalRoleIds] = useState<
    Array<number>
  >([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textEnum = getTranslations(t);
  const dispatch = useDispatch();
  const isEditOpen = Boolean(anchorEl);

  // add order data to roles based on existing game contacts
  const rolesWithOrder = useMemo(() => {
    return contactRoles.map((role) => {
      const eventGameContact = eventGameContacts.find(
        (item) => item.game_contact_role_id === role.id
      );

      return eventGameContact
        ? { ...role, order: eventGameContact.order }
        : role;
    });
  }, [contactRoles, eventGameContacts]);

  // filter roles that are assigned whether required/not required
  const readOnlyRoles = useMemo(() => {
    const orderedAssignedRoles = orderBy(
      rolesWithOrder.filter((role) => {
        return (
          !!role.eventGameContactId ||
          (selectedOptionalRoleIds.includes(role.id) &&
            !!role.eventGameContactId)
        );
      }),
      ['order'],
      ['asc']
    );

    // filter roles that are unassigned
    const orderedUnassignedRoles = orderBy(
      rolesWithOrder.filter((role) => {
        return role.required && !role.eventGameContactId;
      }),
      ['order'],
      ['asc']
    );

    return [...orderedAssignedRoles, ...orderedUnassignedRoles];
  }, [rolesWithOrder, selectedOptionalRoleIds]);

  const editOnlyRoles = useMemo(() => {
    let tmpEditOnlyRoles = [...readOnlyRoles];

    // in edit view if a custom order exists, we use it over the default ordering
    if (order.length) {
      tmpEditOnlyRoles = order.map((roleId) => {
        return contactRoles.filter((item) => item.id === roleId)[0];
      });
    }

    return tmpEditOnlyRoles;
  }, [readOnlyRoles, contactRoles, order]);

  const optionalRoles = useMemo(() => {
    const editOnlyRoleIds = editOnlyRoles.map((item) => item.id);
    const requiredRoleIds = contactRoles.map(
      (item) => !!item.required && item.id
    );

    // we get all optional roles that are not used in the edit form
    const tmpOptionalRoles = rolesWithOrder.filter((item) => {
      const ids = Array.from(
        new Set([
          ...editOnlyRoleIds,
          ...selectedOptionalRoleIds,
          ...requiredRoleIds,
        ])
      );
      return !ids.includes(item.id);
    });

    return tmpOptionalRoles;
  }, [editOnlyRoles, rolesWithOrder, selectedOptionalRoleIds, contactRoles]);

  // add an optional role from the dropdown list to the form
  const onAddOptionalRole = (role) => {
    setSelectedOptionalRoleIds((currentIds) => {
      const ids = Array.from(new Set(currentIds));
      return [...ids, role.id];
    });
    setOrder((currentOrder) => {
      let ids = [];

      if (!currentOrder.length) {
        ids = [...editOnlyRoles.map((i) => i.id), role.id];
      } else {
        ids = [...currentOrder, role.id];
      }

      return Array.from(new Set(ids));
    });
  };

  // remove an optional role from the edit form
  const onRemoveOptionalRole = (roleId: number) => {
    const ids = new Set(selectedOptionalRoleIds);
    const tmpOrder = new Set(order);

    if (ids.has(roleId)) {
      ids.delete(roleId);
      setSelectedOptionalRoleIds(Array.from(ids));
    }
    if (tmpOrder.has(roleId)) {
      tmpOrder.delete(roleId);
      setOrder(Array.from(tmpOrder));
    }
    setForm((prev) => {
      const tmpPrev = { ...prev };
      delete tmpPrev[roleId];
      return tmpPrev;
    });
  };

  const onResetForm = () => {
    setForm({});
    setOrder([]);
    setSelectedOptionalRoleIds([]);
  };

  const onOpenOptionalRoles = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onCloseOptionalRoles = () => {
    setAnchorEl(null);
  };

  const onOpenEditForm = () => {
    const updateForm = {};
    const newOrder = [];

    const contacts = sortBy(eventGameContacts, ['order'], ['asc']);

    readOnlyRoles.forEach((item) => {
      const contactLinkedToRole = contacts.find(
        (contact) => contact.game_contact_role_id === item.id
      );
      newOrder.push(item.id);
      updateForm[item.id] = {
        value: contactLinkedToRole?.game_contact_id ?? null,
        label: item.role,
        email: item?.email ?? '',
        phone: item?.phone ?? '',
      };
    });

    setForm(updateForm);
    setOrder(newOrder);
  };

  const onSubmitForm = async () => {
    try {
      setIsSubmitting(true);
      // $FlowIgnore[incompatible-type] Object.entries returns an array with the second index as mixed type
      const formValues: Array<[string, Contact]> = Object.entries(form);
      const payload = [];

      editOnlyRoles.forEach((role) => {
        const contactFound = formValues.find(
          ([roleId, contact]) => !!contact && +roleId === role.id
        );
        if (contactFound && contactFound[1].value) {
          payload.push({
            // roles with id are updated, or created otherwise
            id: role.eventGameContactId ?? null,
            game_contact_role_id: role.id,
            game_contact_id: contactFound[1].value,
          });
        }
      });

      // unassigned roles are marked with destroy for deletion
      contactRoles.forEach((role) => {
        const roleFound = readOnlyRoles.find((item) => item.id === role.id);
        if (roleFound?.eventGameContactId && !form[role.id]) {
          payload.push({
            id: roleFound.eventGameContactId,
            destroy: true,
          });
        }
      });

      await updateGamedayRoles({
        eventId,
        updates: payload,
      });

      await fetchEventGameContacts();

      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: textEnum.gamedayRolesSavedSuccess,
        })
      );
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.gamedayRolesSavedError,
        })
      );
      setTimeout(() => dismissToasts(dispatch), 2500);
    } finally {
      onResetForm();
      setIsSubmitting(false);
    }
  };

  const requiredRoles = contactRoles.filter((item) => item.required);

  return {
    readOnlyRoles,
    editOnlyRoles,
    optionalRoles,
    form,
    setForm,
    order,
    setOrder,
    isEditOpen,
    anchorEl,
    isSubmitting,
    eventGameContacts,
    requiredRoles,
    onRemoveOptionalRole,
    onAddOptionalRole,
    onResetForm,
    onOpenOptionalRoles,
    onCloseOptionalRoles,
    onOpenEditForm,
    onSubmitForm,
  };
};
