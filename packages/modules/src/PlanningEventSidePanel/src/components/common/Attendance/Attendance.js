// @flow

import { colors } from '@kitman/common/src/variables';
import { Accordion } from '@kitman/components';
import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';
import type {
  OnUpdateEventDetails,
  CommonAttributesValidity,
  EventFormData,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { SquadAthletes } from '@kitman/components/src/Athletes/types';
import { creatableEventTypeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';

import { isEventShared } from '@kitman/common/src/utils/events';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { PlanningEventAthleteSelectTranslated as PlanningEventAthleteSelect } from './PlanningEventAthleteSelect/PlanningEventAthleteSelect';
import { PlanningEventStaffSelectTranslated as PlanningEventStaffSelect } from './PlanningEventStaffSelect/PlanningEventStaffSelect';
import SharedAthleteSelect from './SharedAthleteSelect';

const getFeatureFlags = () => ({
  showAthleteDropdown: window.getFlag(
    'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
  ),
  planningSelectionTab: window.getFlag('planning-selection-tab'),
  gameDetails: window.getFlag('game-details'),
  staffSelectionGames: window.getFlag('staff-selection-games'),
  sharedCustomEvent: window.getFlag('shared-custom-events'),
});

const shouldRenderAthleteSelect = (
  event: EventFormData,
  flags,
  isAssociationAdmin: boolean
): boolean => {
  if (isEventShared(event) && isAssociationAdmin) {
    return false;
  }

  switch (event.type) {
    case creatableEventTypeEnumLike.Session:
    case creatableEventTypeEnumLike.Game:
      return flags.showAthleteDropdown;
    case creatableEventTypeEnumLike.CustomEvent:
      return true;
    default:
      return false;
  }
};

const shouldRenderStaffSelect = (event: EventFormData, flags): boolean => {
  switch (event.type) {
    case creatableEventTypeEnumLike.Session:
      return flags.showAthleteDropdown && flags.planningSelectionTab;
    case creatableEventTypeEnumLike.Game:
      return flags.gameDetails && flags.staffSelectionGames;
    case creatableEventTypeEnumLike.CustomEvent:
      return true;
    default:
      return false;
  }
};

const shouldRenderSharedAthleteSelect = (
  event: EventFormData,
  flags,
  isAssociationAdmin: boolean
): boolean =>
  !!flags.sharedCustomEvent &&
  event.type === creatableEventTypeEnumLike.CustomEvent &&
  isEventShared(event) &&
  isAssociationAdmin;

type Props = {
  onUpdateEventDetails: OnUpdateEventDetails,
  event: EventFormData,
  eventValidity: CommonAttributesValidity,
  filteredAthletes?: SquadAthletes,
};

const Attendance = ({
  onUpdateEventDetails,
  event,
  eventValidity,
  filteredAthletes,
}: Props) => {
  const flags = getFeatureFlags();

  const { data: organisation } = useGetOrganisationQuery();
  const isAssociationAdmin = !!organisation?.association_admin;

  const showAthletes = shouldRenderAthleteSelect(
    event,
    flags,
    isAssociationAdmin
  );
  const showSharedAthletes = shouldRenderSharedAthleteSelect(
    event,
    flags,
    isAssociationAdmin
  );
  const showStaff = shouldRenderStaffSelect(event, flags);

  if (!showAthletes && !showStaff && !showSharedAthletes) return null;

  return (
    <div css={[style.singleColumnGrid, style.addTopMargin]}>
      <Accordion
        titleColour={colors.grey_200}
        isOpen
        title="Attendance"
        iconAlign="right"
        content={
          <div
            css={{
              marginTop: 16,
              '& div:last-child': { marginBottom: 0 },
            }}
          >
            {showAthletes && (
              <PlanningEventAthleteSelect
                onUpdateEventDetails={onUpdateEventDetails}
                athleteIds={event.athlete_ids ?? []}
                filteredAthletes={filteredAthletes}
              />
            )}

            {showSharedAthletes && (
              <SharedAthleteSelect
                athleteIds={event.athlete_ids ?? []}
                onUpdateEventDetails={onUpdateEventDetails}
              />
            )}

            {showStaff && (
              <PlanningEventStaffSelect
                event={event}
                eventValidity={eventValidity}
                onUpdateEventDetails={onUpdateEventDetails}
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default Attendance;
