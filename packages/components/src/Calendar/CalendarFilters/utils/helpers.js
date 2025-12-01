// @flow
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { type Squad } from '@kitman/services/src/services/getPermittedSquads';
import type { ID } from '@kitman/components/src/Athletes/types';
import type { Permissions } from '@kitman/services/src/services/getPermissions';
import type { Translation } from '@kitman/common/src/types/i18n';
import { initialFilters } from './consts';
import { eventTypeFilterEnumLike } from './enum-likes';
import type { Filters, SetFilterActionPayload } from '../redux/types';
import type { CheckboxItem, CheckboxItems } from './types';

export function mapListItems({ id, name }: Squad): CheckboxItem {
  return {
    value: id.toString(),
    label: name,
  };
}

export const createAthletesSelectValueProp = (athletes: Array<ID>) => {
  return athletes.length === 0
    ? []
    : [
        {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes,
          squads: [],
          context_squads: [],
        },
      ];
};

export const localStorageKey = 'optimizedCalendarFilters';

export const readFiltersFromLocalStorage = (): Filters | null => {
  if (!getIsLocalStorageAvailable()) return null;
  return JSON.parse(window.localStorage.getItem(localStorageKey));
};

export const updateFiltersInLocalStorage = ({
  key,
  value,
}: SetFilterActionPayload) => {
  if (!getIsLocalStorageAvailable()) return;

  const currentFiltersFromLocalStorage = readFiltersFromLocalStorage();

  const filtersToSpread = currentFiltersFromLocalStorage ?? initialFilters;
  const filtersToSet: Filters = { ...filtersToSpread, [(key: string)]: value };

  localStorage.setItem(localStorageKey, JSON.stringify(filtersToSet));
};

export const getTypesLabelsTranslatedTexts = (t: Translation) => ({
  events: t('Events'),
  rehab: t('Rehab'),
  treatments: t('Treatments'),
  games: t('Games'),
  individualSessions: t('Individual Sessions'),
  squadSessions: t('Squad Sessions'),
  trainingSessions: t('Training Sessions'),
});

export const getCheckboxMultiSelectTranslatedTexts = (t: Translation) => ({
  showMore: t('Show more'),
  showLess: t('Show less'),
  searchPlaceholder: t('Search'),
  selectAll: t('Select all'),
  clear: t('Clear'),
});

export const getAttendeesTranslatedTexts = (t: Translation) => ({
  title: t('Attendees'),
  athletes: {
    label: t('Athletes'),
    placeholder: t('Search for athletes'),
  },
  staff: {
    label: t('Staff'),
    placeholder: t('Search for staff'),
  },
});

export const getLocationTranslatedTexts = (t: Translation) => ({
  title: t('Location'),
  placeholder: t('Search locations'),
});

export const getGamesTranslatedTexts = (t: Translation) => ({
  title: t('Games'),
  competitionsPlaceholder: t('Competition'),
  oppositionPlaceholder: t('Opposition'),
});

export const getFiltersTranslatedTexts = (t: Translation) => {
  return {
    typesTitle: t('Types'),
    filters: t('Filters'),
    squadsTitle: t('Squads'),
  };
};

export const getAllTranslatedTexts = (t: Translation) => ({
  filters: { ...getFiltersTranslatedTexts(t) },
  attendees: { ...getAttendeesTranslatedTexts(t) },
  games: { ...getGamesTranslatedTexts(t) },
  checkboxMultiSelect: { ...getCheckboxMultiSelectTranslatedTexts(t) },
  location: { ...getLocationTranslatedTexts(t) },
  typesLabels: { ...getTypesLabelsTranslatedTexts(t) },
});

export const getTypesOptions = (permissions: Permissions, t: Translation) => {
  const permissionNotesSet = new Set<string>(permissions.notes ?? []);

  const permissionsIncludeViewAndMedicalNotes = ['view', 'medical-notes'].every(
    (element) => permissionNotesSet.has(element)
  );

  const canShowRehab =
    permissionsIncludeViewAndMedicalNotes &&
    window.featureFlags['schedule-rehab'];
  const canShowTreatments =
    permissionsIncludeViewAndMedicalNotes &&
    window.featureFlags['schedule-treatments'];

  const {
    treatments,
    trainingSessions,
    games,
    individualSessions,
    events,
    rehab,
    squadSessions,
  } = getTypesLabelsTranslatedTexts(t);
  let options: CheckboxItems = [];
  if (window.featureFlags['calendar-hide-all-day-slot']) {
    options = [
      {
        label: trainingSessions,
        value: eventTypeFilterEnumLike.squadSessions,
      },
      {
        label: games,
        value: eventTypeFilterEnumLike.games,
      },
    ];
  } else {
    options = [
      {
        label: squadSessions,
        value: eventTypeFilterEnumLike.squadSessions,
      },
      {
        label: individualSessions,
        value: eventTypeFilterEnumLike.individualSessions,
      },
      {
        label: games,
        value: eventTypeFilterEnumLike.games,
      },
    ];

    if (canShowTreatments) {
      options.push({
        label: treatments,
        value: eventTypeFilterEnumLike.treatments,
      });
    }

    if (canShowRehab) {
      options.push({
        label: rehab,
        value: eventTypeFilterEnumLike.rehab,
      });
    }
    if (window.featureFlags['custom-events']) {
      options.push({
        label: events,
        value: eventTypeFilterEnumLike.customEvents,
      });
    }
  }

  return options;
};

type IntersectPreSelectedSquadWithPermitted = {
  permittedSquads: Array<Squad>,
  preSelectedSquadIds: Array<string>,
  userCurrentSquadId: ?string,
};

export const intersectPreSelectedSquadWithPermitted = ({
  permittedSquads,
  preSelectedSquadIds,
  userCurrentSquadId,
}: IntersectPreSelectedSquadWithPermitted) => {
  const permittedSquadIds = new Set(
    permittedSquads.map(({ id }) => id.toString())
  );
  const permittedPreSelectedIds: Array<string> = preSelectedSquadIds.filter(
    (selectedId) =>
      permittedSquadIds.has(selectedId) && selectedId !== userCurrentSquadId
  );

  return permittedPreSelectedIds;
};
