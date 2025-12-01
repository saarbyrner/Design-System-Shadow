// @flow
import { type ComponentType, useMemo, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { type Squad as ActiveSquad } from '@kitman/services/src/services/getActiveSquad';

import { type Squad } from '@kitman/services/src/services/getPermittedSquads';
import type { Permissions } from '@kitman/services/src/services/getPermissions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import SlidingPanel from '../../SlidingPanel';
import { CheckboxMultiSelectTranslated as CheckboxMultiSelect } from './CheckboxMultiSelect';
import {
  getFiltersTranslatedTexts,
  getTypesOptions,
  intersectPreSelectedSquadWithPermitted,
  mapListItems,
} from './utils/helpers';
import { useFilter } from './utils/hooks';
import { AttendeesTranslated as Attendees } from './Attendees';
import { LocationTranslated as Location } from './Location';
import { GamesTranslated as Games } from './Games';
import { SessionsTranslated as Sessions } from './Sessions';
import { filtersSlice } from './redux/slices/filters';
import {
  useGetPermissionsQuery,
  useGetSquadsQuery,
} from './redux/services/filters';
import type { Filters } from './redux/types';
import { createSlidingPanelStyles } from './utils/styles';

const openPanelWidth = 340;

const squadsEmptyArrayDefaultValue = [];
const emptySet = new Set();
type Props = {
  isPanelOpen: boolean,
  togglePanel: () => void,
};

export type TranslatedProps = I18nProps<Props>;

const CalendarFilters = ({ isPanelOpen, togglePanel, t }: TranslatedProps) => {
  const { setFilter: setSquadFilter } = useFilter('squads');
  const { setFilter: setTypesFilter } = useFilter('types');
  const initialFilters: Filters = filtersSlice.getInitialState();

  const {
    data: userCurrentSquad,
    isSuccess: isSquadQuerySuccess,
  }: { data: ActiveSquad, isSuccess: boolean } = useGetActiveSquadQuery();

  const userCurrentSquadId: ?string = userCurrentSquad?.id?.toString();

  const [preSelectedSquads, setPreselectedSquads] = useState<Array<string>>([]);
  const [alwaysSelectedOptions, setAlwaysSelectedOptions] = useState<
    Set<string>
  >(new Set());
  const [alwaysDisabledOptions, setAlwaysDisabledOptions] = useState<
    Set<string>
  >(new Set());

  const {
    data: permittedSquads = squadsEmptyArrayDefaultValue,
  }: { data: Array<Squad> } = useGetSquadsQuery();

  useEffect(() => {
    const localPreSelectedSquadIds = initialFilters.squads.map((id) =>
      id.toString()
    );

    const permittedPreSelectedIds = intersectPreSelectedSquadWithPermitted({
      permittedSquads,
      preSelectedSquadIds: localPreSelectedSquadIds,
      userCurrentSquadId,
    });
    setSquadFilter(permittedPreSelectedIds.map((id) => +id));

    setPreselectedSquads(permittedPreSelectedIds);

    // adding setSquadFilter (as eslint wants) causes an infinite loop
  }, [initialFilters, userCurrentSquadId, permittedSquads]);

  useEffect(() => {
    if (userCurrentSquadId && isSquadQuerySuccess) {
      setAlwaysSelectedOptions(new Set([userCurrentSquadId]));
      setAlwaysDisabledOptions(new Set([userCurrentSquadId]));
    }
  }, [userCurrentSquadId, isSquadQuerySuccess]);

  const { data: permissions = {} }: { data: Permissions } =
    useGetPermissionsQuery();

  const translations = getFiltersTranslatedTexts(t);

  const typesOptions = useMemo(
    () => getTypesOptions(permissions, t),
    [permissions, t]
  );

  const isSessionTypeFilterFFOn = window.getFlag(
    'pac-calendar-filtering-session-types-integrations'
  );

  const slidingPanelStyles = createSlidingPanelStyles(isPanelOpen);
  return (
    <div>
      <SlidingPanel
        align="left"
        isOpen={isPanelOpen}
        kitmanDesignSystem
        leftMargin={0}
        width={isPanelOpen ? openPanelWidth : 0}
        togglePanel={togglePanel}
        position="relative"
        title={translations.filters}
      >
        <div css={slidingPanelStyles}>
          <CheckboxMultiSelect
            translatedTitle={translations.squadsTitle}
            allOptions={permittedSquads.map(mapListItems)}
            preSelectedOptions={preSelectedSquads}
            onSelect={(selectedIdsAsStrings: Set<string>) => {
              const ids: Array<number> = [];
              selectedIdsAsStrings.forEach((idString) => {
                // The current squad is always used in the backend, no need to add it explicitly,
                // and this will prevent the current squad to be selected if the user changes squad
                if (idString !== userCurrentSquadId) {
                  ids.push(+idString);
                }
              });
              setSquadFilter(ids);
            }}
            // need this locally, just to show the user
            alwaysSelectedOptions={alwaysSelectedOptions}
            disabledOptions={alwaysDisabledOptions}
          />
          <CheckboxMultiSelect
            translatedTitle={translations.typesTitle}
            allOptions={typesOptions}
            preSelectedOptions={initialFilters.types}
            onSelect={(selectedTypesSet) =>
              setTypesFilter(([...selectedTypesSet]: Array<string>))
            }
            alwaysSelectedOptions={emptySet}
            withSearch={false}
          />
          {isSessionTypeFilterFFOn && <Sessions />}
          <Games />
          <Attendees />
          <Location />
        </div>
      </SlidingPanel>
    </div>
  );
};

export const CalendarFiltersTranslated: ComponentType<Props> =
  withNamespaces()(CalendarFilters);
export default CalendarFilters;
