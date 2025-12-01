// @flow

import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  AthleteWithSqauds,
  CustomEvent,
} from '@kitman/common/src/types/Event';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import { AthletesTabHeaderTranslated as AthletesTabHeader } from '@kitman/modules/src/PlanningEvent/src/components/CustomEventsAthletesTab/components/AthletesTabHeader';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';

import { AthletesTabTableTranslated as AthletesTabTable } from './components/AthletesTabTable';

export type Props = {
  athletes: AthleteWithSqauds[],
  event: CustomEvent,
  onUpdateEvent: Function,
  participationLevels: Array<ParticipationLevel>,
  canEditEvent: boolean,
};

const CustomEventsAthletesTab = (props: I18nProps<Props>) => {
  return (
    <PlanningTab>
      <AthletesTabHeader {...props} />
      <AthletesTabTable
        event={props.event}
        participationLevels={props.participationLevels}
        canEditEvent={props.canEditEvent}
      />
    </PlanningTab>
  );
};

export const CustomEventsAthletesTabTranslated: ComponentType<Props> =
  withNamespaces()(CustomEventsAthletesTab);
export default CustomEventsAthletesTab;
