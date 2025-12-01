// ADR: modules/src/Medical/documentation/adr/001.emr-constraints-object.md
// @flow
import { useEffect, useState } from 'react';
import type { Node } from 'react';
import moment from 'moment';
import { useGetAthleteDataQuery } from '../../redux/services/medicalShared';

import type {
  Period,
  OrganisationStatus,
} from '../../types/medical/Constraints';

type Props = {
  athleteId: ?number,
  disableMaxDate?: boolean,
  children: Function,
};

// The default value for an athlete selector
// We need this as when the lst of athletes is fetched for an org,
// past athletes won't be present. So we need to mock the value for the
// athlete selector dropdown to not break the UI and allow
// the relevant form to be submitted - if validation is present on the athlete selector field
type SelectorOption = { label: string, value: string | number | null };

type RenderArgs = {
  lastActivePeriod: Period,
  athleteSelector: Array<SelectorOption>,
  isLoading: boolean,
  organisationStatus: OrganisationStatus,
};

// Adding this as when running locally, not all athletes have a valid transfer_record created:
// The active_periods reads from the player_movements table.
// If the table has not been populated, it shoud be on prod, it will break the UI
// The spec if that we should always return an empty record regardless and
// this is just defensive programming
const generateFailsafe = (): Period => {
  return { start: null, end: null };
};

const AthleteConstraints = (props: Props): Node => {
  // Using an RTK query here as it's incredibly likley we will have multiple fields
  // on the one form that need constraints applied. And no one likes
  // multiple requests for the same resource
  // We may also have additional requests in another area. And we can hit the cache or fetch
  const { data: athleteData, isLoading: isAthleteDataLoading } =
    useGetAthleteDataQuery(props.athleteId, { skip: !props.athleteId });

  const [lastActivePeriod, setLastActivePeriod] = useState<Period>({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (athleteData && props.athleteId) {
      if (athleteData?.constraints?.active_periods.length === 0) {
        setLastActivePeriod(generateFailsafe());
      } else if (
        athleteData?.constraints?.organisation_status === 'PAST_ATHLETE'
      ) {
        setLastActivePeriod(athleteData?.constraints?.active_periods[0]);
      } else {
        setLastActivePeriod({
          start: athleteData?.constraints?.active_periods[0].start,
          end: props.disableMaxDate ? null : moment(),
        });
      }
    }
  }, [athleteData, props.disableMaxDate, props.athleteId]);

  const renderArgs: RenderArgs = {
    lastActivePeriod,
    athleteSelector: [
      {
        label: athleteData?.fullname || '',
        value: props.athleteId || null,
      },
    ],
    isLoading: isAthleteDataLoading,
    organisationStatus:
      athleteData?.constraints?.organisation_status || 'CURRENT_ATHLETE',
  };

  return <>{props.children(renderArgs)}</>;
};

export default AthleteConstraints;
