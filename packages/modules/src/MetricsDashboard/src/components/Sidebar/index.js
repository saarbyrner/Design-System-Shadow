/* eslint-disable no-unused-vars */
// @flow
import { withNamespaces } from 'react-i18next';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { GroupBy } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteInfo from '../../containers/AthleteInfo';

type Props = {
  groupedAthletes: { [GroupBy]: Array<Athlete> },
  orderedGroup: Array<GroupBy>,
  groupingLabels: { [GroupBy]: string },
};

const Sidebar = ({
  groupedAthletes,
  orderedGroup,
  groupingLabels,
  t,
}: I18nProps<Props>) => {
  const sidebarContent = orderedGroup.map((heading) => {
    if (
      groupedAthletes[heading] === undefined ||
      groupedAthletes[heading].length === 0
    ) {
      return null;
    }

    const athletes = groupedAthletes[heading].map((athlete) => (
      <div key={athlete.id} className="athleteStatusSidebar__athlete">
        <AthleteInfo key={athlete.id} athlete={athlete} />
      </div>
    ));

    const headingLabel = groupingLabels[heading]
      ? groupingLabels[heading]
      : heading;
    return (
      <div key={heading} className="athleteStatusSidebar__section">
        <p className="athleteStatusSidebar__heading">{headingLabel}</p>
        {athletes}
      </div>
    );
  });

  return <div className="athleteStatusSidebar">{sidebarContent}</div>;
};

export const SidebarTranslated = withNamespaces()(Sidebar);
export default Sidebar;
