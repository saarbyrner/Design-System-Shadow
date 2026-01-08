// @flow
import { withNamespaces } from 'react-i18next';

import { Select, AthleteSelect } from '@kitman/components';
import Accordion from '@kitman/components/src/Accordion';
import { mapStaffToOptions } from '@kitman/modules/src/PlanningEventSidePanel/src/components/custom/CustomEventLayout';
import type {
  ID,
  SquadAthletesSelection,
  OnClearAllClickCallback,
} from '@kitman/components/src/Athletes/types';
import type { Translation } from '@kitman/common/src/types/i18n';
import {
  createAccordionContentStyles,
  accordionOverrideStyles,
} from './utils/styles';
import {
  createAthletesSelectValueProp,
  getAttendeesTranslatedTexts,
} from './utils/helpers';
import { useFilter } from './utils/hooks';
import {
  useGetSquadAthletesQuery,
  useGetStaffUsersQuery,
} from './redux/services/filters';
import AccordionTitle from './AccordionTitle';

const accordionContent = createAccordionContentStyles({
  includeBorderBottom: false,
});

const Attendees = ({ t }: { t: Translation }) => {
  const { filter: athletesFilter, setFilter: setAthletesFilter } =
    useFilter('athletes');
  const { filter: staffFilter, setFilter: setStaffFilter } = useFilter('staff');

  const { data: squadAthletes = { squads: [] } } = useGetSquadAthletesQuery();
  const { data: staffUsers } = useGetStaffUsersQuery();

  const athleteSelectValueProp = createAthletesSelectValueProp(athletesFilter);

  const athleteSelectOnChange = (
    selectedAthletes: SquadAthletesSelection[]
  ) => {
    const athleteIdsToSet: Array<ID> =
      selectedAthletes.length === 0 ? [] : selectedAthletes[0].athletes;
    setAthletesFilter(athleteIdsToSet);
  };

  const athleteSelectOnClearAllClick: OnClearAllClickCallback = (options) => {
    const receivedIds = new Set(options.map(({ id }) => id));
    const remainingAthleteIds =
      athletesFilter?.filter((id) => !receivedIds.has(id)) ?? [];
    setAthletesFilter(remainingAthleteIds);
  };

  const translations = getAttendeesTranslatedTexts(t);

  return (
    <Accordion
      title={
        <AccordionTitle
          translatedTitle={translations.title}
          numberOfActiveFilters={athletesFilter.length + staffFilter.length}
        />
      }
      isOpen
      overrideStyles={accordionOverrideStyles}
      content={
        <div css={accordionContent}>
          <AthleteSelect
            label={translations.athletes.label}
            placeholder={translations.athletes.placeholder}
            onChange={athleteSelectOnChange}
            squadAthletes={squadAthletes.squads}
            includeContextSquad={false}
            value={athleteSelectValueProp}
            isMulti
            isClearable
            menuPosition="absolute"
            onClearAllClick={athleteSelectOnClearAllClick}
          />
          <Select
            options={mapStaffToOptions(staffUsers ?? [])}
            label={translations.staff.label}
            placeholder={translations.staff.placeholder}
            invalid={false}
            value={staffFilter}
            onChange={setStaffFilter}
            isMulti
          />
        </div>
      }
    />
  );
};

export const AttendeesTranslated = withNamespaces()(Attendees);
export default Attendees;
